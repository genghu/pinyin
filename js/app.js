/* ============================================================
   app.js — 拼音读读读 · 页面逻辑（ES5 全浏览器兼容版）
   六大板块：声母 / 韵母 / 声调 / 拼读 / 音节表 / 跟读
   不使用箭头函数、let/const、模板字符串、默认参数等 ES6 语法，
   Chrome 49+（2016 年内核）、360 / QQ / UC 极速模式、Safari 9+、
   iOS / 安卓 / 微信内置浏览器均可运行，IE11 基本可用。
   ============================================================ */

function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); }
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* ---------- 音节总表：base（文件形式，v=ü）→ 声调串 ---------- */
var SYL = {};
(function () {
  var toks = DATA.sylRaw.split(/\s+/);
  for (var i = 0; i < toks.length; i++) {
    if (!toks[i]) continue;
    var p = toks[i].indexOf(':');
    if (p > 0) SYL[toks[i].slice(0, p)] = toks[i].slice(p + 1);
  }
})();

/* ---------- 声母教学顺序 & 归组提示 ---------- */
var SM_LIST = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'];
var SM_TIP = { '': { zh: '没有声母，韵母自己成为音节', id: 'Tanpa inisial — final berdiri sendiri sebagai suku kata' } };
(function () {
  for (var i = 0; i < DATA.shengmu.length; i++) {
    var g = DATA.shengmu[i];
    for (var j = 0; j < g.items.length; j++) {
      SM_TIP[g.items[j].py] = { zh: g.tipZh, id: g.tipId };
    }
  }
})();

/** 音节 → 所属声母组（zh ch sh 优先于 z c s；都不匹配归零声母） */
function groupOf(base) {
  if (base.indexOf('zh') === 0) return 'zh';
  if (base.indexOf('ch') === 0) return 'ch';
  if (base.indexOf('sh') === 0) return 'sh';
  var c = base.charAt(0);
  return SM_LIST.indexOf(c) >= 0 ? c : '';
}

var APP = {
  tab: 'sm',
  blendSel: { sm: 'b', ym: 'a' },
  tableSel: 'b',
  tableQuery: '',

  TABS: [
    { id: 'sm', zh: '声母', idn: 'Inisial', ico: '🔤' },
    { id: 'ym', zh: '韵母', idn: 'Final', ico: '🎵' },
    { id: 'tone', zh: '声调', idn: 'Nada', ico: '🎶' },
    { id: 'blend', zh: '拼读', idn: 'Gabung', ico: '🧩' },
    { id: 'table', zh: '音节表', idn: 'Tabel', ico: '📋' },
    { id: 'repeat', zh: '跟读', idn: 'Rekam', ico: '🎙️' }
  ],

  init: function () {
    var i, t, a;
    /* 底部导航 */
    var nav = $('#bottomNav');
    for (i = 0; i < this.TABS.length; i++) {
      t = this.TABS[i];
      a = document.createElement('a');
      a.href = '#' + t.id;
      a.setAttribute('data-nav', t.id);
      a.innerHTML = '<span class="ico">' + t.ico + '</span><span class="lbl">' + t.zh + '<span class="lbl-id">' + t.idn + '</span></span>';
      nav.appendChild(a);
    }
    /* 顶部控制条：慢速 / 停止 */
    var self = this;
    $('#btnSlow').onclick = function () {
      AU.slow = !AU.slow;
      this.innerHTML = AU.slow ? '🐢 慢速：开' : '🐢 慢速：关';
      this.className = 'ctrl-btn' + (AU.slow ? ' on' : '');
    };
    $('#btnStop').onclick = function () { AU.stop(); };

    if (window.addEventListener) window.addEventListener('hashchange', function () { self.route(); }, false);
    this.route();
  },

  route: function () {
    var h = location.hash.replace('#', '');
    var ok = false;
    for (var i = 0; i < this.TABS.length; i++) if (this.TABS[i].id === h) ok = true;
    this.show(ok ? h : 'sm');
  },

  show: function (tab) {
    AU.stop();
    this.tab = tab;
    var links = $$('#bottomNav a');
    for (var i = 0; i < links.length; i++) {
      var on = links[i].getAttribute('data-nav') === tab;
      links[i].className = on ? 'active' : '';
    }
    var main = $('#view');
    main.innerHTML = '';
    this['tab_' + tab](main);
    window.scrollTo(0, 0);
  },

  /* ================= 声母 / 韵母 点读卡 ================= */
  drawSoundGroups: function (main, groups, kind) {   /* kind: 'sm' | 'ym' */
    for (var gi = 0; gi < groups.length; gi++) {
      var g = groups[gi];
      var sec = document.createElement('div');
      sec.className = 'card';
      var chain = document.createElement('button');
      chain.className = 'btn small secondary chain-btn';
      chain.innerHTML = '▶ 连读本组 <span class="id-inline">Baca berurutan</span>';
      sec.innerHTML = '<h3>' + esc(g.name) + '</h3>' +
        '<div class="id-text">' + esc(g.tipId) + '</div>' +
        '<div class="tip-zh-line">' + esc(g.tipZh) + '</div>';
      sec.appendChild(chain);

      /* 要领面板：放在每组卡片里，点卡片后在这里显示 */
      var panel = document.createElement('div');
      panel.className = 'info-panel';
      panel.innerHTML = '<div class="cn-tip">👆 点击卡片听真人发音，发音要领显示在这里</div>' +
        '<div class="id-tip">Ketuk kartu untuk mendengar rekaman asli; tips pelafalan muncul di sini</div>';
      sec.appendChild(panel);

      var grid = document.createElement('div');
      grid.className = 'sound-grid';
      var chainList = [];
      for (var ii = 0; ii < g.items.length; ii++) {
        (function (it, card_, panel_, kind_) {
          var card = document.createElement('button');
          card.className = 'sound-card';
          if (kind_ === 'sm') {
            card.innerHTML = '<div class="py">' + esc(it.py) + '</div><div class="sub">读 ' + markTone(it.call, 1) + '</div>';
          } else {
            card.innerHTML = '<div class="py">' + markTone(it.py, 1) + '</div><div class="sub">' + esc(it.py) + '</div>';
          }
          card.onclick = function () {
            AU.play(kind_ + ':' + it.py, { el: card });
            panel_.innerHTML = '<div class="panel-py">' + esc(it.py) + '</div>' +
              '<div class="cn-tip">' + esc(it.tipZh) + '</div>' +
              '<div class="id-tip">' + esc(it.tipId) + '</div>' +
              '<div class="demo-row"><span class="demo-lbl">拼读音节 / Suku kata:</span></div>';
            var row = $('.demo-row', panel_);
            for (var k = 0; k < it.demo.length; k++) {
              (function (b) {
                var chip = document.createElement('button');
                chip.className = 'demo-chip';
                chip.innerHTML = '';
                chip.appendChild(document.createTextNode(markTone(b, 1)));
                chip.onclick = function () { AU.play('yj:' + toFileBase(b) + '1', { el: chip }); };
                row.appendChild(chip);
              })(it.demo[k]);
            }
          };
          grid.appendChild(card);
          chainList.push({ key: kind_ + ':' + it.py, el: card });
        })(g.items[ii], null, panel, kind);
      }
      chain.onclick = function () { AU.chain(chainList); };
      sec.appendChild(grid);
      main.appendChild(sec);
    }
  },

  tab_sm: function (main) { this.drawSoundGroups(main, DATA.shengmu, 'sm'); },
  tab_ym: function (main) { this.drawSoundGroups(main, DATA.yunmu, 'ym'); },

  /* ================= 声调 ================= */
  tab_tone: function (main) {
    var intro = document.createElement('div');
    intro.className = 'card';
    intro.innerHTML = '<h3>🎵 四个声调 · Empat Nada</h3>' +
      '<p style="font-size:14px;margin:.3em 0;">同样的音节，声调不同，意思完全不同。点击听一听！</p>' +
      '<p class="id-text">Suku kata yang sama, nada berbeda = arti berbeda. Ketuk untuk mendengar!</p>';
    main.appendChild(intro);

    var panel = document.createElement('div');
    panel.className = 'info-panel';
    panel.innerHTML = '<div class="cn-tip">👆 点击声调卡片</div><div class="id-tip">Ketuk kartu nada</div>';
    main.appendChild(panel);

    /* 声调走向图 */
    var LINES = ['8,9 52,9', '8,21 52,6', '8,22 24,15 34,19 52,5', '8,6 52,23'];
    var grid = document.createElement('div');
    grid.className = 'tone-grid';
    for (var i = 0; i < DATA.tones.length; i++) {
      (function (t, line, panel_) {
        var c = document.createElement('button');
        c.className = 'tone-card';
        c.innerHTML = '<svg viewBox="0 0 60 28" aria-hidden="true"><polyline points="' + line + '"/></svg>' +
          '<div class="ma">' + t.sample + '</div><div class="hz">' + t.hanzi + '</div>' +
          '<div class="nm">' + t.nameZh + '</div><div class="nm-id">' + t.nameId + '</div>';
        c.onclick = function () {
          AU.play(t.key, { el: c });
          panel_.innerHTML = '<div class="panel-py">' + t.mark + ' ' + t.sample + '</div>' +
            '<div class="cn-tip"><b>' + t.nameZh + '</b> · ' + t.tipZh + '</div>' +
            '<div class="id-tip">' + t.tipId + '</div>';
        };
        grid.appendChild(c);
      })(DATA.tones[i], LINES[i], panel);
    }
    main.appendChild(grid);

    /* 四声连唱 */
    var chant = document.createElement('div');
    chant.className = 'card';
    chant.innerHTML = '<h3>🎶 四声连唱 · Nyanyian Empat Nada</h3>' +
      '<p class="id-text">Dengarkan keempat nada secara berurutan, lalu ikuti membaca!</p>' +
      '<div class="chant-stage" id="chantStage"><span class="chant-hint">先选一个音节 / Pilih suku kata dulu</span></div>' +
      '<div class="chip-bar" id="chantChips"></div>';
    main.appendChild(chant);
    var chips = $('#chantChips', chant);
    for (var ci = 0; ci < DATA.toneChant.length; ci++) {
      (function (b, chant_) {
        var chip = document.createElement('button');
        chip.className = 'chip';
        chip.innerHTML = '';
        chip.appendChild(document.createTextNode(b.replace(/v/g, 'ü')));
        chip.onclick = function () {
          var stage = $('#chantStage', chant_);
          var tones = (SYL[b] || '1234').split('');
          stage.innerHTML = '';
          var els = [];
          for (var i = 0; i < tones.length; i++) {
            (function (tn) {
              var s = document.createElement('span');
              s.className = 'chant-syl';
              s.innerHTML = '';
              s.appendChild(document.createTextNode(markTone(b, +tn)));
              stage.appendChild(s);
              els.push({ key: 'yj:' + b + tn, el: s });
            })(tones[i]);
          }
          AU.chain(els, 320);
        };
        chips.appendChild(chip);
      })(DATA.toneChant[ci], chant);
    }
  },

  /* ================= 拼读实验室 ================= */
  tab_blend: function (main) {
    var self = this;
    var card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3>🧩 拼读实验室 · Laboratorium Gabungan</h3>' +
      '<p style="font-size:14px;margin:.3em 0;">选一个<b>声母</b> + 一个<b>韵母</b>，听听它们拼出来的音节！</p>' +
      '<p class="id-text">Pilih satu <b>inisial</b> + satu <b>final</b>, lalu dengarkan suku kata hasilnya!</p>' +
      '<div class="rhyme">📖 口诀：前音轻短后音重，两音相连猛一碰！<br>' +
      '<span class="id-text">Bunyi awal ringan &amp; pendek, bunyi akhir penuh — lalu gabungkan sekaligus!</span></div>' +
      '<div class="blend-lbl">① 声母 Inisial</div><div class="chip-bar" id="bSm"></div>' +
      '<div class="blend-lbl">② 韵母 Final</div><div class="chip-bar wrap" id="bYm"></div>' +
      '<div class="blend-lbl">③ 结果 Hasil</div><div class="blend-result" id="bRes"></div>';
    main.appendChild(card);

    var smBar = $('#bSm', card), ymBar = $('#bYm', card), res = $('#bRes', card);

    for (var i = 0; i < SM_LIST.length; i++) {
      (function (s, smBar_, ymBar_) {
        var b = document.createElement('button');
        b.className = 'chip' + (s === self.blendSel.sm ? ' active' : '');
        b.innerHTML = '';
        b.appendChild(document.createTextNode(s));
        b.onclick = function () {
          self.blendSel.sm = s;
          var chips = $$('.chip', smBar_);
          for (var k = 0; k < chips.length; k++) chips[k].className = 'chip';
          b.className = 'chip active';
          self.drawBlend(res);
        };
        smBar_.appendChild(b);
      })(SM_LIST[i], smBar, ymBar);
    }
    for (var j = 0; j < DATA.blendFinals.length; j++) {
      (function (f, ymBar_) {
        var b = document.createElement('button');
        b.className = 'chip' + (f === self.blendSel.ym ? ' active' : '');
        b.innerHTML = '';
        b.appendChild(document.createTextNode(f));
        b.onclick = function () {
          self.blendSel.ym = f;
          var chips = $$('.chip', ymBar_);
          for (var k = 0; k < chips.length; k++) chips[k].className = 'chip';
          b.className = 'chip active';
          self.drawBlend(res);
        };
        ymBar_.appendChild(b);
      })(DATA.blendFinals[j], ymBar);
    }
    this.drawBlend(res);
  },

  drawBlend: function (res) {
    var sm = this.blendSel.sm, ym = this.blendSel.ym;
    /* j q x y 后面的 ü 行按拼写规则改写（ü→u、üe→ue、ün→un） */
    var f = ym;
    if ('jqxy'.indexOf(sm) >= 0) {
      if (f === 'ü') f = 'u';
      else if (f === 'üe') f = 'ue';
      else if (f === 'ün') f = 'un';
    }
    var fileBase = toFileBase(sm + f);
    var tones = SYL[fileBase];
    if (!tones) {
      res.innerHTML = '<div class="blend-no">✗ <b>' + esc(sm) + '</b> + <b>' + esc(ym) + '</b> 不相拼' +
        '<div class="id-text">Inisial dan final ini tidak digabungkan dalam bahasa Mandarin. Coba kombinasi lain!</div></div>';
      return;
    }
    res.innerHTML = '';
    var formula = document.createElement('div');
    formula.className = 'blend-formula';
    formula.innerHTML = '<span class="f-sm">' + esc(sm) + '</span><span class="f-plus">+</span><span class="f-ym">' + esc(ym) + '</span><span class="f-plus">=</span>';
    res.appendChild(formula);
    var els = [];
    var arr = tones.split('');
    for (var i = 0; i < arr.length; i++) {
      (function (tn) {
        var b = document.createElement('button');
        b.className = 'blend-tone';
        b.innerHTML = '';
        b.appendChild(document.createTextNode(markTone(fileBase, +tn)));
        var sup = document.createElement('i');
        sup.innerHTML = '';
        sup.appendChild(document.createTextNode(String(tn)));
        b.appendChild(sup);
        b.onclick = function () { AU.play('yj:' + fileBase + tn, { el: b }); };
        formula.appendChild(b);
        els.push({ key: 'yj:' + fileBase + tn, el: b });
      })(arr[i]);
    }
    var play = document.createElement('button');
    play.className = 'btn small';
    play.style.marginTop = '10px';
    play.innerHTML = '▶ 四声连读 <span class="id-inline">Baca 4 nada</span>';
    play.onclick = function () { AU.chain(els, 300); };
    res.appendChild(play);
  },

  /* ================= 音节表 ================= */
  tab_table: function (main) {
    var self = this;
    var card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3>📋 音节总表 · Tabel Suku Kata</h3>' +
      '<p class="id-text">' + Object.keys(SYL).length + ' suku kata × 4 nada — semua dengan rekaman asli. Ketuk untuk mendengar!</p>' +
      '<div class="chip-bar wrap" id="tChips"></div>' +
      '<input id="tSearch" class="search-input" type="search" placeholder="🔍 搜音节 / cari suku kata (如: hao, lv, ü)" autocomplete="off">' +
      '<div id="tBody"></div>';
    main.appendChild(card);

    var chips = $('#tChips', card);
    var groups = SM_LIST.concat(['']);
    for (var i = 0; i < groups.length; i++) {
      (function (s, chips_) {
        var b = document.createElement('button');
        b.className = 'chip' + (s === self.tableSel ? ' active' : '');
        b.innerHTML = '';
        b.appendChild(document.createTextNode(s === '' ? '∅' : s));
        b.title = s === '' ? '零声母 / tanpa inisial' : (SM_TIP[s] ? SM_TIP[s].id : s);
        b.onclick = function () {
          self.tableSel = s;
          self.tableQuery = '';
          $('#tSearch', card).value = '';
          var all = $$('.chip', chips_);
          for (var k = 0; k < all.length; k++) all[k].className = 'chip';
          b.className = 'chip active';
          self.drawTable($('#tBody', card));
        };
        chips_.appendChild(b);
      })(groups[i], chips);
    }
    $('#tSearch', card).oninput = function (e) {
      self.tableQuery = (e.target.value || '').replace(/^\s+|\s+$/g, '').toLowerCase();
      self.drawTable($('#tBody', card));
    };
    this.drawTable($('#tBody', card));
  },

  /** 一行音节：bā bá bǎ bà + 整行连读 */
  sylRow: function (base) {
    var row = document.createElement('div');
    row.className = 'syl-row';
    var tones = (SYL[base] || '1234').split('');
    var label = document.createElement('span');
    label.className = 'syl-base';
    label.innerHTML = '';
    label.appendChild(document.createTextNode(base.replace(/v/g, 'ü')));
    row.appendChild(label);
    var els = [];
    for (var i = 0; i < tones.length; i++) {
      (function (tn) {
        var b = document.createElement('button');
        b.className = 'syl-tone';
        b.innerHTML = '';
        b.appendChild(document.createTextNode(markTone(base, +tn)));
        b.onclick = function () { AU.play('yj:' + base + tn, { el: b }); };
        row.appendChild(b);
        els.push({ key: 'yj:' + base + tn, el: b });
      })(tones[i]);
    }
    var p = document.createElement('button');
    p.className = 'row-play';
    p.title = '四声连读 / baca 4 nada';
    p.innerHTML = '▶';
    p.onclick = function () { AU.chain(els, 280); };
    row.appendChild(p);
    return row;
  },

  drawTable: function (body) {
    body.innerHTML = '';
    var i;

    /* 搜索模式：跨所有声母组查找 */
    if (this.tableQuery) {
      var q = this.tableQuery.replace(/ü/g, 'v');
      var all = Object.keys(SYL);
      var hits = [];
      for (i = 0; i < all.length; i++) if (all[i].indexOf(q) >= 0) hits.push(all[i]);
      hits.sort();
      var sh = document.createElement('div');
      sh.className = 'tbl-head';
      sh.innerHTML = hits.length
        ? '🔍 找到 <b>' + hits.length + '</b> 个音节 · <span class="id-inline">ditemukan</span>'
        : '🔍 没有找到 · <span class="id-inline">tidak ditemukan — coba kata lain</span>';
      body.appendChild(sh);
      for (i = 0; i < hits.length; i++) body.appendChild(this.sylRow(hits[i]));
      return;
    }

    /* 分组模式 */
    var g = this.tableSel;
    var bases = Object.keys(SYL).filter(function (b) { return groupOf(b) === g; });
    /* 注意：IE11 的 filter 回调没有 this 问题，但 groupOf 需要按值比较 */
    var tip = SM_TIP[g] || {};
    var head = document.createElement('div');
    head.className = 'tbl-head';
    head.innerHTML = '<div class="tbl-title"><span class="tbl-initial">' + (g === '' ? '∅' : esc(g)) + '</span>' +
      '<span class="tbl-count">' + bases.length + ' 个音节 · suku kata</span></div>' +
      '<div class="tip-zh-line">' + esc(tip.zh || '') + '</div><div class="id-text">' + esc(tip.id || '') + '</div>';
    body.appendChild(head);

    var self = this;
    var allBtn = document.createElement('button');
    allBtn.className = 'btn small block';
    allBtn.style.margin = '8px 0 4px';
    allBtn.innerHTML = '▶ 连读整组（每音节一声）<span class="id-inline">Baca seluruh grup</span>';
    body.appendChild(allBtn);

    var list = document.createElement('div');
    var els = [];
    for (i = 0; i < bases.length; i++) {
      var row = self.sylRow(bases[i]);
      list.appendChild(row);
      els.push({ key: 'yj:' + bases[i] + (SYL[bases[i]].charAt(0) || '1'), el: $('.syl-base', row) });
    }
    allBtn.onclick = function () { AU.chain(els, 260); };
    body.appendChild(list);
  },

  /* ================= 跟读（听 → 录音 → 对比） ================= */
  tab_repeat: function (main) {
    var card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3>🎙️ 跟读与录音对比 · Rekam &amp; Bandingkan</h3>' +
      '<p style="font-size:14px;margin:.3em 0;">① 选一个音 ② 听标准发音 ③ 录下你的发音 ④ 对比回放</p>' +
      '<p class="id-text">Pilih bunyi → dengarkan contoh → rekam suaramu → bandingkan!</p>';
    main.appendChild(card);

    /* 下拉选择：声母 / 韵母 / 常用音节 */
    var sel = document.createElement('select');
    sel.className = 'search-input';
    sel.style.width = '100%';
    var cats = [
      { label: '声母 · Inisial', items: [] },
      { label: '韵母 · Final', items: [] },
      { label: '常用音节 · Suku kata', items: [] }
    ];
    var i, j, it;
    for (i = 0; i < DATA.shengmu.length; i++) {
      it = DATA.shengmu[i];
      for (j = 0; j < it.items.length; j++) {
        cats[0].items.push({ label: '声母 ' + it.items[j].py + '（' + markTone(it.items[j].call, 1) + '）', key: 'sm:' + it.items[j].py });
      }
    }
    for (i = 0; i < DATA.yunmu.length; i++) {
      it = DATA.yunmu[i];
      for (j = 0; j < it.items.length; j++) {
        cats[1].items.push({ label: '韵母 ' + it.items[j].py + '（' + markTone(it.items[j].py, 1) + '）', key: 'ym:' + it.items[j].py });
      }
    }
    var pick = [['bā', 'ba1'], ['pá', 'pa2'], ['mǎ', 'ma3'], ['mà', 'ma4'], ['gē', 'ge1'], ['māo', 'mao1'], ['zhōng', 'zhong1'], ['shān', 'shan1'], ['xiè', 'xie4'], ['lǜ', 'lv4']];
    for (i = 0; i < pick.length; i++) {
      cats[2].items.push({ label: '音节 ' + pick[i][0], key: 'yj:' + pick[i][1] });
    }
    for (i = 0; i < cats.length; i++) {
      var og = document.createElement('optgroup');
      og.label = cats[i].label;
      for (j = 0; j < cats[i].items.length; j++) {
        var op = document.createElement('option');
        op.value = cats[i].items[j].key;
        op.innerHTML = '';
        op.appendChild(document.createTextNode(cats[i].items[j].label));
        og.appendChild(op);
      }
      sel.appendChild(og);
    }
    card.appendChild(sel);

    var box = document.createElement('div');
    box.className = 'record-box';
    box.innerHTML =
      '<div class="rec-btns">' +
      '<button class="btn secondary" id="rpStd">🔊 标准发音</button>' +
      '<button class="btn secondary" id="rpSlow">🐢 慢速</button></div>' +
      '<button class="record-btn" id="rpRec" title="录音 / Rekam">🎙️</button>' +
      '<div id="rpStatus" class="rec-status">点击麦克风开始录音<br><span class="id-text">Ketuk ikon mikrofon untuk mulai merekam</span></div>' +
      '<div id="rpAudio" class="rec-result"></div>';
    card.appendChild(box);

    $('#rpStd', box).onclick = function () { AU.play(sel.value); };
    $('#rpSlow', box).onclick = function () { AU.play(sel.value, { rate: AU.rate }); };

    var btn = $('#rpRec', box), status = $('#rpStatus', box), audioBox = $('#rpAudio', box);
    btn.onclick = function () {
      if (!Recorder.supported()) {
        status.innerHTML = Recorder.blockedByContext()
          ? '🎤 此网页环境无法使用麦克风。<br>请改用 <b>https</b> 网址，或把整个文件夹下载到电脑本地打开。<br><span class="id-text">Mikrofon tidak tersedia: gunakan alamat https, atau buka file ini secara lokal (offline).</span>'
          : '此浏览器不支持录音，请改用较新的 Chrome / Edge / Safari。<br><span class="id-text">Browser ini tidak mendukung perekaman; gunakan Chrome / Edge / Safari terbaru.</span>';
        return;
      }
      if (Recorder.recording) {
        Recorder.stop().then(function (url) {
          btn.className = 'record-btn';
          status.innerHTML = '✅ 录音完成！先听标准发音，再听你的录音，像不像？<br><span class="id-text">Rekaman selesai! Bandingkan dengan contoh — apakah mirip?</span>';
          audioBox.innerHTML = '';
          function playMine() { var a = new Audio(url); var p = a.play(); if (p && p['catch']) p['catch'](function () {}); }
          function mk(cls, html, fn) {
            var b = document.createElement('button');
            b.className = 'btn ' + cls;
            b.innerHTML = html;
            b.onclick = fn;
            audioBox.appendChild(b);
          }
          mk('secondary', '🔊 ① 标准发音', function () { AU.play(sel.value, { onend: function () { setTimeout(playMine, 600); } }); });
          mk('secondary', '🎤 ② 我的录音', playMine);
          mk('', '⏭ A/B 连播对比', function () { AU.play(sel.value, { onend: function () { setTimeout(playMine, 500); } }); });
        });
        return;
      }
      AU.stop();
      Recorder.start().then(function () {
        btn.className = 'record-btn rec';
        status.innerHTML = '🔴 录音中…读完再点一次停止<br><span class="id-text">Sedang merekam… ketuk lagi untuk berhenti</span>';
      }, function () {
        status.innerHTML = '无法访问麦克风，请允许浏览器使用麦克风。<br><span class="id-text">Izinkan akses mikrofon di browser (klik "Izinkan").</span>';
      });
    };
  }
};

APP.init();

/* ============================================================
   audio.js — 真人录音播放服务（全部本地 mp3，无需联网）
   ------------------------------------------------------------
   全浏览器兼容版：ES5 语法，Chrome 49+ / Edge / 360 / QQ / UC /
   Safari 9+ / iOS / 安卓 / 微信内置浏览器均可用，IE11 基本可用。
   ------------------------------------------------------------
   录音目录（相对网页；目录、文件名全部为英文数字，
   任何服务器、任何系统解压压缩包都不会乱码）：
     audio/sm/b.mp3    → key 'sm:b'（声母）
     audio/ym/a.mp3    → key 'ym:a'（韵母；ü 写作 yu、üe→yue、ün→yun；
                          资源包缺 a.mp3，程序自动用 yj/a1.mp3 代替）
     audio/yj/ma3.mp3  → key 'yj:ma3'（音节，ü 写作 v，如 lv3 = lǜ）
   特例：jǜ 的录音文件是 jv4.mp3（ju1~ju3 正常）
   AU.play(key) 单个播放；AU.chain([...]) 连读（逐个播放 + 高亮）
   ============================================================ */

/* ---- 最小 Promise 垫片：供极老浏览器使用（现代浏览器自带） ---- */
if (!window.Promise) {
  window.Promise = function (executor) {
    this._state = 0; this._value = null; this._cbs = [];
    var self = this;
    function settle(state, value) {
      if (self._state) return;
      self._state = state; self._value = value;
      setTimeout(function () {
        for (var i = 0; i < self._cbs.length; i++) self._cbs[i]();
      }, 0);
    }
    executor(function (v) { settle(1, v); }, function (e) { settle(2, e); });
  };
  window.Promise.prototype.then = function (onOk, onErr) {
    var self = this;
    function run() {
      var fn = self._state === 1 ? onOk : onErr;
      if (typeof fn === 'function') { try { fn(self._value); } catch (e) {} }
    }
    if (this._state) setTimeout(run, 0); else this._cbs.push(run);
    return this;   /* 本站用法只有一层 then/catch，不链式传值 */
  };
  window.Promise.prototype['catch'] = function (onErr) { return this.then(null, onErr); };
}

/* 音节文件名特例：显示形式 → 实际文件名 */
var YJ_FILE_FIX = { 'ju4': 'jv4' };

/* 韵母 → 文件名（ü 行改用 yu/yue/yun，避免特殊字符文件名） */
var YM_FILE = { 'ü': 'yu', 'üe': 'yue', 'ün': 'yun' };

/* 带调字符 → [ 原形, 声调 ]（解析输入用） */
var PY_TONE_CHAR = {
  'ā': ['a', 1], 'á': ['a', 2], 'ǎ': ['a', 3], 'à': ['a', 4],
  'ō': ['o', 1], 'ó': ['o', 2], 'ǒ': ['o', 3], 'ò': ['o', 4],
  'ē': ['e', 1], 'é': ['e', 2], 'ě': ['e', 3], 'è': ['e', 4],
  'ī': ['i', 1], 'í': ['i', 2], 'ǐ': ['i', 3], 'ì': ['i', 4],
  'ū': ['u', 1], 'ú': ['u', 2], 'ǔ': ['u', 3], 'ù': ['u', 4],
  'ǖ': ['ü', 1], 'ǘ': ['ü', 2], 'ǚ': ['ü', 3], 'ǜ': ['ü', 4]
};

/* 声调符号放置：a→o→e 优先，其余标在最后一个 i/u/ü 上（iu 标 u、ui 标 i） */
var TONE_MARKS = {
  a: 'āáǎà', o: 'ōóǒò', e: 'ēéěè',
  i: 'īíǐì', u: 'ūúǔù', ü: 'ǖǘǚǜ'
};

/** 音节 + 声调 → 带调显示形式。base 可用文件形式（v）或显示形式（ü） */
function markTone(base, tone) {
  var s = String(base).replace(/v/g, 'ü');
  var idx = -1, i, ch;
  for (i = 0; i < s.length; i++) {
    ch = s.charAt(i);
    if (ch === 'a' || ch === 'o' || ch === 'e') { idx = i; break; }
  }
  if (idx < 0) {
    for (i = s.length - 1; i >= 0; i--) {
      ch = s.charAt(i);
      if (ch === 'i' || ch === 'u' || ch === 'ü') { idx = i; break; }
    }
  }
  if (idx < 0) return s;
  var row = TONE_MARKS[s.charAt(idx)];
  if (!row) return s;
  return s.slice(0, idx) + row.charAt(tone - 1) + s.slice(idx + 1);
}

/** 显示形式（ü）→ 文件形式（v） */
function toFileBase(base) { return String(base).replace(/ü/g, 'v'); }

var AU = {
  slow: false,          /* 全局慢速开关 */
  rate: 0.6,            /* 慢速播放倍速（保音调不变） */
  _audio: null,
  _el: null,
  _seq: 0,              /* 单曲播放序号（连点时作废旧播放） */
  _cseq: 0,             /* 连读序号（停止连读用） */

  /** key → mp3 地址 */
  url: function (key) {
    var i = key.indexOf(':');
    var kind = key.slice(0, i), name = key.slice(i + 1);
    var path;
    if (kind === 'sm') {
      path = 'audio/sm/' + name + '.mp3';
    } else if (kind === 'ym') {
      if (name === 'a') path = 'audio/yj/a1.mp3';                 /* 资源包缺 a.mp3 */
      else path = 'audio/ym/' + (YM_FILE[name] || name) + '.mp3';
    } else {
      path = 'audio/yj/' + (YJ_FILE_FIX[name] || name) + '.mp3';
    }
    return encodeURI(path);
  },

  /** 停止当前播放与连读 */
  stop: function () {
    this._seq++;
    this._cseq++;
    this._halt();
    var els = document.getElementsByTagName('*');
    for (var i = 0; i < els.length; i++) {
      if (els[i].className && (' ' + els[i].className + ' ').indexOf(' playing ') >= 0) {
        els[i].className = (' ' + els[i].className + ' ').replace(' playing ', ' ').replace(/^\s+|\s+$/g, '');
      }
    }
  },

  /** 只停掉正在响的那一个（不影响排队中的连读） */
  _halt: function () {
    if (this._audio) {
      try { this._audio.pause(); } catch (e) {}
      this._audio = null;
    }
    if (this._el) {
      this._el.className = (' ' + this._el.className + ' ').replace(' playing ', ' ').replace(/^\s+|\s+$/g, '');
      this._el = null;
    }
  },

  /** 播放一个录音。opt: { rate, onend, onerror, el } */
  play: function (key, opt) {
    opt = opt || {};
    var self = this;
    var seq = ++this._seq;
    this._halt();   /* 连点时先停上一个，避免声音重叠 */
    var el = this._el = opt.el || null;
    var a = this._audio = new Audio(this.url(key));
    var rate = opt.rate || (this.slow ? this.rate : 1);
    if (rate < 1) {
      a.playbackRate = rate;
      try { a.preservesPitch = true; } catch (e) {}         /* 慢放不变调 */
      try { a.webkitPreservesPitch = true; } catch (e) {}   /* Safari */
    }
    var done = function () {
      if (el) self._removeClass(el);
      if (self._el === el) self._el = null;
    };
    if (el) this._addClass(el);
    a.onended = function () {
      done();
      if (seq === self._seq && opt.onend) opt.onend();
    };
    var fail = function () {
      done();
      if (seq !== self._seq) return;
      toast('音频加载失败 / Gagal memuat audio');
      if (opt.onerror) opt.onerror();
    };
    a.onerror = fail;
    var p = a.play();                    /* 老浏览器 play() 不返回 Promise */
    if (p && p['catch']) p['catch'](fail);
  },

  /** 连读：list = [{ key, el }]，逐个播放并高亮，可随时 stop() */
  chain: function (list, gap) {
    if (!list || !list.length) return;
    gap = gap || 380;
    var seq = ++this._cseq;
    var self = this;
    this._seq++;   /* 作废可能正在播的单曲 */
    var step = function (i) {
      if (seq !== self._cseq) return;
      if (i >= list.length) return;
      var it = list[i];
      self.play(it.key, {
        el: it.el,
        onend: function () { if (seq === self._cseq) setTimeout(function () { step(i + 1); }, gap); },
        onerror: function () { if (seq === self._cseq) setTimeout(function () { step(i + 1); }, 150); }
      });
    };
    step(0);
  },

  /* class 列表增删（不用 classList，兼容极老浏览器） */
  _addClass: function (el) {
    var c = ' ' + (el.className || '');
    if (c.indexOf(' playing ') < 0) el.className = (el.className || '') + ' playing';
  },
  _removeClass: function (el) {
    el.className = (' ' + (el.className || '') + ' ').replace(' playing ', ' ').replace(/^\s+|\s+$/g, '');
  }
};

/* ---------- 通用提示条 ---------- */
function toast(msg, ms) {
  ms = ms || 2200;
  var el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
  el.innerHTML = '';
  el.appendChild(document.createTextNode(msg));
  var cls = el.className || '';
  if ((' ' + cls + ' ').indexOf(' show ') < 0) el.className = cls ? cls + ' show' : 'show';
  clearTimeout(el._t);
  el._t = setTimeout(function () {
    el.className = (' ' + (el.className || '') + ' ').replace(' show ', ' ').replace(/^\s+|\s+$/g, '');
  }, ms);
}

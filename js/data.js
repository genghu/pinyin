/* ============================================================
   data.js — 拼音读读读 · 教学数据（老师可编辑）
   ------------------------------------------------------------
   全浏览器兼容版：ES5 语法（var，无箭头函数）。
   声母 groups / 韵母 groups：分组点读卡
     py    卡片显示的字母
     call  呼读音（卡片小字显示，如 b 读 bō）
     tipZh 发音要领（中文）  tipId 发音要领（印尼语）
     demo  拼读音节示例（音节表里真实存在的音节，点击朗读一声）
   tones：四个声调（用 ma 的真人录音 ma1~ma4）
   sylRaw：音节总表（从录音文件名生成，base:声调）
     ü 在文件名中写作 v（lv = lǜ）；ju 的四声写作 jv4，播放层自动处理
   ============================================================ */

var DATA = {

  /* ---------- 声母 23 个 ---------- */
  shengmu: [
    {
      name: '第一组 b p m f', tipZh: '双唇音：都用嘴唇发音', tipId: 'Semua diucapkan dengan bibir',
      items: [
        { py: 'b', call: 'bo', tipZh: '双唇先闭住再放开，气流弱（不送气）', tipId: 'Bibir tertutup lalu buka; hembusan lemah', demo: ['bo', 'ba', 'bi', 'bu'] },
        { py: 'p', call: 'po', tipZh: '口型同 b，但气流很强，可以吹动纸片（送气）', tipId: 'Sama dengan b, tetapi hembusan kuat (bisa meniup kertas)', demo: ['po', 'pa', 'pi', 'pu'] },
        { py: 'm', call: 'mo', tipZh: '双唇闭合，气流从鼻腔出来', tipId: 'Bibir tertutup; udara keluar dari hidung', demo: ['mo', 'ma', 'mi', 'mu'] },
        { py: 'f', call: 'fo', tipZh: '上齿轻碰下唇，气流摩擦而出', tipId: 'Gigi atas menyentuh bibir bawah; udara tergesek keluar', demo: ['fo', 'fa', 'fu', 'fei'] }
      ]
    },
    {
      name: '第二组 d t n l', tipZh: '舌尖音：舌尖抵上齿龈', tipId: 'Ujung lidah menyentuh gusi atas',
      items: [
        { py: 'd', call: 'de', tipZh: '舌尖抵上齿龈，气流弱（不送气）', tipId: 'Ujung lidah di gusi atas; hembusan lemah', demo: ['de', 'da', 'di', 'du'] },
        { py: 't', call: 'te', tipZh: '口型同 d，气流强（送气）', tipId: 'Sama dengan d; hembusan kuat', demo: ['te', 'ta', 'ti', 'tu'] },
        { py: 'n', call: 'ne', tipZh: '舌尖抵齿龈，气流从鼻孔出来', tipId: 'Ujung lidah di gusi; udara keluar dari hidung', demo: ['ne', 'na', 'ni', 'nu'] },
        { py: 'l', call: 'le', tipZh: '舌尖抵齿龈，气流从舌头两边出来', tipId: 'Ujung lidah di gusi; udara keluar di sisi lidah', demo: ['le', 'la', 'li', 'liu'] }
      ]
    },
    {
      name: '第三组 g k h', tipZh: '舌根音：舌根抵软腭', tipId: 'Akar lidah menyentuh langit-langit lunak',
      items: [
        { py: 'g', call: 'ge', tipZh: '舌根抵软腭，气流弱（不送气）', tipId: 'Akar lidah ke langit-langit lunak; hembusan lemah', demo: ['ge', 'gu', 'ga', 'gao'] },
        { py: 'k', call: 'ke', tipZh: '口型同 g，气流强（送气）', tipId: 'Sama dengan g; hembusan kuat', demo: ['ke', 'ku', 'ka', 'kou'] },
        { py: 'h', call: 'he', tipZh: '舌根接近软腭，气流摩擦而出（比印尼语 h 更用力）', tipId: 'Seperti "h" bahasa Indonesia, tetapi lebih kuat', demo: ['he', 'hu', 'ha', 'hai'] }
      ]
    },
    {
      name: '第四组 j q x', tipZh: '舌面音：只和 i、ü 行的韵母相拼', tipId: 'Hanya digabungkan dengan final i / ü',
      items: [
        { py: 'j', call: 'ji', tipZh: '舌面抵硬腭，气流弱；近似 "ji" 连读', tipId: 'Bagian tengah lidah ke langit-langit keras; hembusan lemah', demo: ['ji', 'ju', 'jia', 'jie'] },
        { py: 'q', call: 'qi', tipZh: '口型同 j，气流强；近似印尼语 "c" 但更靠前', tipId: 'Sama dengan j, hembusan kuat; mirip "c" Indonesia', demo: ['qi', 'qu', 'qia', 'qie'] },
        { py: 'x', call: 'xi', tipZh: '近似印尼语 "s"，但舌位更靠前', tipId: 'Mirip "s" Indonesia, lidah lebih ke depan', demo: ['xi', 'xu', 'xia', 'xie'] }
      ]
    },
    {
      name: '第五组 zh ch sh r', tipZh: '翘舌音：舌尖翘起（印尼语没有，重点练！）', tipId: 'Lidah ditarik ke belakang (tidak ada di B. Indonesia — sering dilatih!)',
      items: [
        { py: 'zh', call: 'zhi', tipZh: '舌尖翘起抵硬腭前部，不送气', tipId: 'Lidah terangkat ke belakang; hembusan lemah', demo: ['zhi', 'zha', 'zhu', 'zhao'] },
        { py: 'ch', call: 'chi', tipZh: '口型同 zh，送气', tipId: 'Sama dengan zh; hembusan kuat', demo: ['chi', 'cha', 'chu', 'chao'] },
        { py: 'sh', call: 'shi', tipZh: '舌尖翘起，气流摩擦而出', tipId: 'Lidah terangkat; udara tergesek keluar', demo: ['shi', 'sha', 'shu', 'shao'] },
        { py: 'r', call: 'ri', tipZh: '口型同 sh，但声带要振动', tipId: 'Sama dengan sh, tetapi pita suara bergetar', demo: ['ri', 're', 'ru', 'rao'] }
      ]
    },
    {
      name: '第六组 z c s', tipZh: '平舌音：舌尖平放抵上齿背', tipId: 'Lidah datar di gigi bawah depan',
      items: [
        { py: 'z', call: 'zi', tipZh: '舌尖平抵上齿背，不送气', tipId: 'Ujung lidah datar di gigi atas; hembusan lemah', demo: ['zi', 'za', 'zu', 'zao'] },
        { py: 'c', call: 'ci', tipZh: '口型同 z，送气；像印尼语 "ts"', tipId: 'Sama dengan z; hembusan kuat, mirip "ts"', demo: ['ci', 'ca', 'cu', 'cao'] },
        { py: 's', call: 'si', tipZh: '舌尖接近上齿背，气流摩擦而出', tipId: 'Ujung lidah dekat gigi atas; udara tergesek keluar', demo: ['si', 'sa', 'su', 'sao'] }
      ]
    },
    {
      name: '第七组 y w', tipZh: '半元音：用在音节开头', tipId: 'Setengah vokal di awal suku kata',
      items: [
        { py: 'y', call: 'yi', tipZh: '快速滑向 i 音', tipId: 'Cepat meluncur ke bunyi "i"', demo: ['yi', 'ya', 'yu', 'ye'] },
        { py: 'w', call: 'wu', tipZh: '嘴唇拢圆，快速滑向 u 音', tipId: 'Bibir membulat, cepat meluncur ke "u"', demo: ['wu', 'wa', 'wo', 'wei'] }
      ]
    }
  ],

  /* ---------- 韵母 24 个 ---------- */
  yunmu: [
    {
      name: '单韵母（6个）', tipZh: '只有一个元音，口型保持不变', tipId: 'Vokal tunggal — bentuk mulut tidak berubah',
      items: [
        { py: 'a', tipZh: '嘴巴张大，舌位低平', tipId: 'Mulut terbuka lebar, seperti "a" saat ke dokter', demo: ['ba', 'ma', 'pa', 'fa'] },
        { py: 'o', tipZh: '嘴唇拢圆，舌位后半高', tipId: 'Bibir membulat, seperti "o"', demo: ['bo', 'po', 'mo', 'fo'] },
        { py: 'e', tipZh: '嘴巴半开，舌位后半高（不是印尼语 e pepet）', tipId: 'Mulut setengah terbuka; bukan "e" seperti dalam "enak"', demo: ['de', 'te', 'ne', 'le'] },
        { py: 'i', tipZh: '嘴角向两边展开', tipId: 'Sudut bibir ditarik ke samping, seperti "i" dalam "ini"', demo: ['bi', 'pi', 'mi', 'di'] },
        { py: 'u', tipZh: '嘴唇撮圆，留一个小孔', tipId: 'Bibir membulat kecil, seperti "u" dalam "buku"', demo: ['bu', 'pu', 'mu', 'fu'] },
        { py: 'ü', tipZh: '口型同 i，但嘴唇撮圆（说"i"的时候把嘴唇圆起来）', tipId: 'Ucapkan "i" lalu bibir dibulatkan', demo: ['lv', 'nv', 'ju', 'qu', 'xu', 'yu'] }
      ]
    },
    {
      name: '复韵母（9个）', tipZh: '两个或三个元音连读，口型要滑动', tipId: 'Vokal gabungan — bentuk mulut berubah saat mengucapkan',
      items: [
        { py: 'ai', tipZh: '先发 a，再滑向 i，一气呵成', tipId: 'Seperti "ai" dalam "pandai"', demo: ['bai', 'pai', 'mai', 'dai'] },
        { py: 'ei', tipZh: '先发 e，再滑向 i', tipId: 'Seperti "ei" dalam "lele"', demo: ['bei', 'pei', 'mei', 'fei'] },
        { py: 'ui', tipZh: '先发 u，再滑向 ei（写作 ui）', tipId: 'u lalu ei', demo: ['gui', 'kui', 'hui', 'dui'] },
        { py: 'ao', tipZh: '先发 a，再滑向 u（写作 ao）', tipId: 'Seperti "ao" dalam "kapal laut" (lao)', demo: ['bao', 'pao', 'mao', 'dao'] },
        { py: 'ou', tipZh: '先发 o，再滑向 u', tipId: 'Seperti "au" dalam "kalau"', demo: ['dou', 'tou', 'lou', 'zou'] },
        { py: 'iu', tipZh: '先发 i，再滑向 ou（写作 iu）', tipId: 'i lalu ou', demo: ['jiu', 'qiu', 'liu', 'niu'] },
        { py: 'ie', tipZh: '先发 i，再滑向 ê', tipId: 'Mirip "ye" dalam "yes" (Inggris)', demo: ['bie', 'pie', 'mie', 'die'] },
        { py: 'üe', tipZh: '先发 ü，再滑向 ê（j q x 后写作 ue）', tipId: 'ü lalu ê', demo: ['lve', 'nve', 'jue', 'que', 'xue', 'yue'] },
        { py: 'er', tipZh: '发 e 的同时把舌头卷起来（自己独立成一个音节）', tipId: 'e + lidah tergulung; berdiri sendiri sebagai suku kata', demo: ['er'] }
      ]
    },
    {
      name: '前鼻韵母（5个）', tipZh: '结尾舌尖抵上齿龈，发鼻音 n', tipId: 'Diakhiri bunyi hidung "n"',
      items: [
        { py: 'an', tipZh: '发 a 后舌尖抵上齿龈', tipId: 'Seperti "an" dalam "bulan"', demo: ['ban', 'pan', 'man', 'fan'] },
        { py: 'en', tipZh: '发 e 后舌尖抵上齿龈', tipId: 'Seperti "en" dalam "benar"', demo: ['ben', 'pen', 'men', 'fen'] },
        { py: 'in', tipZh: '发 i 后舌尖抵上齿龈', tipId: 'Seperti "in" dalam "pintu"', demo: ['bin', 'pin', 'min', 'nin'] },
        { py: 'un', tipZh: '发 u 后接鼻音 n', tipId: 'u lalu n', demo: ['dun', 'tun', 'lun', 'zhun'] },
        { py: 'ün', tipZh: '发 ü 后接鼻音 n', tipId: 'ü lalu n', demo: ['jun', 'qun', 'xun', 'yun'] }
      ]
    },
    {
      name: '后鼻韵母（4个）', tipZh: '结尾舌根抬起，发鼻音 ng', tipId: 'Diakhiri bunyi hidung "ng"',
      items: [
        { py: 'ang', tipZh: '发 a 后舌根抬起发 ng', tipId: 'Seperti "ang" dalam "sangat"', demo: ['bang', 'pang', 'mang', 'fang'] },
        { py: 'eng', tipZh: '发 e 后舌根抬起发 ng', tipId: 'e lalu ng', demo: ['beng', 'peng', 'meng', 'feng'] },
        { py: 'ing', tipZh: '发 i 后舌根抬起发 ng', tipId: 'i lalu ng', demo: ['bing', 'ping', 'ming', 'ning'] },
        { py: 'ong', tipZh: '发 o 后舌根抬起发 ng（嘴唇保持圆）', tipId: 'o lalu ng; bibir tetap membulat', demo: ['dong', 'tong', 'long', 'zhong'] }
      ]
    }
  ],

  /* ---------- 声调（ma 真人录音） ---------- */
  tones: [
    { n: 1, mark: 'ˉ', sample: 'mā', key: 'yj:ma1', hanzi: '妈', nameZh: '第一声 · 高平调', nameId: 'Nada 1 — tinggi dan datar',
      tipZh: '声音又高又平，从头到尾保持一样高', tipId: 'Suara tinggi dan rata dari awal sampai akhir' },
    { n: 2, mark: 'ˊ', sample: 'má', key: 'yj:ma2', hanzi: '麻', nameZh: '第二声 · 上升调', nameId: 'Nada 2 — naik',
      tipZh: '声音从中间往上升，像疑问的"啊？"', tipId: 'Suara naik, seperti bertanya "ya?"' },
    { n: 3, mark: 'ˇ', sample: 'mǎ', key: 'yj:ma3', hanzi: '马', nameZh: '第三声 · 降升调', nameId: 'Nada 3 — turun lalu naik',
      tipZh: '声音先降后升，像思考时的"嗯～"', tipId: 'Suara turun lalu naik sedikit' },
    { n: 4, mark: 'ˋ', sample: 'mà', key: 'yj:ma4', hanzi: '骂', nameZh: '第四声 · 下降调', nameId: 'Nada 4 — turun',
      tipZh: '声音从高处用力下降，像果断地说"不！"', tipId: 'Suara turun dengan tegas, seperti "Bukan!"' }
  ],

  /* 四声连唱用的音节（每个音节四声俱全） */
  toneChant: ['ma', 'ba', 'bo', 'yi', 'wu', 'yu', 'zhi'],

  /* ---------- 拼读实验室用的韵母 ---------- */
  blendFinals: ['a', 'o', 'e', 'i', 'u', 'ü', 'ai', 'ei', 'ui', 'ao', 'ou', 'iu', 'ie', 'üe', 'er', 'an', 'en', 'in', 'un', 'ün', 'ang', 'eng', 'ing', 'ong'],

  /* ---------- 音节总表（由 音节/ 文件名生成：422 个音节 × 四声） ---------- */
  sylRaw: [
    'a:1234 ai:1234 an:1234 ang:1234 ao:1234',
    'ba:1234 bai:1234 ban:1234 bang:1234 bao:1234 bei:1234 ben:1234 beng:1234 bi:1234 bian:1234 biao:1234 bie:1234 bin:1234 bing:1234 bo:1234 bu:1234',
    'ca:1234 cai:1234 can:1234 cang:1234 cao:1234 ce:1234 cei:1234 cen:1234 ceng:1234 cha:1234 chai:1234 chan:1234 chang:1234 chao:1234 che:1234 chen:1234 cheng:1234 chi:1234 chong:1234 chou:1234 chu:1234 chua:1234 chuai:1234 chuan:1234 chuang:1234 chui:1234 chun:1234 chuo:1234 ci:1234 cong:1234 cou:1234 cu:1234 cuan:1234 cui:1234 cun:1234 cuo:1234',
    'da:1234 dai:1234 dan:1234 dang:1234 dao:1234 de:1234 dei:1234 den:1234 deng:1234 di:1234 dia:1234 dian:1234 diao:1234 die:1234 ding:1234 diu:1234 dong:1234 dou:1234 du:1234 duan:1234 dui:1234 dun:1234 duo:1234',
    'e:1234 ei:1234 en:1234 eng:1234 er:1234',
    'fa:1234 fan:1234 fang:1234 fe:1234 fei:1234 fen:1234 feng:1234 fiao:1234 fo:1234 fou:1234 fu:1234',
    'ga:1234 gai:1234 gan:1234 gang:1234 gao:1234 ge:1234 gei:1234 gen:1234 geng:1234 gong:1234 gou:1234 gu:1234 gua:1234 guai:1234 guan:1234 guang:1234 gui:1234 gun:1234 guo:1234',
    'ha:1234 hai:1234 han:1234 hang:1234 hao:1234 he:1234 hei:1234 hen:1234 heng:1234 hong:1234 hou:1234 hu:1234 hua:1234 huai:1234 huan:1234 huang:1234 hui:1234 hun:1234 huo:1234',
    'ji:1234 jia:1234 jian:1234 jiang:1234 jiao:1234 jie:1234 jin:1234 jing:1234 jiong:1234 jiu:1234 ju:1234 juan:1234 jue:1234 jun:1234',
    'ka:1234 kai:1234 kan:1234 kang:1234 kao:1234 ke:1234 kei:1234 ken:1234 keng:1234 kong:1234 kou:1234 ku:1234 kua:1234 kuai:1234 kuan:1234 kuang:1234 kui:1234 kun:1234 kuo:1234',
    'la:1234 lai:1234 lan:1234 lang:1234 lao:1234 le:1234 lei:1234 leng:1234 li:1234 lia:1234 lian:1234 liang:1234 liao:1234 lie:1234 lin:1234 ling:1234 liu:1234 lo:1234 long:1234 lou:1234 lu:1234 luan:1234 lun:1234 luo:1234 lv:1234 lve:1234',
    'ma:1234 mai:1234 man:1234 mang:1234 mao:1234 me:1234 mei:1234 men:1234 meng:1234 mi:1234 mian:1234 miao:1234 mie:1234 min:1234 ming:1234 miu:1234 mo:1234 mou:1234 mu:1234',
    'na:1234 nai:1234 nan:1234 nang:1234 nao:1234 ne:1234 nei:1234 nen:1234 neng:1234 ni:1234 nian:1234 niang:1234 niao:1234 nie:1234 nin:1234 ning:1234 niu:1234 nong:1234 nou:1234 nu:1234 nuan:1234 nun:1234 nuo:1234 nv:1234 nve:1234',
    'o:1234 ou:1234',
    'pa:1234 pai:1234 pan:1234 pang:1234 pao:1234 pei:1234 pen:1234 peng:1234 pi:1234 pian:1234 piao:1234 pie:1234 pin:1234 ping:1234 po:1234 pou:1234 pu:1234',
    'qi:1234 qia:1234 qian:1234 qiang:1234 qiao:1234 qie:1234 qin:1234 qing:1234 qiong:1234 qiu:1234 qu:1234 quan:1234 que:1234 qun:1234',
    'ran:1234 rang:1234 rao:1234 re:1234 ren:1234 reng:1234 ri:1234 rong:1234 rou:1234 ru:1234 rua:1234 ruan:1234 rui:1234 run:1234 ruo:1234',
    'sa:1234 sai:1234 san:1234 sang:1234 sao:1234 se:1234 sen:1234 seng:1234 sha:1234 shai:1234 shan:1234 shang:1234 shao:1234 she:1234 shei:1234 shen:1234 sheng:1234 shi:1234 shou:1234 shu:1234 shua:1234 shuai:1234 shuan:1234 shuang:1234 shui:1234 shun:1234 shuo:1234 si:1234 song:1234 sou:1234 su:1234 suan:1234 sui:1234 sun:1234 suo:1234',
    'ta:1234 tai:1234 tan:1234 tang:1234 tao:1234 te:1234 tei:1234 teng:1234 ti:1234 tian:1234 tiao:1234 tie:1234 ting:1234 tong:1234 tou:1234 tu:1234 tuan:1234 tui:1234 tun:1234 tuo:1234',
    'wa:1234 wai:1234 wan:1234 wang:1234 wei:1234 wen:1234 weng:1234 wo:1234 wu:1234',
    'xi:1234 xia:1234 xian:1234 xiang:1234 xiao:1234 xie:1234 xin:1234 xing:1234 xiong:1234 xiu:1234 xu:1234 xuan:1234 xue:1234 xun:1234',
    'ya:1234 yai:1234 yan:1234 yang:1234 yao:1234 ye:1234 yi:1234 yin:1234 ying:1234 yong:1234 you:1234 yu:1234 yuan:1234 yue:1234 yun:1234',
    'za:1234 zai:1234 zan:1234 zang:1234 zao:1234 ze:1234 zei:1234 zen:1234 zeng:1234 zha:1234 zhai:1234 zhan:1234 zhang:1234 zhao:1234 zhe:1234 zhei:1234 zhen:1234 zheng:1234 zhi:1234 zhong:1234 zhou:1234 zhu:1234 zhua:1234 zhuai:1234 zhuan:1234 zhuang:1234 zhui:1234 zhun:1234 zhuo:1234 zi:1234 zong:1234 zou:1234 zu:1234 zuan:1234 zui:1234 zun:1234 zuo:1234'
  ].join(' ')
};

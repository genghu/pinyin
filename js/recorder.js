/* ============================================================
   recorder.js — 录音服务（MediaRecorder，ES5 全兼容写法）
   录音只保存在本机内存中，不上传任何数据。
   兼容：新版走 mediaDevices.getUserMedia（Promise），
   旧内核回退 webkitGetUserMedia / mozGetUserMedia（回调式）。
   注意：录音功能要求"安全环境"——https 网址或本地打开文件；
   普通 http 网址浏览器会禁用麦克风（页面会给出提示）。
   ============================================================ */
var Recorder = {
  rec: null,
  chunks: [],
  stream: null,
  url: null,       /* 最近一次录音的播放地址 */
  recording: false,

  supported: function () {
    return !!(window.MediaRecorder &&
      (navigator.mediaDevices || navigator.webkitGetUserMedia || navigator.mozGetUserMedia));
  },

  /** 是否因为网页环境（非 https/本地文件）而被浏览器禁用麦克风 */
  blockedByContext: function () {
    return !navigator.mediaDevices &&
      ('isSecureContext' in window ? !window.isSecureContext : location.protocol === 'http:');
  },

  /** 开始录音，返回 Promise */
  start: function () {
    var self = this;
    return new Promise(function (resolve, reject) {
      if (!Recorder.supported()) { reject(new Error('unsupported')); return; }
      if (self.recording) { resolve(); return; }

      var begin = function (stream) {
        self.stream = stream;
        self.chunks = [];
        try {
          self.rec = new MediaRecorder(stream);
        } catch (e) { reject(e); return; }
        self.rec.ondataavailable = function (e) {
          if (e.data && e.data.size) self.chunks.push(e.data);
        };
        self.rec.start();
        self.recording = true;
        resolve();
      };
      var fail = function (e) { reject(e); };

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(begin, fail);
      } else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia.call(navigator, { audio: true }, begin, fail);
      } else if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia.call(navigator, { audio: true }, begin, fail);
      } else {
        reject(new Error('no-media'));
      }
    });
  },

  /** 停止录音，返回可播放 URL 的 Promise */
  stop: function () {
    var self = this;
    return new Promise(function (resolve) {
      if (!self.rec || self.rec.state === 'inactive') { resolve(self.url); return; }
      self.rec.onstop = function () {
        if (self.stream) {
          var tracks = self.stream.getTracks ? self.stream.getTracks() : [];
          for (var i = 0; i < tracks.length; i++) tracks[i].stop();
        }
        self.recording = false;
        if (self.url) { try { URL.revokeObjectURL(self.url); } catch (e) {} }
        var type = self.chunks[0] ? self.chunks[0].type : 'audio/webm';
        var blob;
        try { blob = new Blob(self.chunks, { type: type }); }
        catch (e) {   /* 老浏览器 Blob 构造器需要数组包装 */
          var B = window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
          if (B) { var bb = new B(); for (var i = 0; i < self.chunks.length; i++) bb.append(self.chunks[i]); blob = bb.getBlob(type); }
          else { resolve(null); return; }
        }
        self.url = URL.createObjectURL(blob);
        resolve(self.url);
      };
      self.rec.stop();
    });
  }
};

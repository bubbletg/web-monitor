(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  var xhr = {
    init: function init(cb) {
      // fetch xhr
      var xhr = window.XMLHttpRequest;
      var oldOpen = xhr.prototype.open;

      xhr.prototype.open = function (method, url, async, username, password) {
        this.info = {
          method: method,
          url: url,
          async: async,
          username: username,
          password: password
        };
        return oldOpen.apply(this, arguments);
      };

      var oldSend = xhr.prototype.send;

      xhr.prototype.send = function (value) {
        var _this = this;

        var start = Date.now();

        var fn = function fn(type) {
          return function () {
            _this.info.time = Date.now() - start;
            _this.info.requestSize = value ? value.length : 0;
            _this.info.responseSize = _this.responseText.length;
            _this.info.type = type;
            cb(_this.info);
          };
        };

        this.addEventListener("load", fn("load"), false);
        this.addEventListener("error", fn("error"), false);
        this.addEventListener("abort", fn("abort"), false);
        return oldSend.apply(this, arguments);
      };
    }
  };

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var error = {
    init: function init(cb) {
      // promise 失败了 不能通过 onerror 捕获报错信息
      window.onerror = function (message, source, lineno, colno, error) {
        console.error(message, source, lineno, colno, error);
        var info = {
          message: error.message,
          name: error.name
        };
        var stack = error.stack;
        var matchUrl = stack.match(/http:\/\/[^\n]*/)[0];
        info.filename = matchUrl.match(/http:\/\/(?:\S*)\.js/)[0];

        var _matchUrl$match = matchUrl.match(/:(\d+):(\d+)/),
            _matchUrl$match2 = _slicedToArray(_matchUrl$match, 3),
            row = _matchUrl$match2[1],
            col = _matchUrl$match2[2];

        info.row = row;
        info.col = col; //  还需要拿到 source-map 找到对应真实的报错位置

        cb && cb(info);
      };
    }
  };

  xhr.init(function (data) {
    console.log("🚀 ~ file: index.js ~ line 28 ~ xhr.init ~ data", data);
  }); // 监控页面报错
  error.init(function (err) {
    console.log("🚀 ~ file: index.js ~ line 34 ~ error.init ~ err", err);
  });

}));

export default {
  init(cb) {
    // promise 失败了 不能通过 onerror 捕获报错信息
    window.onerror = function (message, source, lineno, colno, error) {
      console.error(message, source, lineno, colno, error);
      const info = {
        message: error.message,
        name: error.name,
      }
      const stack = error.stack
      const matchUrl = stack.match(/http:\/\/[^\n]*/)[0]
      info.filename = matchUrl.match(/http:\/\/(?:\S*)\.js/)[0]
      const [,row,col] = matchUrl.match(/:(\d+):(\d+)/)
      info.row = row
      info.col = col
      //  还需要拿到 source-map 找到对应真实的报错位置
      cb && cb(info)
    }
  },
} 
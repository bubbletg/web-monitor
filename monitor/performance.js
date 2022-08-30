const processDate = (obj) => {
  const data = {
    prevPage: obj.fetchStart - obj.navigationStart, // 上一个页面的卸载时间,即上一个页面到这一个页面的时长
    redirect: obj.redirectEnd - obj.redirectStart, // 重定向时长
    dns: obj.domainLookupEnd - obj.domainLookupStart, // DNS 解析时长
    connect: obj.connectEnd - obj.connectStart, // connect 连接时长
    // 从请求到相应的时长
    send: obj.responseEnd - obj.requestStart, // 响应结束到请求结束时长
    ttfb: obj.responseEnd - obj.navigationStart, // 首字节接收到的时长
    domready: obj.domInteractive - obj.domLoading, // DOM 准备时长

    // 白屏
    whiteScreen: obj.domLoading - obj.navigationStart, // 白屏时间
    // dom 解析时间
    dom: obj.domComplete - obj.domLoading, //  DOM 解析时间
    // onload 的执行时间
    load: obj.loadEventEnd - obj.loadEventStart,
    total: obj.loadEventEnd - obj.navigationStart, // 总时长
  }
  return data
}

/**
 * 解决 无法拿到 load 的时间,让 监听的 load 事件回调方法 延迟执行
 * @param {*} cb
 */
const load = (cb) => {
  let timer = null
  const check = () => {
    if (performance.timing.loadEventEnd) {
      clearTimeout(timer)
      cb && cb()
    } else {
      timer = setTimeout(check, 100)
    }
  }
  window.addEventListener("load", check, false)
}

/**
 *  有可能没有触发onload ,dom 解析完成后统计一下,可能用户没有加载完成就关闭了
 * @param {*} cb
 */
const domread = (cb) => {
  let timer = null
  const check = () => {
    if (performance.timing.domInteractive) {
      clearTimeout(timer)
      cb && cb()
    } else {
      timer = setTimeout(check, 100)
    }
  }
  window.addEventListener("DOMContentLoaded", check, false)
}

export default {
  init(cb) {
    domread(() => {
      // 有可能没有触发onload ,dom 解析完成后统计一下,可能用户没有加载完成就关闭了
      let perfData = performance.timing
      const data = processDate(perfData)
      data.type = "domread"
      cb && cb(data)
    })
    load(() => {
      let perfData = performance.timing
      const data = processDate(perfData)
      data.type = "loaded"
      cb && cb(data)
    })
  },
}

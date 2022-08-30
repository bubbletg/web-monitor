const formatObj = (data) => {
  const arr = []
  for (let key in data) {
    arr.push(`${key}=${data[key]}`)
  }
  return arr.join("&")
}

// 监控页面性能
// import perf from "./performance"

// perf.init((data) => {
//   new Image().src = "/perf.gif?" + formatObj(data)
//   console.log(data)
// })

// 监控页面静态资源加载情况
// import resource from "./resource"
// resource.init((data) => {
//   // new Image().src = "/resource.gif?" + formatObj(data)
//   console.log(data)
// })

// ajax 监控

import xhr from "./xhr"
xhr.init((data) => {
  console.log("🚀 ~ file: index.js ~ line 28 ~ xhr.init ~ data", data)
})

// 监控页面报错
import error from "./errCath"
error.init((err) => {
  console.log("🚀 ~ file: index.js ~ line 34 ~ error.init ~ err", err)
})

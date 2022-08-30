const processData = (_) => {
  return {
    name: _.name,
    initiatorType: _.initiatorType,
    duration: _.duration,
  }
}

export default {
  init(cb) {
    if (window.PerformanceObserver) {
      const observer = new PerformanceObserver((list,obj) => {
        const data = list.getEntries();
        cb(processData(data[0]))
      })
      observer.observe({entryTypes: ["resource"]});
    } else {
      window.addEventListener("load", () => {
        const resourceData = performance.getEntriesByType("resource")
        const data = resourceData.map((_) => processData(_))
        cb && cb(data)
      })
    }
  },
}

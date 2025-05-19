let detector: string | number | NodeJS.Timeout | undefined
let experiencingTimer: string | number | NodeJS.Timeout | undefined

interface e {
  type: string
  data: any
}

self.onmessage = (e) => {
  const { type } = e.data
  switch (type) {
    case "INIT_DETECT":
      clearTimeout(detector)
      detector = setInterval(() => {
        postMessage("DETECT")
      }, 100)
      break
    case "INIT_EXPERIENCING":
      clearTimeout(experiencingTimer)
      experiencingTimer = setInterval(() => {
        postMessage("TIK")
      }, 1000)
      break
    case "TERMINATE_DETECT":
      clearTimeout(detector)
      break
    case "TERMINATE_EXPERIENCING":
      clearTimeout(experiencingTimer)
      break
  }
}

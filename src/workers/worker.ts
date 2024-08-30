let timer: string | number | NodeJS.Timeout | undefined

interface e {
  type: string
  data: any
}

self.onmessage = (e) => {
  const { type } = e.data
  switch (type) {
    case "init":
      timer = setInterval(() => {
        postMessage("do it")
      }, 100)
      break
    case "terminate":
      clearTimeout(timer)
      break
  }
}

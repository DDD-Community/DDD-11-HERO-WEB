interface e {
  type: string
  data: any
}

self.onmessage = (e) => {
  const { type, data } = e.data
  switch (type) {
    case "init":
      setInterval(() => {
        postMessage("do it")
      }, 100)
  }
}

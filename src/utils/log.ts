import * as amplitude from "@amplitude/analytics-browser"

export function logAnalytics(eventName: string, eventProperties = {}) {
  amplitude.track(eventName, {
    ...eventProperties,
  })
}

export function setUserProperties(properties: Record<string, any>) {
  const identifyObj = new amplitude.Identify()

  Object.entries(properties).forEach(([key, value]) => {
    identifyObj.set(key, value)
  })

  amplitude.identify(identifyObj)
}

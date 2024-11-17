export {}

declare global {
  interface Window {
    backend: typeof import("./preload").backend
    versions: typeof import("./preload").versions
  }
}

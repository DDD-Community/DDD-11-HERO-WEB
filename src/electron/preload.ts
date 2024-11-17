import { contextBridge, ipcRenderer } from "electron"

export const backend = {
  nodeVersion: async (msg: string): Promise<string> => await ipcRenderer.invoke("node-version", msg),
}

export const versions = {
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
}

contextBridge.exposeInMainWorld("backend", backend)
contextBridge.exposeInMainWorld("versions", versions)

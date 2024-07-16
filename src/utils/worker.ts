export const worker = new Worker(new URL("../workers/worker.ts?worker", import.meta.url))


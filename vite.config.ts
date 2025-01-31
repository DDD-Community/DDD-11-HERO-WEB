import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgrPlugin from "vite-plugin-svgr"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgrPlugin()],
  build: {
    outDir: "dist/web",
  },
  server: {
    port: 3000,
  },
  base: "/",
})

import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import solidSvg from 'vite-plugin-solid-svg'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [solidPlugin(), solidSvg(), tsconfigPaths()],
    server: {
        port: 3001,
    },
    build: {
        target: 'esnext',
    },
})

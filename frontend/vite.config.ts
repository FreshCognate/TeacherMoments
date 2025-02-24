import { getAppDirectory } from "@react-router/dev/routes";
import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
    hmr: { port: 3001 }
  },
  build: {
    target: "esnext",
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [reactRouter(), tsconfigPaths()],
  ssr: {
    noExternal: [
      'react-dropzone'
    ],
  },
});
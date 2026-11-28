import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"

export default defineConfig({
  define: {
    "process.env": {},
  },
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "motion-vendor": ["framer-motion", "motion"],
          "gsap-vendor": ["gsap", "lenis"],
          "globe-vendor": ["d3", "topojson-client"],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: false
  }
})

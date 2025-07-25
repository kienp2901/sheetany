// vite.config.js
import { defineConfig } from "file:///C:/xampp/htdocs/laravel-vue-app/node_modules/vite/dist/node/index.js";
import laravel from "file:///C:/xampp/htdocs/laravel-vue-app/node_modules/laravel-vite-plugin/dist/index.js";
import tailwindcss from "file:///C:/xampp/htdocs/laravel-vue-app/node_modules/@tailwindcss/vite/dist/index.mjs";
import vue from "file:///C:/xampp/htdocs/laravel-vue-app/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\xampp\\htdocs\\laravel-vue-app";
var vite_config_default = defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.js"],
      refresh: true
    }),
    tailwindcss(),
    vue()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "resources/js"),
      "vue": "vue/dist/vue.esm-bundler.js"
      // để dùng template compiler
    }
  },
  build: {
    outDir: "public/build",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: "resources/js/app.js"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxcbGFyYXZlbC12dWUtYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxcbGFyYXZlbC12dWUtYXBwXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi94YW1wcC9odGRvY3MvbGFyYXZlbC12dWUtYXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgbGFyYXZlbCBmcm9tICdsYXJhdmVsLXZpdGUtcGx1Z2luJztcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIGxhcmF2ZWwoe1xuICAgICAgICAgICAgaW5wdXQ6IFsncmVzb3VyY2VzL2Nzcy9hcHAuY3NzJywgJ3Jlc291cmNlcy9qcy9hcHAuanMnXSxcbiAgICAgICAgICAgIHJlZnJlc2g6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgICB0YWlsd2luZGNzcygpLFxuICAgICAgICB2dWUoKSxcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdyZXNvdXJjZXMvanMnKSxcbiAgICAgICAgICAndnVlJzogJ3Z1ZS9kaXN0L3Z1ZS5lc20tYnVuZGxlci5qcycsIC8vIFx1MDExMVx1MUVDMyBkXHUwMEY5bmcgdGVtcGxhdGUgY29tcGlsZXJcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICAgIG91dERpcjogJ3B1YmxpYy9idWlsZCcsXG4gICAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgICBtYW5pZmVzdDogdHJ1ZSxcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgaW5wdXQ6ICdyZXNvdXJjZXMvanMvYXBwLmpzJyxcbiAgICAgICAgfSxcbiAgICB9LFxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF1UixTQUFTLG9CQUFvQjtBQUNwVCxPQUFPLGFBQWE7QUFDcEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUpqQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxRQUFRO0FBQUEsTUFDSixPQUFPLENBQUMseUJBQXlCLHFCQUFxQjtBQUFBLE1BQ3RELFNBQVM7QUFBQSxJQUNiLENBQUM7QUFBQSxJQUNELFlBQVk7QUFBQSxJQUNaLElBQUk7QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsTUFDM0MsT0FBTztBQUFBO0FBQUEsSUFDVDtBQUFBLEVBQ0o7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNILFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLFVBQVU7QUFBQSxJQUNWLGVBQWU7QUFBQSxNQUNYLE9BQU87QUFBQSxJQUNYO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

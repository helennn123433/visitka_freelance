const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        logLevel: 'debug' // для отладки
      }
    }
  },

  pages: {
    index: {
      entry: 'src/main.ts',
      title: '№ 31'
    }
  }
});

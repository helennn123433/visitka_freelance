const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:3004',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
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

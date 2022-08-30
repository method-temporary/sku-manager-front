module.exports = {
  '/local/**': {
    target: 'http://localhost:8555',
    pathRewrite: { '/local': '/' },
    secure: false,
    changeOrigin: true,
  },
  '/api/**': {
    target: 'https://stg.mysuni.sk.com/',
    secure: false,
    changeOrigin: true,
  },
  '/extra-editor/**': {
    target: 'https://stg.mysuni.sk.com',
    // target: 'http://localhost:8080/',
    secure: false,
    changeOrigin: true,
  },
};

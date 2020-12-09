module.exports = {
  dev: {
    server: {
      port: 3030,
      host: '0.0.0.0',
    },
    api: {
      port: '', // default 3000
      host: 'http://10.30.204.149:8001/',
    },
  },
  test: {
    server: {
      port: 8080,
      host: '0.0.0.0',
    },
    api: {
      port: '', // default 3000
      host: 'http://10.30.204.149:8001/',
    },
  },
  prod: {
    server: {
      port: 8082,
      host: '0.0.0.0',
    },
    api: {
      port: '', // default 3000
      host: 'http://218.205.135.175:8081/',
    },
  },
}

/*
 * @Author: kongtb
 * @Date: 2019-09-07 10:07:19
 * @Last Modified by: kongtb
 * @Last Modified time: 2019-09-07 10:10:00
 */
module.exports = {
  options: {
    env: process.env.NODE_ENV
  },
  plugins: [
    'vux-ui',
    'progress-bar',
    {
      name: 'less-theme',
      path: 'src/styles/variable.less'
    },
    {
      name: 'duplicate-style',
      envs: ['production'],
      options: {
        cssProcessorOptions: {
          safe: true,
          zindex: false,
          autoprefixer: {
            add: true,
            browsers: ['iOS >= 7', 'Android >= 4.1']
          }
        }
      }
    }
  ]
};

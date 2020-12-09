(function (win,doc) {
  // 设计稿以750px为宽度，把页面宽度设计为1rem=100px
  function setRem() {
    var html = doc.querySelector('html');
    let htmlWidth = doc.documentElement.clientWidth || doc.body.clientWidth;
    html.style.fontSize = (htmlWidth / 750) * 100 + 'px'; //假定设计稿宽750,使得设备宽度为750情况下font-size=100px,即1rem=100px;
  }
  setRem();
  win.addEventListener('resize', setRem, false);
  if ('onorientationchange' in win) {
    win.addEventListener('onorientationchange', setRem, false);
  }
})(window,document);
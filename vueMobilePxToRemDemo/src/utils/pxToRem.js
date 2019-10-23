function changeFont() {
    var evt = "onorientationchange" in window ? "orientationchange" : "resize";

    function setRem() {
        var html = document.querySelector('html');
        var width = html.getBoundingClientRect().width;
        html.style.fontSize = (width / 750) * 100 + "px"; //假定设计稿宽750,使得设备宽度为750情况下font-size=100px,即1rem=100px;
    }
    setRem();
    window.addEventListener(evt, setRem, false)
}

export default changeFont();
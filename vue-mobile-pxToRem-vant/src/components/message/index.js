import Message from './Message.vue';

const MESSAGE = {
  duration: 3000, // 显示的时间
  animateTime: 300, // 动画过渡时间
  install(Vue) { // //使用install方法，Vue 作为参数传入，使vue.use能注册该方法
    if (typeof window !== 'undefined' && window.Vue) {
      Vue = window.Vue;
    }
    Vue.component('Message', Message);
    
    function msg (type, text, callBack) {
      let msg;
      let duration = MESSAGE.duration;
      if (typeof text === 'string') {
        msg = text;
      } else if (text instanceof Object) {
        msg = text.text || '';
        if (text.duration) {
          duration = text.duration;
        }
      }

      let VueMessage = Vue.extend({
        //这里用到render函数，没有用template选项，个人选择，都可以用
        render(h) {
          let props = {
            type,
            text: msg,
            show: this.show
          };
          return h('message', {props});
        },
        data() {
          return {
            show: false
          };
        }
      });

      let newMessage = new VueMessage();
      let vm = newMessage.$mount(); //生成$el实例 可以任意插入到dom中
      let el = vm.$el;
      document.body.appendChild(el); // 把生成的提示的dom插入body中

      vm.show = true;

      let t1 = setTimeout(() => {
        clearTimeout(t1);
        vm.show = false;  //隐藏提示组件，此时会有300ms的动画效果，等动画效果过了再从body中移除dom
        let t2 = setTimeout(() => {
          clearTimeout(t2);
          document.body.removeChild(el); //从body中移除dom
          newMessage.$destroy();
          vm = null; // 设置为null，好让js垃圾回收算法回收，释放内存
          // 如果有回调函数就执行，没有就不执行，用&&操作符，
          if (callBack && (typeof callBack === 'function')) {
            callBack();
          }
        }, MESSAGE.animateTime);
      }, duration);
    }
    // 挂载到vue原型上，暴露四个方法
    Vue.prototype.$message = {
      info(text, callBack) {
        if (!text) return;
        msg('info', text, callBack);
      },
      success(text, callBack) {
        if (!text) return;
        msg('success', text, callBack);
      },
      error(text, callBack) {
        if (!text) return;
        msg('error', text, callBack);
      },
      warning(text, callBack) {
        if (!text) return;
        msg('warning', text, callBack);
      }
    };
  }
};
export default MESSAGE;
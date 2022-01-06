// eslint-disable-next-line no-restricted-globals
const { h, ref } = window.Vue
export const MyButton = {
  name: 'MyButton',
  setup() {
    const num = ref(0);
    function add () {
      num.value += 1;
    }
    return () => h(
      'button',
      {
        onClick: add
      },
      `click:${num.value}次`
    )
  }
}
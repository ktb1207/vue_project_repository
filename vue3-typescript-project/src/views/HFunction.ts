import { h, VNode } from 'vue';

const HFunction = {
  render(): VNode {
    console.log((this as any).$slots.default);
    const testClick = (e: MouseEvent) => {
      console.log('click');
      console.log(e);
    };
    return h(
      'div',
      {
        id: 'hfunction',
        onClick: testClick
      },
      '测试render函数使用'
    );
  },
  mounted() {}
};

export default HFunction;

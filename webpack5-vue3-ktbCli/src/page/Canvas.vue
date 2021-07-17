<template>
  <div class="wrp">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
export default {
  setup() {
    const canvas = ref(null);
    // 绘制矩形
    const drawReact = (ctx, x, y, width, height, fillColor) => {
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.fillStyle = fillColor;
      ctx.fill();
    };
    // 切点绘制弧形
    const drawArcTo = (ctx, x0, y0, x1, y1, x2, y2, r) => {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.arcTo(x1, y1, x2, y2, r);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    };
    const drawLeftInnerArc = (ctx, x0, y0, x1, y1, x2, y2, r, type = 'add') => {
      while (r > 0) {
        const startX = type === 'add' ? x0 + 1 : x0 - 1;
        drawArcTo(ctx, startX, y0, x1, y1, x2, y2 + 1, r);
        r = r - 1;
      }
    };
    // 中间形状
    const dragCenterReact = (ctx, startX, startY, width, height, circleR, fillColor) => {
      ctx.beginPath();
      ctx.moveTo(startX + circleR, startY);
      // 顶部水平
      ctx.lineTo(startX + width - circleR, startY);
      // 右侧上角
      ctx.arc(startX + width - circleR, startY + circleR, circleR, 1.5 * Math.PI, 2 * Math.PI);
      // 右侧
      ctx.lineTo(startX + width, startY + height);
      // 底部
      ctx.lineTo(startX, startY + height);
      // 左侧
      ctx.lineTo(startX, startY + circleR);
      // 左上角
      ctx.arc(startX + circleR, startY + circleR, circleR, 1 * Math.PI, 1.5 * Math.PI);
      //
      ctx.closePath(); //使用closePath()闭合图形
      // 填充颜色
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      ctx.fillStyle = 'yellow';
      ctx.fill();
    };
    // 开始绘制
    const drawShap = () => {
      const canvasDom = canvas.value;
      canvasDom.width = 1200;
      canvasDom.height = 100;
      const context = canvasDom.getContext('2d');
      // 左
      drawReact(context, 0, 60, 80, 40, '#fff');
      // 中
      // drawReact(context, 80, 0, 1040, 100, '#fff');
      dragCenterReact(context, 80, 0, 1040, 100, 15, '#fff');
      // right
      drawReact(context, 1120, 60, 80, 40, '#fff');
      // left arc
      drawLeftInnerArc(context, 65, 60, 80, 60, 80, 45, 15, 'add');
      // right arc
      drawLeftInnerArc(context, 1135, 60, 1120, 60, 1120, 45, 15, 'reduce');
    };
    onMounted(() => {
      drawShap();
    });
    return {
      canvas
    };
  }
};
</script>

<style lang="scss">
.wrp {
  width: 100%;
  height: 460px;
  background-color: aqua;
  padding: 14px 14px;
  canvas {
    display: block;
    margin: 0 auto;
  }
}
</style>

<template>
  <div class="about">
    <div class="a-left">
      <div class="html-editor" ref="htmlRef"></div>
      <div class="css-editor" ref="cssRef"></div>
    </div>
    <div class="a-right" ref="jsRef"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import * as monaco from 'monaco-editor';
export default defineComponent({
  components: {},
  setup() {
    const jsRef = ref<null | HTMLElement>(null);
    const htmlRef = ref<null | HTMLElement>(null);
    const cssRef = ref<null | HTMLElement>(null);
    const jsEditor = ref<null | monaco.editor.IStandaloneCodeEditor>(null);
    // HTML
    function initHtmlMonaco(container: HTMLElement) {
      jsEditor.value = monaco.editor.create(container, {
        language: 'html',
        theme: 'vs-dark',
        value: ['<template>', '\t<div>', '\t</div>', '</template>'].join('\n')
      });
    }
    // css
    function initCssMonaco(container: HTMLElement) {
      jsEditor.value = monaco.editor.create(container, {
        language: 'scss',
        theme: 'vs-dark',
        value: ['#app{}'].join('\n')
      });
    }
    // js
    function initJsMonaco(container: HTMLElement) {
      jsEditor.value = monaco.editor.create(container, {
        language: 'javascript',
        theme: 'vs-dark',
        value: ['function add (a, b) {', '\treturn a + b', '}'].join('\n')
      });
    }
    const getLan = () => {
      console.log(monaco.languages.css);
    };
    onMounted(() => {
      initHtmlMonaco(htmlRef.value as HTMLElement);
      initCssMonaco(cssRef.value as HTMLElement);
      initJsMonaco(jsRef.value as HTMLElement);
    });

    return {
      jsRef,
      htmlRef,
      cssRef,
      getLan
    };
  }
});
</script>

<style lang="scss">
.about {
  height: 100%;
  .a-left {
    float: left;
    width: 50%;
    height: 100%;
    .html-editor,
    .css-editor {
      height: 50%;
    }
  }
  .a-right {
    float: right;
    width: 50%;
    height: 100%;
  }
}
</style>

<template>
  <div>
    <Codemirror :options="cmOptions" :height="800"></Codemirror>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Codemirror from 'codemirror-editor-vue3';
// base style
import 'codemirror/lib/codemirror.css';
// language
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/vue/vue.js';

// active-line.js
import 'codemirror/addon/selection/active-line.js';
// theme
import 'codemirror/theme/material-ocean.css';

// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js';
import 'codemirror/addon/search/searchcursor.js';

// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/match-highlighter.js';

// keyMap
import 'codemirror/mode/clike/clike.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/comment/comment.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/keymap/sublime.js';

// foldGutter
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/xml-fold.js';
export default defineComponent({
  components: {
    Codemirror
  },
  setup() {
    console.log('setup');

    return {
      cmOptions: {
        mode: 'text/html', // Language mode
        theme: 'material-ocean', // Theme
        lineNumbers: true, // Show line number
        smartIndent: true, // Smart indent
        indentUnit: 2, // The smart indent unit is 2 spaces in length
        foldGutter: true, // Code folding
        styleActiveLine: true // Display the style of the selected row
      }
    };
  }
});
</script>

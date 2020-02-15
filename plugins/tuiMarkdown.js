import Vue from 'vue'

import 'tui-editor/dist/tui-editor.css'
import 'tui-editor/dist/tui-editor-contents.css'
import 'codemirror/lib/codemirror.css'
import 'tui-editor/dist/tui-editor-extChart'
import { Editor } from '@toast-ui/vue-editor'

const TuiMarkdownEditor = {
  install(Vue, options) {
    Vue.component('tui-markdown-editor', Editor)
  }
}

Vue.use(TuiMarkdownEditor)
export default TuiMarkdownEditor

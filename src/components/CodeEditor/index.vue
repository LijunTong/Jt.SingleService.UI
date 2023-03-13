<template>
  <div>
    <codemirror
      class="code-mirror"
      v-model="code"
      :options="option"
    ></codemirror>
    <!-- <el-select
      class="code-mode-select"
      v-model="option.mode"
      @change="changeMode"
    >
      <el-option
        v-for="mode in modes"
        :key="mode.value"
        :label="mode.label"
        :value="mode.value"
      >
      </el-option>
    </el-select> -->
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/theme/ambiance.css'
require('codemirror/mode/javascript/javascript')
// 核心样式
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/selection/active-line'
// 引入主题后还需要在 options 中指定主题才会生效
import 'codemirror/theme/cobalt.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/base16-light.css'
//modes
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/r/r.js'
import 'codemirror/mode/shell/shell.js'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/mode/swift/swift.js'
import 'codemirror/mode/vue/vue.js'
export default {
  name: 'CodeEditor',
  props: {
    value: {
      type: String
    }
  },
  components: {
    codemirror
  },
  computed: {
    code: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  data() {
    return {
      // 默认配置
      option: {
        tabSize: 2, // 缩进格式
        mode: 'text/x-csharp',
        theme: 'base16-light',
        lineNumbers: true, // 显示行号
        line: true,
        styleActiveLine: true, // 高亮选中行
        matchBrackets: true, // 括号匹配
        hintOptions: {
          completeSingle: true // 当匹配只有一项的时候是否自动补全
        }
      },
      modes: [{
        value: 'css',
        label: 'CSS'
      }, {
        value: 'javascript',
        label: 'Javascript'
      }, {
        value: 'html',
        label: 'XML/HTML'
      }, {
        value: 'text/x-csharp',
        label: 'C#'
      },
      , {
        value: 'application/x-aspx',
        label: 'asp.net'
      },
       {
        value: 'text/x-java',
        label: 'Java'
      }, {
        value: 'text/x-objectivec',
        label: 'Objective-C'
      }, {
        value: 'python',
        label: 'Python'
      }, {
        value: 'rsrc',
        label: 'R'
      }, {
        value: 'sh',
        label: 'Shell'
      }, {
        value: 'sql',
        label: 'SQL'
      }, {
        value: 'swift',
        label: 'Swift'
      }, {
        value: 'vue',
        label: 'Vue'
      }, {
        value: 'markdown',
        label: 'Markdown'
      }]

    }
  },
  methods: {
    changeMode(val) {
      // 修改编辑器的语法配置
      this.option.mode = val
    }
  }
}
</script>

<style scoped>
.code-mirror {
  font-size: 14px;
  line-height: 150%;
  text-align: left;
}
.code-mode-select {
  position: absolute;
  z-index: 2;
  right: 10px;
  top: 10px;
  max-width: 130px;
}
</style>
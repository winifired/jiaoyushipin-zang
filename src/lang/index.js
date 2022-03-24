import { createI18n } from 'vue-i18n'

import zh from './zh'
import zangwen from './zangwen'

// 语言库
const messages = {
  'zh': zh,
  'zangwen': zangwen
}

// 默认语言
const langDefault = 'zh'

const i18n = createI18n({
  locale: langDefault,
  messages
})

export default i18n;
import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import pluginCypress from 'eslint-plugin-cypress/flat'

export default [
  { name: 'app/files', files: ['**/*.{ts,mts,tsx,vue}'] },
  { name: 'app/ignores', ignores: ['dist/**', 'coverage/**', 'node_modules/**', '**/*.config.js', '**/*.config.d.ts', '**/*.tsbuildinfo'] },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  { ...pluginCypress.configs.recommended, files: ['cypress/**/*.{cy,spec}.{ts,js}'] },
  { rules: { 'vue/multi-word-component-names': 'off' } },
]

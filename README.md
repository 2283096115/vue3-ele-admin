<h1>使用介绍</h1>

## 配套文档

- [点我查看国内文档站](https://yiming_chang.gitee.io/pure-admin-doc)
- [点我查看国外文档站](https://pure-admin.github.io/pure-admin-doc)

## 用法

### 安装依赖

pnpm install

### 安装一个包

pnpm add 包名

### 卸载一个包

pnpm remove 包名

### package.json 中命令的含义

```javascript
{
  "scripts": {
    "dev": "NODE_OPTIONS=--max-old-space-size=4096 vite", // 启动平台
    "serve": "pnpm dev", // 启动平台（有人喜欢dev、有人喜欢serve）
    "build": "rimraf dist && NODE_OPTIONS=--max-old-space-size=8192 vite build", // 打包平台（rimraf 包的作用：以包的形式包装rm -rf命令，用来删除文件和文件夹的，不管文件夹是否为空，都可删除）
    "build:staging": "rimraf dist && vite build --mode staging", // 打包平台（预发布环境）
    "report": "rimraf dist && vite build", // 打包平台并生产平台包文件大小图形化分析
    "preview": "vite preview", // 预览平台，需先打包（无需安装live-server等工具，vite自带预览功能）
    "preview:build": "pnpm build && vite preview", // 打包并预览平台（无需安装live-server等工具，vite自带预览功能）
    "typecheck": "tsc --noEmit && vue-tsc --noEmit --skipLibCheck", // 使用vue-tsc工具对指定的.ts、.tsx、.vue文件进行类型校验
    "svgo": "svgo -f src/assets/svg -o src/assets/svg", // 使用svgo工具对指定目录里的所有svg文件进行压缩
    "cloc": "NODE_OPTIONS=--max-old-space-size=4096 cloc . --exclude-dir=node_modules --exclude-lang=YAML", // 平台文件、语言分析
    "clean:cache": "rm -rf node_modules && rm -rf .eslintcache && pnpm install", // 删除node_modules、清空eslint缓存并重新安装平台依赖
    "lint:eslint": "eslint --cache --max-warnings 0  \"{src,mock,build}/**/*.{vue,js,ts,tsx}\" --fix", // eslint修复
    "lint:prettier": "prettier --write  \"src/**/*.{js,ts,json,tsx,css,less,scss,vue,html,md}\"", // prettier格式化
    "lint:stylelint": "stylelint --cache --fix \"**/*.{vue,css,scss,postcss,less}\" --cache --cache-location node_modules/.cache/stylelint/", // stylelint格式化修复
    "lint:lint-staged": "lint-staged -c ./.husky/lintstagedrc.js", // lint-staged能够让lint只检测暂存区的文件（这里用于husky，提交前校验）
    "lint:pretty": "pretty-quick --staged", // 自动运行prettier（这里用于husky，提交前校验）
    "lint": "pnpm lint:eslint && pnpm lint:prettier && pnpm lint:stylelint", // 平台整体lint格式化并修复
    "prepare": "husky install", // 自动生成husky（https://typicode.github.io/husky/#/）
    "preinstall": "npx only-allow pnpm", // 只允许运行pnpm命令，如果您换成yarn、npm需要把这行删除（https://pnpm.io/zh/only-allow-pnpm）
    "commit": "cz" // 代码提交 只能用这个区提交代码 需要先初始化npx commitizen init cz-conventional-changelog --pnpm -D --exact
  }
}
```

pnpm remove 包名

### 提交代码

pnpm commit
参考[vite+vue3 项目从 0 到 1 搭建(1)---开发约束和提交规范](https://juejin.cn/post/7264111170411053114)
这里的校验只会校验 git 暂存区(add 后)的文件，可能出现校验失败的情况，这时需要检查文件是否有不合规的代码，
用 pnpm lint 可以修复所有文件的不规范代码，同时指出无法自动修改的地方，从这些中找到自己要提交的文件中的不规范代码，然后自己修改

有时 stylelint 会报错 Command failed with exit code 3221225477
可以运行以下命令尝试解决，目前不知道为啥

```shell
npx stylelint --help
npx stylelint --fix ./src/app.vue
```

### icon 处理方案

目前 icon 主要使用 svg 处理，为了方便全局使用，会自动加载(并不是全局导入，会自动局部导入) plan\src\assets\svg 下的 svg
使用说明 svg 文件夹下有 download.svg，无需导入，在其他组件直接使用即可，需要添加前缀 IconSvg
`<el-icon class="global-icon"><icon-svg-download /></el-icon>`

具体说明如下
[优雅的使用 icon](https://juejin.cn/post/7070293505528037389)

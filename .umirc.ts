import { defineConfig } from "umi";
import { theme } from "antd"


export default defineConfig({
  routes: [
    { path: "/", name: "home", component: "index" },
    {
      path: "/url",
      name: "URL",
      routes: [
        { path: "UrlParameterFormat", component: "url/UrlParameterFormat/index", name: "URL参数格式化" },
        { path: "url2", component: "url/url2/index", name: "url2" },
      ],
    },
    {
      path: "/docs",
      name: "docs",
      routes: [
        { path: "foo", component: "docs/foo/index", name: "foo" },
        { path: "foo2", component: "docs/foo2/index", name: "foo2" },
      ],
    },
  ],
  npmClient: "npm",
  tailwindcss: {},
  plugins: ["@umijs/plugins/dist/tailwindcss", "@umijs/plugins/dist/locale", "@umijs/plugins/dist/antd"],
  locale: {
    // 默认使用 src/locales/zh-CN.ts 作为多语言文件
    default: 'zh-CN',
    baseSeparator: '-',
    antd: true
  },
  antd: {
    dark: false,
    momentPicker: false,
    configProvider: {
      theme: {
        algorithm: theme.defaultAlgorithm,
      }
    }
  }
});

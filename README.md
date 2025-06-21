# pinia-plugin-state

> 🌟 一个简单易用的 [Pinia](https://pinia.vuejs.org/) 状态持久化插件，支持多种存储方式与灵活配置。

## 特性

-   支持 `localStorage`、`sessionStorage`、自定义存储
-   支持按字段持久化
-   开箱即用

## 安装

```bash
npm install pinia-plugin-state
# 或
yarn add pinia-plugin-state
```

## 快速开始

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import saveState from 'pinia-plugin-state'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

// 将持久化插件添加到 Pinia 实例
pinia.use(saveState)

app.use(pinia)
app.mount('#app')
```

## 基本用法

在你的 store 中开启持久化：

```js
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useUserStore = defineStore(
    'user',
    () => {
        const id = ref('')
        const nickName = ref('')
        const token = ref('')
        const user = reactive({
            name: '',
            ip: {
                v4: '',
                v6: ''
            }
        })
        return { id, nickName, token, user }
    },
    {
        // 启用并配置持久化选项
        enable: true,
        // 可选：指定需要持久化的属性，点分割的路径写法
        include: ['id', 'nickName', 'user.ip'],
        // 可选：指定需要忽略的属性，点分割的路径写法
        exclude: ['user.ip.v4']
        // 可选：指定存储方式，例如 localStorage, sessionStorage 等，默认为 localStorage
        // storage: localStorage,
        // 可选：自定义存储键名称，默认：storeId
        // id: 'user',
        // 可选：自定义存储有效期，单位：毫秒
        // ttl: '1000'
    }
)
```

## 配置项说明

| 选项      | 类型     | 说明                         | 是否必须 |
| --------- | -------- | ---------------------------- | -------- |
| `enable`  | Boolean  | 是否启用持久化（默认 false） | 是       |
| `id`      | String   | 存储的键名（默认 store id）  | 否       |
| `storage` | Storage  | 存储方式（local/session 等） | 否       |
| `include` | String[] | 需要持久化的字段             | 否       |
| `exclude` | String[] | 需要忽略的字段               | 否       |
| `ttl`     | Number   | 存储有效期                   | 否       |

## 自定义存储

你可以实现自定义的 `storage`，只需实现 `getItem`、`setItem`、`removeItem` 方法。

```js
const storage = {
    getItem: key => {
        /* ... */
    },
    setItem: (key, value) => {
        /* ... */
    },
    removeItem: key => {
        /* ... */
    }
}
```

## 兼容性

-   兼容 Vue 3.x
-   依赖 Pinia 2.x

## License

MIT

---

> 感谢使用！如有问题欢迎提 [Issue](https://github.com/fubowen/pinia-plugin-persist/issues) 反馈。

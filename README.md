# pinia-plugin-state

> 🌟 A simple and easy-to-use Pinia state persistence plugin, supporting multiple storage methods and flexible configuration.

## Features

-   Supports `localStorage`, `sessionStorage`, and custom storage.
-   Supports persistence by field.
-   Zero-config, ready to use out-of-the-box.

## Installation

```bash
npm install pinia-plugin-state
# or
yarn add pinia-plugin-state
```

## Quick Start

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import saveState from 'pinia-plugin-state'
import App from './App.vue'
const app = createApp(App)
const pinia = createPinia()
// Add the persistence plugin to the Pinia instance
pinia.use(saveState)
app.use(pinia)
app.mount('#app')
```

## Basic Usage

Enable persistence in your store:

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
        // Enable and configure persistence options
        enable: true,
        // Optional: Specify properties to persist, using dot notation for paths
        include: ['id', 'nickName', 'user.ip'],
        // Optional: Specify properties to ignore, using dot notation for paths
        exclude: ['user.ip.v4']
        // Optional: Specify storage method, e.g., localStorage, sessionStorage, etc. Defaults to localStorage.
        // storage: localStorage,
        // Optional: Customize the storage key name. Defaults to storeId.
        // id: 'user',
        // Optional: Customize the storage expiration time, in milliseconds.
        // ttl: 1000
    }
)
```

## Configuration Options

| Option    | Type     | Description                                      | Required |
| --------- | -------- | ------------------------------------------------ | -------- |
| `enable`  | Boolean  | Whether to enable persistence (default: `false`) | Yes      |
| `id`      | String   | Storage key name (default: store id)             | No       |
| `storage` | Storage  | Storage method (local/session, etc.)             | No       |
| `include` | String[] | Fields to persist                                | No       |
| `exclude` | String[] | Fields to ignore                                 | No       |
| `ttl`     | Number   | Storage expiration time (in milliseconds)        | No       |

## Custom Storage

You can implement custom `storage` by providing `getItem`, `setItem`, and `removeItem` methods.

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

## Compatibility

-   Compatible with Vue 3.x
-   Depends on Pinia 2.x

## License

## MIT

> Thank you for using! If you encounter any issues, please feel free to open an [Issue](https://github.com/fubowen/pinia-plugin-persist/issues).

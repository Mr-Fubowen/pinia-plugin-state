import type { PiniaPluginContext, StateTree, Store, _DeepPartial } from 'pinia'

export type Path = string

export type DeepPartial<T> = {
    [k in keyof T]?: T[k]
}

export interface Options {
    /**
     * 存储键名
     * @default store.$id
     */
    id?: string

    /**
     * 指定需要持久化的属性.
     * @default []
     */
    include?: Path[]

    /**
     * 指定需要排除的属性.
     * @default []
     */
    exclude?: Path[]

    /**
     * 指定需要使用的存储位置.
     * @default localStorage
     */
    storage?: Storage

    /**
     * 执行存储的有效期.
     */
    ttl?: number

    /**
     * 是否启用持久化.
     * @default false
     */
    enable?: boolean
}

export function deepPick<T extends object>(
    source: T,
    paths: Path[],
    target: DeepPartial<T>
): DeepPartial<T>

export function deepPickByPaths<T extends object>(source: T, paths?: Path[]): DeepPartial<T>

export function deepOmit<T extends object>(target: T, paths: Path[]): DeepPartial<T>

export function deepOmitByPaths<T extends object>(target: T, paths: Path[]): DeepPartial<T>

export function setState<State extends StateTree>(
    storage: Storage,
    id: string,
    state: State,
    include: Path[],
    exclude: Path[],
    ttl?: number
): DeepPartial<State>

/**
 * Pinia 持久化插件入口函数。
 * 提供状态的持久化、恢复和清除能力。
 *
 * @example <caption>应用中启用 Pinia 持久化插件</caption>
 * import { createApp } from 'vue'
 * import { createPinia } from 'pinia'
 * import PersistedStatePlugin from 'pinia-plugin-persist'
 * import App from './App.vue'
 *
 * const app = createApp(App)
 * const pinia = createPinia()
 *
 * // 将持久化插件添加到 Pinia 实例
 * pinia.use(PersistedStatePlugin)
 *
 * app.use(pinia)
 * app.mount('#app')
 *
 * @example <caption>在 Pinia Store 中配置持久化</caption>
 * // stores/user.ts
 * import { defineStore } from 'pinia'
 * import { ref, reactive } from 'vue'

 * export const useUserStore = defineStore(
 *     'user',
 *     () => {
 *         const id = ref('')
 *         const nickName = ref('')
 *         const token = ref('')
 *         const user = reactive({
 *             name: '',
 *             ip: {
 *                 v4: '',
 *                 v6: ''
 *             }
 *         })
 *         return { id, nickName, token, user }
 *     },
 *     {
 *         // 启用并配置持久化选项
 *         enable: true,
 *         // 可选：指定需要持久化的属性，点分割的路径写法
 *         include: ['id', 'nickName', 'user.ip'],
 *         // 可选：指定需要忽略的属性，点分割的路径写法
 *         exclude: ['user.ip.v4']
 *         // 可选：指定存储方式，例如 localStorage, sessionStorage 等，默认为 localStorage
 *         // storage: localStorage,
 *         // 可选：自定义存储键名称，默认：storeId
 *         // id: 'user',
 *         // 可选：自定义存储有效期，单位：毫秒
 *         // ttl: '1000'
 *     }
 * )
 */
declare function PersistedStatePlugin(context: PiniaPluginContext): {
    create<State extends StateTree>(data: State): DeepPartial<State>
    remove(): void
}
export default PersistedStatePlugin

import { cloneDeep } from 'lodash-es'

export function deepPick(source, paths, target) {
    let curr = source
    let last = target
    for (let index = 0; index < paths.length; index++) {
        const part = paths[index]
        if (part.endsWith('[]')) {
            let newPart = part.replace('[]', '')
            curr = curr[newPart]
            let attach = last[newPart]
            let afterParts = paths.slice(index + 1)
            last[newPart] = curr.map((it, idx) => deepPick(it, afterParts, attach?.at(idx) || {}))
            break
        } else {
            curr = curr[part]
            if (index == paths.length - 1) {
                last[part] = curr
            } else {
                last[part] = last[part] || {}
            }
            last = last[part]
        }
    }
    return target
}

export function deepPickByPaths(source, paths = []) {
    if (!paths || paths.length == 0) {
        return source
    }
    const pathPartList = paths.map(it => it.split('.'))
    const state = {}
    pathPartList.forEach(parts => deepPick(source, parts, state))
    return state
}

export function deepOmit(target, paths) {
    let current = target
    for (let index = 0; index < paths.length; index++) {
        const part = paths[index]
        if (part.endsWith('[]')) {
            let newPart = part.replace('[]', '')
            current[newPart] = current[newPart].map(it =>
                deepOmit(cloneDeep(it), paths.slice(index + 1))
            )
            break
        } else {
            index != paths.length - 1 ? (current = current[part]) : delete current[part]
        }
    }
    return target
}

export function deepOmitByPaths(source, paths) {
    if (!paths || paths.length == 0) {
        return source
    }
    const pathPartList = paths.map(it => it.split('.'))
    const target = cloneDeep(source)
    pathPartList.forEach(parts => deepOmit(target, parts))
    return target
}

export function setState(storage, id, state, include, exclude, ttl) {
    const pick = deepPickByPaths(state, include)
    const omit = deepOmitByPaths(pick, exclude)
    if (ttl && ttl > 0) {
        omit._expireAt = Date.now() + ttl
    }
    const json = JSON.stringify(omit)
    storage.setItem(id, json)
    return omit
}
export default function (context) {
    const { store, options } = context
    const {
        id = store.$id,
        include = [],
        exclude = [],
        storage = localStorage,
        ttl,
        enable
    } = options
    if (enable) {
        let text = storage.getItem(id)
        if (text) {
            let data = JSON.parse(text)
            let expireAt = parseInt(data._expireAt)
            if (isNaN(expireAt)) {
                store.$patch(data)
            } else {
                if (expireAt > Date.now()) {
                    store.$patch(data)
                }
            }
        }
        store.$subscribe(
            (_mutation, state) => {
                setState(storage, id, state, include, exclude, ttl)
            },
            { detached: true }
        )
    }
    return {
        create(data) {
            store.$patch(data)
            return setState(storage, id, data, include, exclude, ttl)
        },
        remove() {
            store.$reset()
            storage.removeItem(id)
        }
    }
}

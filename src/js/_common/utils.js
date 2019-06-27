const _map = new Map

export const AppEvents = new EventTarget
export const $ = document.querySelector.bind(document)
export const $$ = document.querySelectorAll.bind(document)

export const useConfig = (initial = {}) => {
    Object.entries(initial).forEach(([key, value]) => {
        _map.set(key, value)
    })
    const get = _map.get.bind(_map)
    const set = _map.set.bind(_map)
    const del = _map.delete.bind(_map)

    return [get, set, del]
}

export default useConfig
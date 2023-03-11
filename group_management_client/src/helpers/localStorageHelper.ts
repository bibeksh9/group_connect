const storeValue = (key: string, value: string) => {
    localStorage.setItem(key, value);
}
const storeObject = (key: string, value: object) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const getObject = (key: string): any => {
    let data = localStorage.getItem(key);
    if (data !== null)
        return JSON.parse(data!);
    return null;
}
const removeStorageData = (key: string): any => {

    return localStorage.removeItem(key);
}
const getvalue = (key: string): string | null => {
    let data = localStorage.getItem(key);
    if (data)
        return data;
    return null;
}
const getToken = () => {
    return getObject('userdata') !== null ? "Bearer " + getObject('userdata')?.token : "";
}
export { storeValue, storeObject, getObject, getvalue, removeStorageData, getToken }
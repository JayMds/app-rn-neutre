import * as SecureStore from 'expo-secure-store';

export async function saveSessionId(key, value) {
     await SecureStore.setItemAsync(key, value)
}

export async function getSessionId(key) {
    return await SecureStore.getItemAsync(key)
}

export async function removeSessionId(key) {
    await SecureStore.deleteItemAsync(key)
}
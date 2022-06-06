import { NativeModules } from 'react-native'
const { GigyaBiometric } = NativeModules

export class BiometricService {
    async isLocked() {
        return GigyaBiometric.isLocked()
    }

    async isOptIn() {
        return GigyaBiometric.isOptIn()
    }

    async optIn() {
        try {
            const result = await GigyaBiometric.optIn()
            return result
        } catch (e) {
            throw false
        }
    }

    async optOut() {
        try {
            const result = await GigyaBiometric.optOut()
            return result
        } catch (e) {
            throw false
        }
    }

    async lockSession() {
        try {
            const result = await GigyaBiometric.lockSession()
            return result
        } catch (e) {
            throw false
        }
    }

    async unlockSession() {
        try {
            const result = await GigyaBiometric.unlockSession()
            return result
        } catch (e) {
            throw false
        }
    }
}
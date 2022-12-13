import { NativeModules, Platform } from 'react-native'

const { GigyaWebAuthn } = NativeModules

export class WebAuthnService {
    async login() {
        try {
            return await GigyaWebAuthn.login()
        } catch (e) {
            const error = new GigyaError(e)
            throw error
        }
    }

    async register() {
        try {
            return await GigyaWebAuthn.register()
        } catch (e) {
            const error = new GigyaError(e)
            throw error
        }
    }

    async revoke() {
        try {
            return await GigyaWebAuthn.revoke()
        } catch (e) {
            const error = new GigyaError(e)
            throw error
        }
    }
}
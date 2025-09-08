import { NativeModules, Platform } from 'react-native'
import { GigyaError } from "./index";

const { GigyaWebAuthn } = NativeModules

export class WebAuthnService {
    async login() {
        try {
            const req = await GigyaWebAuthn.login()
            return JSON.parse(req)
        } catch (e) {
            const error = new GigyaError(e)
            throw error
        }
    }

    async register() {
        try {
            const req = await GigyaWebAuthn.register()
            return JSON.parse(req)
        } catch (e) {
            const error = new GigyaError(e)
            throw error
        }
    }

    async revoke() {
        try {
            const req = await GigyaWebAuthn.revoke()
            return JSON.parse(req)
        } catch (e) {
            const error = new GigyaError(e)
            throw error
        }
    }

    async passkeyLogin() {
        if (Platform.OS === 'ios') {
            this.login()
            return
        }
        try {
            const req = await GigyaWebAuthn.passkeyLogin()
            return JSON.parse(req)
        } catch (e) {
            const error = new GigyaError(e)
            throw error
        }
    }

    async passkeyRegister() {
        if (Platform.OS === 'ios') {
            this.register()
            return
        }
        try {
            const req = await GigyaWebAuthn.passkeyRegister()
            return JSON.parse(req)
        } catch (e) {
            const error = new GigyaError(e)
            throw error
        }
    }

    async passkeyRevoke(id) {
        try {
            const req = await GigyaWebAuthn.passkeyRevoke(id)
            return JSON.parse(req)
        } catch (e) {
            const error = new GigyaError(e)
            throw error
        }
    }

    async passkeyGetCredentials() {
        try {
            const req = await GigyaWebAuthn.passkeyGetCredentials()
            return JSON.parse(req)
        } catch (e) {
            const error = new GigyaError(e)
            throw error
        }
    }
}
        
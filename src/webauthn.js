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
}
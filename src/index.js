import { NativeEventEmitter, NativeModules } from 'react-native'
import { BiometricService } from './biometric'
import { ResolverFactory } from './resolvers'
import { WebAuthnService } from './webauthn'
import { RequestQueue } from './queue'

const { GigyaSdk } = NativeModules

const GigyaSdkEvents = new NativeEventEmitter(NativeModules.GigyaSdkEvents)

export class GigyaInterface {
    constructor() {
        this.queue = new RequestQueue()
        this.resolverFactory = new ResolverFactory()
        this.biometric = new BiometricService(this.queue)
        this.webAuthn = new WebAuthnService(this.queue)
    }

    /**
     * Check login state.
     * @returns {boolean} True if a valid session is available.
     */
    isLoggedIn() {
        return GigyaSdk.isLoggedIn()
    }

    /**
     * Manual SDK initialization.
     * 
     * SDK can be initialized using native implementation.
     * @link https://sap.github.io/gigya-android-sdk/sdk-core/#implicit-initialization
     * @link https://sap.github.io/gigya-swift-sdk/GigyaSwift/#implicit-initialization
     * 
     * @param {string} apikey 
     * @param {string} domain 
     */
    initFor(apikey, domain, cname) {
        GigyaSdk.initFor(apikey, domain ?? null, cname ?? null);
    }

    /**
     * 
     * Get current session.
     * 
     * @returns Session promise.
     */
    async getSession() {
        return this.queue.enqueue(async () => {
            try {
                const result = await GigyaSdk.getSession()
                if (result === '{}') return null            
                return JSON.parse(result)
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }

    /**
     * 
     * Manually set the current session.
     * 
     * @param {string} token 
     * @param {string} secret 
     * @param {number} [expiration] 
     * @returns Session promise.
     */
    async setSession(token, secret, expiration) {
        return this.queue.enqueue(async () => {
            try {
                const req = await GigyaSdk.setSession(token, secret, expiration ?? 0)
                return JSON.parse(req)
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }

    /**
     * 
     * Invalidate session.
     * 
     */
    async invalidateSession() {
        return this.queue.enqueue(async () => {
            try {
                const req = await GigyaSdk.invalidateSession()
                return req
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }
    
    /**
     * 
     * Generic send request.
     * 
     * @param {string} api 
     * @param {map} params 
     * @returns Response promise.
     */
    async send(api, params) {
        return this.queue.enqueue(async () => {
            try {
                const req = await GigyaSdk.send(api, JSON.stringify(params) ?? "")
                return JSON.parse(req)
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }

    /**
     * Logout of existing session.
     * 
     * @returns Response promise.
     */
    async logout() {
        return this.queue.enqueue(async () => {
            try {
                const req = await GigyaSdk.logout();
                return JSON.parse(req)
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }

    /**
     * Register a new user.
     * 
     * @param {string} email 
     * @param {string} password 
     * @param {map} params 
     * @returns Response promise.
     */
    async register(email, password, params) {
        return this.queue.enqueue(async () => {
            try {
                const req = await GigyaSdk.register(email, password, JSON.stringify(params) ?? "")
                return JSON.parse(req)
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }

    /**
     * Login an existing user.
     * @param {string} loginId 
     * @param {string} password 
     * @param {map} params 
     * @returns Response promise. 
     */
    async login(loginId, password, params) {
        return this.queue.enqueue(async () => {
            try {
                const req = await GigyaSdk.login(loginId, password, JSON.stringify(params) ?? "")
                return JSON.parse(req)
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }

    /**
     * Login with Custom ID.
     * @param {*} identifier 
     * @param {*} identifierType 
     * @param {*} password 
     * @param {*} params 
     * @returns Response promise. 
     */
    async loginWithCustomId(identifier, identifierType, password, params) {
        return this.queue.enqueue(async () => {
            try {
                const req = await GigyaSdk.loginWithCustomId(identifier, identifierType, password, JSON.stringify(params) ?? "")
                return JSON.parse(req)
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }

    /**
     * Social login via supported provider.
     * 
     * @param {string} provider 
     * @param {map} params 
     * @returns Response promise. 
     */
    async socialLogin(provider, params) {
        return this.queue.enqueue(async () => {
            try {
                const req = await GigyaSdk.socialLogin(provider, JSON.stringify(params) ?? "")
                return JSON.parse(req)
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }

    /**
     * SSO login via CLP.
     * 
     * @param {map} params 
     * @returns Response promise. 
     */
    async sso(params) {
        return this.queue.enqueue(async () => {
            try {
                const req = await GigyaSdk.sso(JSON.stringify(params) ?? "")
                return JSON.parse(req)
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }

    /**
     * Set/update account information.
     * @param {map} params 
     * @returns Response promise.
     */
    async setAccount(params) {
        return this.queue.enqueue(async () => {
            try {
                const req = await GigyaSdk.setAccount(JSON.stringify(params) ?? "")
                return JSON.parse(req)
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }

    /**
     * Get account information.
     * 
     * @param {map} params 
     * @returns Response promise.
     */
    async getAccount(params) {
        return this.queue.enqueue(async () => {
            try {
                const req = await GigyaSdk.getAccount(JSON.stringify(params) ?? "")
                return JSON.parse(req)
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }

    /**
     * Add social provider connection to existing account.
     * @param {string} provider 
     * @param {map} params 
     * @returns Response promise.
     */
    async addConnection(provider, params) {
        return this.queue.enqueue(async () => {
            try {
                const req = await GigyaSdk.addConnection(provider ?? "", JSON.stringify(params) ?? "")
                return JSON.parse(req)
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }

    /**
     * Remove social provider connection from existing account.
     * 
     * @param {string} provider 
     * @returns Response promise.
     */
    async removeConnection(provider) {
        return this.queue.enqueue(async () => {
            try {
                const req = await GigyaSdk.removeConnection(provider ?? "")
                return JSON.parse(req)
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }

     /**
     * Get authentication code required for web session exchange.
     *  
     * @returns Response promise.
     */
     async getAuthCode() {
        return this.queue.enqueue(async () => {
            try {
                const code = await GigyaSdk.getAuthCode();
                return code
            } catch (e) {
                const error = new GigyaError(e)
                throw error
            }
        })
    }

    /**
     * Show screen-set with params.
     * 
     * @param {string} name 
     * @param {map} params 
     * @param {*} callback 
     */
     showScreenSetWithParams(name, params, callback) {
        GigyaSdk.showScreenSet(name, JSON.stringify(params) ?? "")

        listener = GigyaSdkEvents.addListener('event', (jsonData) => {
            const data = JSON.parse(jsonData)
            callback(data.event, data.data)
            
            if( data.event == 'onCanceled' || data.event == 'onHide') {
                listener.remove()
            }
        })
    }

    /**
     * Show screen-set.
     * 
     * @param {*} name 
     * @param {*} callback 
     */
    showScreenSet(name, callback) {
        this.showScreenSetWithParams(name, {}, callback)
    }
}

/**
 * Gigya error model.
 */
export class GigyaError {
    constructor(error) {
        const e = JSON.parse(error.message)
        this.callId = e.callId
        this.errorCode = e.errorCode
        this.statusCode = e.statusCode
        this.errorDetails = e.errorDetails
        this.statusReason = e.statusReason
        this.mapped = e
    }

    getInterruption() {
        return this.errorCode
    }
}

/**
 * Availalbe handled interruptions.
 */
export const GigyaInterruption = {
    pendingRegistration: 206001,
    pendingVerification: 206002,
    conflictingAccounts: 403043
}

export const Gigya = new GigyaInterface();

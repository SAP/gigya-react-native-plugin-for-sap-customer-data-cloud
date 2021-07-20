import { NativeModules } from 'react-native'

const { GigyaSdk } = NativeModules

export class ResolverFactory {
    getResolver(error) {
        switch (error.getInterruption()) {
            case 403043: {
                return new LinkAccountResolver(error)
                break
            }
            case 206001: {
                return new PendingRegistrationResolver(error)
                break
            }
            case 206002: {
                return new PendingVerificationResolver(error)
                break
            }
        }
    }
}

export class IResolver {
    constructor(error) {
        this.regToken = error.mapped.regToken
    }
}

export class LinkAccountResolver extends IResolver { 
    async getConflictingAccount() {
        return await GigyaSdk.resolve("getConflictingAccount", "")
    }

    async linkToSite(loginId, password) {
        return await GigyaSdk.resolve("linkToSite", JSON.stringify({'loginId': loginId, 'password': password}) ?? "")
    }

    async linkToSocial(provider) {
        return await GigyaSdk.resolve("linkToSocial", JSON.stringify({'provider': provider}) ?? "")
    }
}

export class PendingRegistrationResolver extends IResolver {
    async setAccount(params) {
        return await GigyaSdk.resolve("setAccount", JSON.stringify(params) ?? "")
    }
 }

export class PendingVerificationResolver extends IResolver { }
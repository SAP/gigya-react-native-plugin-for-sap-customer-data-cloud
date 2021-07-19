import { GigyaError } from ".";
import { GigyaDictionary, GigyaSocialProviders } from "./Models";

export class ResolverFactory {
    getResolver(error: GigyaError) : IResolver
}

export class IResolver {
    regToken: string;

    constructor(regToken: string)
}

export interface LinkAccountResolver extends IResolver { 
    getConflictingAccount(): Promise<GigyaDictionary>
    
    linkToSite(loginId: string, password: string): Promise<GigyaDictionary>

    linkToSocial(provider: GigyaSocialProviders): Promise<GigyaDictionary>
}

export interface PendingRegistrationResolver extends IResolver { 
    setAccount(params: Record<string, any>): Promise<GigyaDictionary>
}

export interface PendingVerificationResolver extends IResolver {  }
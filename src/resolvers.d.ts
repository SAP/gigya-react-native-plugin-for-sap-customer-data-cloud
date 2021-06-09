import { GigyaError } from ".";
import { GigyaDictionary, GigyaSocialProviders } from "./Models";

export class ResolverFactory {
    getResolver(error: GigyaError) : void
}

export class IResolver {
    regToken: string;

    constructor(regToken: string)
}

export class LinkAccountResolver extends IResolver { 
    getConflictingAccount(): Promise<GigyaDictionary>
    
    linkToSite(loginId: string, password: string): Promise<GigyaDictionary>

    linkToSocial(provider: GigyaSocialProviders): Promise<GigyaDictionary>
}

export class PendingRegistrationResolver extends IResolver { 
    setAccount(params: Record<string, any>): Promise<GigyaDictionary>
}

export class PendingVerificationResolver extends IResolver {  }



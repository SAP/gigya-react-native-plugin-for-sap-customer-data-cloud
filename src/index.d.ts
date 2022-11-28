import * as React from 'react';
import { BiometricService } from './biometric';
import { GigyaDictionary, GigyaInterruption, GigyaSocialProviders } from './Models';
import { ResolverFactory} from './Resolvers'

export { GigyaInterruption }

export class GigyaError {
    callId: string;
    errorCode: number;
    statusCode: number;
    errorDetails: string;
    statusReason: string;
    mapped: GigyaDictionary;
    
    constructor(error: any)

    getInterruption(): GigyaInterruption
}

export namespace Gigya {
    const resolverFactory: ResolverFactory

    const biometric: BiometricService
    
    function isLoggedIn(): boolean;

    function initFor(apikey: string, apiDomain?: string): void;

    function getSession(): Promise<null | {sessionToken: string, sessionSecret: string, expirationTime: number}>;

    function setSession(token: string, secret: string, expiration?: number): Promise<{sessionToken: string, sessionSecret: string, expirationTime: number}>;

    function send(api: string, params?: Record<string, any>): Promise<GigyaDictionary>;

    function logout(): Promise<GigyaDictionary>;

    function register(email: string, password: string, params?: Record<string, any>): Promise<GigyaDictionary>;

    function login(loginId: string, password: string, params?: Record<string, any>): Promise<GigyaDictionary>;

    function socialLogin(provider: GigyaSocialProviders, params?: Record<string, any>): Promise<GigyaDictionary>;

    function sso(params?: Record<string, any>): Promise<GigyaDictionary>;

    function setAccount(params: Record<string, any>): Promise<GigyaDictionary>;

    function getAccount(params?: Record<string, any>): Promise<GigyaDictionary>;

    function addAccount(provider: GigyaSocialProviders, params?: Record<string, any>): Promise<GigyaDictionary>;
    
    function removeAccount(provider: GigyaSocialProviders): Promise<GigyaDictionary>;

    function showScreenSet(name: string, callback: (event: string, data: GigyaDictionary) => void): void;

    function showScreenSetWithParams(name: string, params: Record<string, any>, callback: (event: string, data: GigyaDictionary) => void): void;

}


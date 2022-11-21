import { GigyaDictionary } from "./Models"

export interface WebAuthnService {
    login(): Promise<GigyaDictionary>
    register(): Promise<GigyaDictionary>
    revoke(): Promise<GigyaDictionary>
}
import { GigyaDictionary } from "./Models"

export interface WebAuthnService {
    login(): Promise<GigyaDictionary>
    register(): Promise<GigyaDictionary>
    revoke(): Promise<GigyaDictionary>

    passkeyLogin(): Promise<GigyaDictionary>
    passkeyRegister(): Promise<GigyaDictionary>
    passkeyRevoke(id: String): Promise<GigyaDictionary>
    passkeyGetCredentials(): Promise<GigyaDictionary>
}
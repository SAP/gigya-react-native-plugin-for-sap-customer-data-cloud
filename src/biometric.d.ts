export interface BiometricService {
    isLocked(): boolean;
    isLoggedIn(): boolean;
    isOptIn(): Promise<boolean>
    optIn(): Promise<boolean>
    optOut(): Promise<boolean>
    lockSession(): Promise<boolean>
    unlockSession(): Promise<boolean>
}
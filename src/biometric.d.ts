import { GigyaDictionary } from './Models';

export interface BiometricService {
    isSupported(): boolean;
    isLocked(): boolean;
    isOptIn(): boolean
    optIn(): Promise<boolean>
    optOut(): Promise<boolean>
    lockSession(): Promise<boolean>
    unlockSession(): Promise<boolean>
}
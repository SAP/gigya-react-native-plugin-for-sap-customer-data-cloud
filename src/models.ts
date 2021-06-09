export type GigyaDictionary = Record<string, any>;

export type GigyaSocialProviders = "facebook" | "google" | "yahoo" | "twitter" | "line" | "wechat" | "amazon" | "apple" |
 "instagram" | "linkedin" 

export enum GigyaInterruption {
    pendingRegistration = 206001,
    pendingVerification = 206002,
    conflictingAccounts = 403043,
}
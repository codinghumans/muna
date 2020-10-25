import { builtinModules } from "module";

export const joinMasterKey = (key: Buffer, iv: Buffer) : string {
    return `${iv.toString('hex')}-${key.toString('hex')}`;
}

export const parseMasterKey = (masterKey: string) : string {
    return masterKey.split("-")
}
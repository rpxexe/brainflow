import Cryptr from "cryptr"

const crypt = new Cryptr(process.env.ENCRYPTION_KEY!);
export const encrypt=(text:string)=>crypt.encrypt(text)
export const decrypt=(text:string)=>crypt.decrypt(text)
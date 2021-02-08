import { isValidObjectId } from "mongoose";


export class MongoUtil {
    static isValidObjectId(id: string) {
        return isValidObjectId(id);
    }
}
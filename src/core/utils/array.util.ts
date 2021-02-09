


export class ArrayUtil {
    static hasTwoArrayAnyMatchingValues<T>(array1: T[], array2: T[]) {

        for (const value1 of array1) {
            for (const value2 of array2) {
                if (value1 == value2) {
                    return true;
                }
            }
        }


        return false;
    }
}
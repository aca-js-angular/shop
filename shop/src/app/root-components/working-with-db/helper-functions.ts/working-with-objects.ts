
export function __copyObject<T>(srcObject: T): T{
    let copy = new Object() as T;
    for(let key in srcObject){
        copy[key] = srcObject[key];
    }
    return copy;
}
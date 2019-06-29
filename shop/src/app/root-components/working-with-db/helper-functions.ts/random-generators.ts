
export function __randomNumber(max: number = 100, min: number = 0): number{
    const difference = max - min + 1;
    let randomOffset = Math.floor(Math.random() * difference);
    if(randomOffset === difference) randomOffset--;
    return min + randomOffset;
}

export function __randomDate(startPoint: string = '01.01.1970', endPoint: string): Date {
    const min: number = new Date(startPoint).getTime();
    const max: number = endPoint ? new Date(endPoint).getTime() : Date.now();
    return new Date(__randomNumber(min,max))
}

export function __randomFrom<T>(srcArray: T[]): T {
    return srcArray[__randomNumber(srcArray.length - 1)]
}
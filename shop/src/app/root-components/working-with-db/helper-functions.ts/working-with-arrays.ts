
export function __shuffleArray<T>(srcArray: T[]): T[] {

    let temporaryValue: T;
    let randomIndex: number;
    let currentIndex: number = srcArray.length;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex --;

        temporaryValue = srcArray[currentIndex];
        srcArray[currentIndex] = srcArray[randomIndex];
        srcArray[randomIndex] = temporaryValue;
    }
    return srcArray;
}
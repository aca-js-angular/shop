
export function __symbol(src: string): string{
    const elem = document.createElement('span');
    elem.innerHTML = src;
    return elem.innerHTML;
}
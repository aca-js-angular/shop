export interface flowOptions{
    target: HTMLElement,
    duration?: number,
    delay?: number,
    from?: 'left' | 'right' | 'top' | 'bottom',
    inline?: boolean,
    if?: any,
    overflow?: number,
}
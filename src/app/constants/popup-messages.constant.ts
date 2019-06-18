
export const removeBasketItem = function(quantity: number): string[] {
    return [`You are about to remove ${quantity} ${quantity > 1 ? 'items' : 'item'}`]
}

export const clearBasket = function(quantity: number): string[] {
    return [`You are about to remove ${quantity} ${quantity > 1 ? 'orders' : 'order'}`,`this action can't be undone`]
}

export const logOut = function(): string[] {
    return [`Are you sure ?`]
}

export const resetPassSucces = function(email: string): string[] {
    return [`Password reset link has been sent to ${email}.`,`Checkout your email to set new password.`]
}

export const resetPassFail = function(email: string): string[] {
    return [`${email} wasn't registered on Mode-Concept.`,`Please type email of your account.`]
}
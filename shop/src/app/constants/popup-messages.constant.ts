
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

//---Comments---
export const deleteComment = function(): string[] {
    return [`Delete Comment ?`]
}

export const editComment = function(): string[] {
    return [`Edit Comment ?`]
}

//---Chat----
export const deleteMessage = function(): string[] {
    return [`Delete Message ?`]
}
export const clearAllMessages = function(): string[] {
    return [`Clear All Messages ?`]
}
export const sendCurrentProdLink = function(): string[] {
    return [`Send Current Product Link ?`]
}

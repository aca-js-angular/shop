
export function singleCommentConstructor(commentContent: string, userUid: string, randomId: string){
    return {
        content: commentContent,
        sender: userUid,
        commentId: randomId,
        date: new Date(),
        likes: []
    }
}
export interface ProductCommentsMap {
    allComments: ProductSingleComment[];
}

export interface ProductSingleComment {
    content: string;
    commentId: string;
    sender: string;
    likes: string[];
    date: Date,
}

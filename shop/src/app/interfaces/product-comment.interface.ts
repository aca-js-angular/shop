
export interface ProductSingleComment {
    content: string;
    commentId: string;
    sender: string;
    likes: string[];
    date: Date,
    isEdited?: boolean;
}

export type ProductFieldsSubjectNextType = {
     currentProductRouteId: string,
     currentProductComments: ProductSingleComment[];
}
export type CommentEntity = {
    _id: string
    content: string
    postId: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string
    },
    createdAt: string
}
export enum Color {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike',
}
export type CommentCreateType = Omit<CommentEntity, '_id'>
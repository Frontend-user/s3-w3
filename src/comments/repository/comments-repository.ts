import {CommentCreateType} from "../types/comment-type";
import {CommentModel} from "../../db";
import {ObjectId} from "mongodb";
import {currentUser} from "../../application/current-user";
import {usersIdsLikeStatuses} from "../../schemas/schemas";
import {LIKE_STATUSES} from "../../common/constants/http-statuses";

export class CommentsRepository {
    async createComment(comment: CommentCreateType): Promise<false | ObjectId> {
        let response = await CommentModel.create(comment);
        return response ? response._id : false
    }

    async updateComment(id: ObjectId, updateComment: {
        content: string
    }): Promise<boolean> {
        const response = await CommentModel.updateOne({_id: id}, updateComment)
        return response.matchedCount === 1;
    }

    async updateCommentLikeStatus(id: ObjectId, likeStatus: string): Promise<boolean> {
        //Получили лайк
        // если там нету обекта тогда пушим лайк и меняем статус | ГОТОВО
        //если есть и равен лайк тогда ничего
        //если есть и не равен лайк тогда меняем на лайк и статус на лайк
        const userIdLikeStatus: usersIdsLikeStatuses = {
            userId: currentUser.userId,
            likeStatus: likeStatus
        }

        const comment: any = await CommentModel.findOne({_id: id})
        let commentLikeStatusesArray: usersIdsLikeStatuses[] = comment.likesInfo.usersLikeStatuses
        let findObject = commentLikeStatusesArray.find(o => o.userId === currentUser.userId)


        if (!findObject && likeStatus !== LIKE_STATUSES.NONE) {

            if (likeStatus === LIKE_STATUSES.LIKE) {
                let currentLikes = comment.likesInfo.likesCount
                currentLikes ++
                comment.likesInfo.likesCount = currentLikes
            } else {
                let currentDislikes = comment.likesInfo.dislikesCount
                currentDislikes ++
                comment.likesInfo.dislikesCount = currentDislikes
            }
            comment.likesInfo.myStatus = likeStatus
            comment.likesInfo.usersLikeStatuses.push(userIdLikeStatus)
            comment.markModified('likesInfo')
            await comment.save()
        }


        if (likeStatus !== LIKE_STATUSES.NONE && findObject && findObject.likeStatus !== likeStatus) {
            const getComment: any = await CommentModel.findOne({_id: id})
            let dislikes: number = getComment.likesInfo.dislikesCount
            let likes: number = getComment.likesInfo.likesCount
            if (likeStatus === LIKE_STATUSES.DISLIKE) {
                dislikes++
                likes--
            } else {
                likes++
                dislikes--

            }

            await CommentModel.updateOne({_id: id, 'likesInfo.usersLikeStatuses.userId': currentUser.userId}, {
                '$set': {
                    'likesInfo.myStatus': likeStatus,
                    'likesInfo.likesCount': likes,
                    'likesInfo.dislikesCount': dislikes,
                    'likesInfo.usersLikeStatuses.$.likeStatus': likeStatus
                }
            })
            const updatedComment: any = await CommentModel.findOne({_id: id})
            console.log(updatedComment.likesInfo.usersLikeStatuses, 'gggggggggggggggggggggggggggg')
        }

        if (likeStatus === LIKE_STATUSES.NONE && findObject && likeStatus !==comment.likesInfo.myStatus) {
            console.log(comment.likesInfo, 'BEFORE LIKEINO')
            const getComment: any = await CommentModel.findOne({_id: id})
               let dislikes: number = getComment.likesInfo.dislikesCount
            let likes: number = getComment.likesInfo.likesCount
            let pastLikeStatus = getComment.likesInfo.myStatus
            if (pastLikeStatus === LIKE_STATUSES.DISLIKE) {
                dislikes--
            } else {
                likes--
            }
            await CommentModel.updateOne(
                {_id: id},
                {
                    '$set': {
                        'likesInfo.myStatus': LIKE_STATUSES.NONE,
                        'likesInfo.likesCount': likes,
                        'likesInfo.dislikesCount': dislikes,
                    },
                    $pull: {'likesInfo.usersLikeStatuses': {userId: currentUser.userId}}
                }
            );

            const updatedComment: any = await CommentModel.findOne({_id: id})
            console.log(updatedComment.likesInfo, 'gggggggggggggggggggggggggggglikesInfo')
            console.log(updatedComment.likesInfo.usersLikeStatuses, 'gggggggggggggggggggggggggggg')
        }

        return true;
    }

    // let likes = 0
    // let dislikes = 0
    // commentLikeStatusesArray.forEach(item => {
    //     if (item.likeStatus === LIKE_STATUSES.LIKE) {
    //         likes += 1
    //     }
    // })
    // commentLikeStatusesArray.forEach(item => {
    //     if (item.likeStatus === LIKE_STATUSES.DISLIKE) {
    //         dislikes += 1
    //     }
    // })
    // comment.likesInfo.likesCount = likes
    // comment.likesInfo.dislikesCount = dislikes
    // comment.markModified('likesInfo.likesCount')
    // comment.markModified('likesInfo.dislikesCount')
    // let response = await comment.save()

    // return response.matchedCount === 1;
    // if (findObject && findObject.likeStatus === likeStatus) {
    //     console.log('likeStatus',likeStatus)
    //     return false
    // }


    async deleteCommentById(commentId: ObjectId) {
        const comment = await CommentModel.deleteOne({_id: commentId})
        return !!comment
    }
}

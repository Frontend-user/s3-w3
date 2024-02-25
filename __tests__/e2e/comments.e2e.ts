import request from "supertest";
import {app} from "../../src/app";
import mongoose from "mongoose";
// @ts-ignore
import {customTestsService} from "./custom-tests.e2e";
import {response} from "express";
import {LIKE_STATUSES} from "../../src/common/constants/http-statuses";

const mongoURI: string = process.env.MONGO_URL!
beforeAll(async () => {
    await mongoose.connect(mongoURI)
})

afterAll(async () => {
    await mongoose.connection.close()
})
let correctUserData = {
    "login": "string",
    "email": "emailemail@mail.ru",
    "password": "password",
}
let correctSecondUserData = {
    "login": "string2",
    "email": "emailemail2@mail.ru",
    "password": "password",
}

let createdUserId: any
let tokens = {
    accessToken: '', refreshToken: ''
}
let blogId: any
let postId: any
let comment: any
let commentId: any
const textGreenColor = '\x1b[32m%s\x1b[0m'
const consoleLog = (action: string, responseName: string, response: any) => {
    console.log(textGreenColor, `${action} \n` +
        `${responseName}: `, response)
}
describe('/CUSTOM', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('CREATE USER', async () => {
        createdUserId = await customTestsService.createUser(correctUserData)
        // consoleLog('CREATE USER', 'createdUserId', createdUserId)
    });


    it('LOGIN', async () => {
        tokens = await customTestsService.login({
            "loginOrEmail": correctUserData.email,
            "password": correctUserData.password,
        })
        // consoleLog('LOGIN', 'accessToken', tokens.accessToken)
        // consoleLog('LOGIN', 'refreshToken', tokens.refreshToken)
    });

    it('CREATE BlOG', async () => {
        blogId = await customTestsService.createBlog(tokens.accessToken)
        // consoleLog('CREATE BlOG','blogId',blogId)
    });

    it('CREATE POST', async () => {
        postId = await customTestsService.createPost(tokens.accessToken, blogId)
        // consoleLog('CREATE POST','postId',postId)
    });

    it('CREATE COMMENT', async () => {
        commentId = await customTestsService.createComment(tokens.accessToken, postId)
        // consoleLog('CREATE COMMENT','commentId',commentId)
    });
    it('LIKE COMMENT', async () => {
        comment = await customTestsService.likeComment(tokens.accessToken, commentId, LIKE_STATUSES.LIKE)
        console.log(comment.body.likesInfo.usersLikeStatuses, 'comment.body.likesInfo')
        consoleLog('LIKE COMMENT', 'comment', comment.body)
    });
    let createdUserId2: any
    let tokens2 = {
        accessToken: '', refreshToken: ''
    }
    let blogId2: any
    let postId2: any

    // it('LOGOUT', async () => {
    //     let logoutResponse = await customTestsService.logout(tokens.refreshToken)
    //     // consoleLog('LOGOUT', 'logoutResponse', logoutResponse)
    // });
//     //
    it('CREATE USER', async () => {
        createdUserId2 = await customTestsService.createUser(correctSecondUserData)
        // consoleLog('CREATE USER', 'createdUserId', createdUserId2)
    });
    it('LOGIN', async () => {
        tokens2 = await customTestsService.login({
            "loginOrEmail": correctSecondUserData.email,
            "password": correctSecondUserData.password,
        })
        // consoleLog('LOGIN', 'tokens2.accessToken', tokens2.accessToken)
        // consoleLog('LOGIN', 'tokens2.refreshToke', tokens2.refreshToken)
    });
    it('LIKE COMMENT', async () => {
        comment = await customTestsService.likeComment(tokens2.accessToken, commentId, "")
        console.log(comment.body.likesInfo, 'comment.body.likesInfo')
        consoleLog('LIKE COMMENT', 'comment', comment.body)
    });
    it('DISLIKE COMMENT', async () => {
        comment = await customTestsService.likeComment(tokens2.accessToken, commentId, LIKE_STATUSES.DISLIKE)
        console.log(comment.body.likesInfo, 'comment.body.likesInfo')
        consoleLog('DISLIKE COMMENT', 'comment', comment.body)
    });


    it('get COMMENT', async () => {

        const response: any = await request(app)
            .get(`/comments/${commentId}`)
            // .set('authorization', 'Bearer ' + tokens.accessToken)
            // .send({"likeStatus":'sdfd'})
            .expect(204,{'sdds':'s'})
    });

    it('get COMMENT', async () => {

        const response: any = await request(app)
            .get(`/posts/${postId}/comments`)
            .set('authorization', 'Bearer ' + tokens.accessToken)
            // .send({"likeStatus":'sdfd'})
            .expect(204,{'sdds':'s'})
    });

    // it('get COMMENT', async () => {
    //
    //     const response: any = await request(app)
    //         .get(`/comments/${commentId}`)
    //         .set('authorization', 'Bearer ' + tokens.accessToken)
    //         .send({"likeStatus":'sdfd'})
    //         .expect(204,{'sdds':'s'})
    // });
    //
    // it('LOGOUT', async () => {
    //     let logoutResponse = await customTestsService.logout(tokens.refreshToken)
    //     consoleLog('LOGOUT', 'logoutResponse', logoutResponse)
    // });
    //
    //
    //
    // it('DISLIKE COMMENT', async () => {
    //
    //     const response: any = await request(app)
    //         .put(`/comments/dsa/like-status`)
    //         .set('authorization', 'Bearer ' + tokens.accessToken)
    //         .send({"likeStatus":'sdfd'})
    //         .expect(204)
    // });
    // it('NONE COMMENT', async () => {
    //     comment = await customTestsService.likeComment(tokens.accessToken, commentId, LIKE_STATUSES.NONE)
    //     console.log(comment.body.likesInfo, 'comment.body.likesInfo')
    //     consoleLog('NONE COMMENT', 'comment', comment.body)
    // });
    //
    // it('LIKE COMMENT', async () => {
    //     comment = await customTestsService.likeComment(tokens.accessToken, commentId, LIKE_STATUSES.LIKE)
    //     console.log(comment.body.likesInfo.usersLikeStatuses, 'comment.body.likesInfo')
    //     consoleLog('LIKE COMMENT', 'comment', comment.body)
    // });
    //
    // it('LIKE COMMENT', async () => {
    //     comment = await customTestsService.likeComment(tokens.accessToken, commentId, LIKE_STATUSES.LIKE)
    //     console.log(comment.body.likesInfo.usersLikeStatuses, 'comment.body.likesInfo')
    //     consoleLog('LIKE COMMENT', 'comment', comment.body)
    // });
    // it('DISLIKE COMMENT', async () => {
    //     comment = await customTestsService.likeComment(tokens.accessToken, commentId, LIKE_STATUSES.DISLIKE)
    //     console.log(comment.body.likesInfo.usersLikeStatuses, 'comment.body.likesInfo')
    //     consoleLog('DISLIKE COMMENT', 'comment', comment.body)
    // });
    // it('DISLIKE COMMENT', async () => {
    //     comment = await customTestsService.likeComment(tokens.accessToken, commentId, LIKE_STATUSES.DISLIKE)
    //     console.log(comment.body.likesInfo.usersLikeStatuses, 'comment.body.likesInfo')
    //     consoleLog('DISLIKE COMMENT', 'comment', comment.body)
    // });
    // it('DISLIKE COMMENT', async () => {
    //     comment = await customTestsService.likeComment(tokens.accessToken, commentId, LIKE_STATUSES.DISLIKE)
    //
    //     console.log(comment.body.likesInfo.usersLikeStatuses, 'comment.body.likesInfo')
    //     consoleLog('DISLIKE COMMENT', 'comment', comment.body)
    // });
    // it('DISLIKE COMMENT', async () => {
    //     comment = await customTestsService.likeComment(tokens.accessToken, commentId, LIKE_STATUSES.DISLIKE)
    //     console.log(comment.body.likesInfo.usersLikeStatuses, 'comment.body.likesInfo')
    //     consoleLog('DISLIKE COMMENT', 'comment', comment.body)
    // });
//     it('LIKE COMMENT', async () => {
//         comment = await customTestsService.likeComment(tokens.accessToken, commentId,LIKE_STATUSES.LIKE)
//         console.log(comment.body.likesInfo.usersLikeStatuses, 'comment.body.likesInfo')
//         consoleLog('LIKE COMMENT', 'comment', comment.body)
//     });
//
//     it('DISLIKE COMMENT', async () => {
//         comment = await customTestsService.likeComment(tokens.accessToken, commentId,LIKE_STATUSES.DISLIKE)
//         console.log(comment.body.likesInfo.usersLikeStatuses, 'comment.body.likesInfo')
//         consoleLog('DISLIKE COMMENT', 'comment', comment.body)
//     });
//     it('NONE COMMENT', async () => {
//         comment = await customTestsService.likeComment(tokens.accessToken, commentId,LIKE_STATUSES.NONE)
//         console.log(comment.body.likesInfo, 'comment.body.likesInfo')
//         consoleLog('NONE COMMENT', 'comment', comment.body)
//     });
// //     it('LIKE COMMENT', async () => {
//         comment = await customTestsService.likeComment(tokens.accessToken, commentId,LIKE_STATUSES.NONE)
//         console.log(comment.body.likesInfo, 'comment.body.likesInfo')
//         consoleLog('LIKE COMMENT', 'comment', comment.body)
//     });
//


})

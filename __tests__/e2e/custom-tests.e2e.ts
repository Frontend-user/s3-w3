import request from "supertest";
import {app} from "../../src/app";



let correctBlogData = {
    "name": "name",
    "description": "description",
    "websiteUrl": "https://TXOxcSX82Olmsdf_1fIRxLasdGFvpHDRX8sXEHAWm.ZFTe4"
}
let correctPostData = {
    "title": "string",
    "shortDescription": "string",
    "content": "string"
}
let correctCommentData = {
    "content": "stringstringstringstssss"
}
const token = 'Basic YWRtaW46cXdlcnR5'
export const customTestsService = {

    async createUser(userData:any) {
        let response = await request(app)
            .post('/users')
            .set('Authorization', `${token}`)
            .send(userData)

        return response.body.id
    },

    async login(userData:any) {
        const response: any = await request(app)
            .post('/auth/login')
            .send(userData)
        const refreshTokenCookie = response.headers['set-cookie']
            .map((cookie: string) => cookie.split(';')[0])
            .find((cookie: string) => cookie.startsWith('refreshToken='));
       const clearRefreshToken = refreshTokenCookie ? refreshTokenCookie.split('=')[1] : null;
        return {accessToken: response.body.accessToken, refreshToken:clearRefreshToken}
    },
    async logout(refreshToken:string) {
        const response: any = await request(app)
            .post('/auth/logout')
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(204)
        return response
    },
    async createBlog(accessToken: string) {
        const response: any = await request(app)
            .post('/blogs')
            .set('authorization', 'Bearer ' + accessToken)
            .send(correctBlogData)
        return response.body.id
    },
    async createPost(accessToken:string, blogId: string) {
        const response: any = await request(app)
            .post('/posts')
            .set('authorization', 'Bearer ' + accessToken)
            .send({...correctPostData, blogId})
        return response.body.id
    },
    async createComment(accessToken:string, postId: string){
        const response: any = await request(app)
            .post(`/posts/${postId}/comments`)
            .set('authorization', 'Bearer ' + accessToken)
            .send({...correctCommentData})
        return response.body.id
    },
    async likeComment(accessToken:string, commentId: string,likeStatus:string){
        const response: any = await request(app)
            .put(`/comments/${commentId}/like-status`)
            .set('authorization', 'Bearer ' + accessToken)
            .send({"likeStatus":""})
            .expect(400, { errorsMessages: [{ message: 'String', field: "likeStatus" }] })
        return response
    },

}

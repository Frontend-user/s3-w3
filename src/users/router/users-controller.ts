import {Request, Response} from "express";
import {getQueryData} from "../../common/custom-methods/query-data";
import {HTTP_STATUSES} from "../../common/constants/http-statuses";
import {UserInputModelType, UserViewType} from "../types/user-types";
import {ObjectId} from "mongodb";
import {UsersQueryRepository} from "../query-repository/users-query-repository";
import {UsersService} from "../domain/users-service";

export class UsersController {
    constructor(
        protected usersService: UsersService,
        protected usersQueryRepository: UsersQueryRepository,
    ) {
    }

    async getUsers(req: Request, res: Response) {
        try {
            let {sortBy, sortDirection, pageNumber, pageSize} = getQueryData(req)

            let searchLoginTerm = req.query.searchLoginTerm ? String(req.query.searchLoginTerm) : undefined
            let searchEmailTerm = req.query.searchEmailTerm ? String(req.query.searchEmailTerm) : undefined

            const blogs = await this.usersQueryRepository.getUsers(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize)
            res.status(HTTP_STATUSES.OK_200).send(blogs)
        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const isReqFromSuperAdmin = true
            const user: UserInputModelType = {
                login: req.body.login,
                email: req.body.email,
                password: req.body.password,
            }
            try {
                const response: ObjectId | false = await this.usersService.createUser(user, isReqFromSuperAdmin)
                if (response) {
                    const createdBlog: UserViewType | false = await this.usersQueryRepository.getUserById(response)
                    res.status(HTTP_STATUSES.CREATED_201).send(createdBlog)
                    return
                }
            } catch (e) {
                console.log(e, 'EERRRor')
            }


        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }

    }

    async deleteUser(req: Request, res: Response) {
        try {
            const response: boolean = await this.usersService.deleteUser(new ObjectId(req.params.id))
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
}
import {blogsPaginate} from "../../blogs/blogs-query/utils/blogs-paginate";
import {UserModel} from "../../db";
import {UserEmailEntityType, UserViewType} from "../types/user-types";
import {ObjectId, SortDirection} from "mongodb";
import { TypeQuerySortBlog} from "../../blogs/blogs-query/types/query-types";
import {Pagination} from "../../common/types/pagination";

export const usersQueryRepository = {
    async getUsers(searchLoginTerm?: string, searchEmailTerm?: string, sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number): Promise<Pagination<UserViewType[]>> {
        const findQuery = this.__getUsersFindings(searchLoginTerm, searchEmailTerm)
        const sortQuery = this.__getUserSorting(sortBy, sortDirection)
        const {skip, limit, newPageNumber, newPageSize} = blogsPaginate.getPagination(pageNumber, pageSize)
        let users: UserEmailEntityType[] = await UserModel.find(findQuery).sort(sortQuery).skip(skip).limit(limit).lean()
        const allUsers = await UserModel.find(findQuery).sort(sortQuery).lean()
        let pagesCount = Math.ceil(allUsers.length / newPageSize)

        const fixArrayIds = users.map((user => this.__changeUserFormat(user)))
        return {
            "pagesCount": pagesCount,
            "page": newPageNumber,
            "pageSize": newPageSize,
            "totalCount": allUsers.length,
            "items": fixArrayIds
        }
    },
    async getUserById(userId: ObjectId): Promise<UserViewType | false> {
        console.log(new ObjectId(userId),'userId')
        const getUser = await UserModel.findOne({_id: userId}).lean()
        console.log(getUser,'GETUSER')
        return getUser ? this.__changeUserFormat(getUser) : false
    },
    async getUserByCustomField(fieldName: string, value: string): Promise<UserEmailEntityType | boolean> {
        let findQuery: any = {}
        findQuery[`${fieldName}`] = value
        const getUser = await UserModel.findOne(findQuery).lean()
        return !!getUser
    },
    async getUserDataByCustomField(fieldName: string, value: string): Promise<UserEmailEntityType | null> {
        let findQuery: any = {}
        findQuery[`${fieldName}`] = value
        const getUser = await UserModel.findOne(findQuery).lean()
        return getUser
    },


    __changeUserFormat(obj: any) {
        obj.id = obj._id.toString()
        delete obj._id
        return {id: obj.id, ...obj.accountData}
    },

    __getUsersFindings(searchLoginTerm?: string, searchEmailTerm?: string) {
        let findQuery: any = {}
        if (searchLoginTerm || searchEmailTerm) {
            findQuery = {
                $or: [
                    {"accountData.login": {$regex: String(searchLoginTerm), $options: 'i'}},
                    {"accountData.email": {$regex: String(searchEmailTerm), $options: 'i'}}
                ]
            };
        }
        return findQuery
    },
    __getUserSorting(sortBy?: string, sortDirection?: SortDirection | string) {
        let sortQuery: TypeQuerySortBlog = {"accountData.createdAt": -1}
        if (sortBy) {
            delete sortQuery['accountData.createdAt']
            sortQuery[`accountData.${sortBy}`] = sortDirection === 'asc' ? 1 : -1
        }
        if (sortDirection && !sortBy) {
            sortQuery['accountData.createdAt'] = sortDirection === 'asc' ? 1 : -1
        }
        return sortQuery
    }

}
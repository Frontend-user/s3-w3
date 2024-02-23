import {ObjectId} from "mongodb";

export type BlogEntityType = {
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type  BlogViewType = Omit<BlogEntityType, '_id'> & {
    id: string
}

export type  BlogCreateType = Omit<BlogEntityType, '_id'>

export type BlogUpdateType = Omit<BlogEntityType, '_id' | 'createdAt' | 'isMembership'>
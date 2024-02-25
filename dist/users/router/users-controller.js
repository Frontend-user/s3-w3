"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const query_data_1 = require("../../common/custom-methods/query-data");
const http_statuses_1 = require("../../common/constants/http-statuses");
const mongodb_1 = require("mongodb");
class UsersController {
    constructor(usersService, usersQueryRepository) {
        this.usersService = usersService;
        this.usersQueryRepository = usersQueryRepository;
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { sortBy, sortDirection, pageNumber, pageSize } = (0, query_data_1.getQueryData)(req);
                let searchLoginTerm = req.query.searchLoginTerm ? String(req.query.searchLoginTerm) : undefined;
                let searchEmailTerm = req.query.searchEmailTerm ? String(req.query.searchEmailTerm) : undefined;
                const blogs = yield this.usersQueryRepository.getUsers(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize);
                res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(blogs);
            }
            catch (error) {
                console.error('Ошибка при получении данных из коллекции:', error);
                res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isReqFromSuperAdmin = true;
                const user = {
                    login: req.body.login,
                    email: req.body.email,
                    password: req.body.password,
                };
                try {
                    const response = yield this.usersService.createUser(user, isReqFromSuperAdmin);
                    if (response) {
                        const createdBlog = yield this.usersQueryRepository.getUserById(response);
                        res.status(http_statuses_1.HTTP_STATUSES.CREATED_201).send(createdBlog);
                        return;
                    }
                }
                catch (e) {
                    console.log(e, 'EERRRor');
                }
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.usersService.deleteUser(new mongodb_1.ObjectId(req.params.id));
                res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
        });
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users-controller.js.map
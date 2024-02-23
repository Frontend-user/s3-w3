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
exports.blogsPostsBindingInputValidationMiddleware = exports.postBlogBindIdExistValidation = void 0;
const express_validator_1 = require("express-validator");
const composition_root_1 = require("../common/composition-root/composition-root");
exports.postBlogBindIdExistValidation = (0, express_validator_1.param)('blogId').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistBlogId = yield composition_root_1.blogsQueryRepository.getBlogById(value);
    if (isExistBlogId) {
        return true;
    }
    else {
        throw new Error('Wrong blogId');
    }
})).withMessage({
    message: 'Wrong blogId',
    field: 'blogId'
});
const blogsPostsBindingInputValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    if (errors.length) {
        let errorsForClient = [];
        for (const error of errors) {
            errorsForClient.push(error.msg);
            if (error.msg.field === 'blogId') {
                res.sendStatus(404);
                return;
            }
        }
        res.status(400).json({ errorsMessages: errorsForClient });
        return;
    }
    else {
        next();
    }
};
exports.blogsPostsBindingInputValidationMiddleware = blogsPostsBindingInputValidationMiddleware;
//# sourceMappingURL=blogs-posts-bind-validation.js.map
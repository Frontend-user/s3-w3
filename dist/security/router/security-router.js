"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityRouter = void 0;
const express_1 = require("express");
const tokenValidator_1 = require("../../auth/validation/tokenValidator");
const composition_root_1 = require("../../common/composition-root/composition-root");
exports.securityRouter = (0, express_1.Router)({});
exports.securityRouter.get('/', tokenValidator_1.refreshTokenValidator, tokenValidator_1.tokenValidationMiddleware, composition_root_1.securityDevicesController.getDevices.bind(composition_root_1.securityDevicesController));
exports.securityRouter.delete('/', tokenValidator_1.refreshTokenValidator, tokenValidator_1.tokenValidationMiddleware, composition_root_1.securityDevicesController.deleteDevices.bind(composition_root_1.securityDevicesController));
exports.securityRouter.delete('/:deviceId', tokenValidator_1.refreshTokenValidator, tokenValidator_1.tokenValidationMiddleware, composition_root_1.securityDevicesController.getDeviceById.bind(composition_root_1.securityDevicesController));
//# sourceMappingURL=security-router.js.map
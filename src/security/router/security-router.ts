import {Router} from "express";
import {refreshTokenValidator, tokenValidationMiddleware} from "../../auth/validation/tokenValidator";
import {securityDevicesController} from "../../common/composition-root/composition-root";

export const securityRouter = Router({})


securityRouter.get('/',
    refreshTokenValidator,
    tokenValidationMiddleware,
    securityDevicesController.getDevices.bind(securityDevicesController)
    )


securityRouter.delete('/',
    refreshTokenValidator,
    tokenValidationMiddleware,
    securityDevicesController.deleteDevices.bind(securityDevicesController)
)


securityRouter.delete('/:deviceId',
    refreshTokenValidator,
    tokenValidationMiddleware,
    securityDevicesController.getDeviceById.bind(securityDevicesController)
)
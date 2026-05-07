
import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { validateDeviceIdParam } from "../validation/deviceId-param-validation";


import {
  deleteDeviceSessionsController,
  getAllUserSessionsController,
  deleteOtherUserSessionsController,

  refreshTokenGuardMiddleware,
} from "../../composition-root";

export const securityDevicesRouter = Router();


securityDevicesRouter.get('/',
  refreshTokenGuardMiddleware,
  getAllUserSessionsController.handle
);

securityDevicesRouter.delete('/',
  refreshTokenGuardMiddleware,
  deleteOtherUserSessionsController.handle
);


securityDevicesRouter.delete('/:deviceId',
  refreshTokenGuardMiddleware,
  validateDeviceIdParam,
  inputValidationResultMiddleware,
  deleteDeviceSessionsController.handle
);


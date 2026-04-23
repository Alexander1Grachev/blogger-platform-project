
import { Router } from "express";
import { getAllUserSessionsHandler } from "./handler/get-all-user-sessions.handler";
import { deleteOtherUserSessionsHandler } from "./handler/delete-other-user-sessions.handler";
import { refreshTokenGuard } from "../../auth/middlewares/refresh.token.guard";
import { deleteDeviceSessionsHandler } from "./handler/delete-device-sessions.handler";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { validateDeviceIdParam } from "../validation/deviceId-param-validation";




export const securityDevicesRouter = Router();


securityDevicesRouter.get('/',
  refreshTokenGuard,
  getAllUserSessionsHandler
);

securityDevicesRouter.delete('/',
  refreshTokenGuard,
  deleteOtherUserSessionsHandler
);


securityDevicesRouter.delete('/:deviceId',
  refreshTokenGuard,
  validateDeviceIdParam,
  inputValidationResultMiddleware,
  deleteDeviceSessionsHandler
);


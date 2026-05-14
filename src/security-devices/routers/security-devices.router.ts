
import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { validateDeviceIdParam } from "../validation/deviceId-param-validation";
import { DeleteDeviceSessionsController } from "./handler/delete-device-sessions.handler";
import { GetAllUserSessionsController } from "./handler/get-all-user-sessions.handler";
import { DeleteOtherUserSessionsController } from "./handler/delete-other-user-sessions.handler";
import { refreshTokenGuardMiddleware } from "../../auth/middlewares/refresh.token.guard";
import { container } from "../../composition-root";

export const securityDevicesRouter = Router();

securityDevicesRouter.get('/',
  refreshTokenGuardMiddleware,
  container.get(GetAllUserSessionsController).handle
);

securityDevicesRouter.delete('/',
  refreshTokenGuardMiddleware,
  container.get(DeleteOtherUserSessionsController).handle
);

securityDevicesRouter.delete('/:deviceId',
  refreshTokenGuardMiddleware,
  validateDeviceIdParam,
  inputValidationResultMiddleware,
  container.get(DeleteDeviceSessionsController).handle
);


import { param } from 'express-validator';


export const validateDeviceIdParam = [
    param('deviceId')
        .exists()
        .isString()
]
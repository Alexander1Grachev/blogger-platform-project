import { Session } from "../../repositories/models/session.model";
import { DeviceViewModel } from "../output/device-view-model";


export function mapToDeviceViewModel(session: Session): DeviceViewModel {
  return {
    ip: session.ip,
    title: session.deviceName,
    lastActiveDate: session.lastActiveAt.toISOString(),
    deviceId: session.deviceId.toString(),
  }
}
import { SessionDocument } from "../../domain/session.entity";
import { DeviceViewModel } from "../output/device-view-model";


export function mapToDeviceViewModel(session: SessionDocument): DeviceViewModel {
  return {
    ip: session.ip,
    title: session.deviceName,
    lastActiveDate: session.lastActiveAt.toISOString(),
    deviceId: session.deviceId.toString(),
  }
}
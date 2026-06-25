import { UserModel } from "../../../src/users/domain/user.entity";


export async function expireConfirmationCode(code: string): Promise<void> {
    await UserModel.updateOne(
        { "emailConfirmation.confirmationCode": code },
        {
            $set: { "emailConfirmation.expirationDate": new Date(Date.now() - 1000) }
        }
    );
}

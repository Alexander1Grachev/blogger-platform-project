import { userCollection } from "../../../src/db/mongo.db";



export async function expireConfirmationCode(code: string): Promise<void> {
    await userCollection.updateOne(
        { "emailConfirmation.confirmationCode": code },
        {
            $set: { "emailConfirmation.expirationDate": new Date(Date.now() - 1000) }
        }
    );
}

import { nodemailerService } from "../../../src/auth/adapters/nodemailer.service";

export const mockEmailService = () => {
  jest.spyOn(nodemailerService, 'sendEmail')
    .mockImplementation(async (_email, _subject, html) => {
      const confirmMatch = html.match(/confirm-email\?code=([a-zA-Z0-9-]+)/);
      const recoveryMatch = html.match(/password-recovery\?recoveryCode=([a-zA-Z0-9-]+)/);

      if (confirmMatch) {
        expect.setState({ confirmationCode: confirmMatch[1] });
      }
      if (recoveryMatch) {
        expect.setState({ recoveryCode: recoveryMatch[1] });
      }
      return true;
    });
};
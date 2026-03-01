


import { nodemailerService } from "../../../src/auth/adapters/nodemailer.service";

export const mockEmailService = () => {
  jest.spyOn(nodemailerService, 'sendEmail')
    .mockImplementation(async (_email, _subject, html) => {
      const match = html.match(/code=([a-zA-Z0-9-]+)/);
      if (match) {
        const code = match[1];
        expect.setState({ code });
      }
      return true;
    });
};


/*
jest.spyOn(nodemailerService, 'sendEmail')
    .mockReturnValue(true) */
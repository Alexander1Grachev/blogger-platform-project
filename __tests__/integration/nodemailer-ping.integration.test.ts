import { nodemailerService} from '../../src/auth/adapters/nodemailer.service';

describe('Nodemailer connection', () => {
  it('✅ should connect to SMTP server', async () => {
    const isConnected = await nodemailerService.verifyConnection();
    expect(isConnected).toBe(true);
  });
});
export const emailExamples = {
  registrationEmail(code: string, login?: string): string {
    return `
    <h1>Thank you for your registration${login ? `, ${login}` : ''}!</h1>
    <p>To finish registration, please follow the link below:</p>
    <a href="https://somesite.com/confirm-email?code=${code}">Complete registration</a>
  `
  }
}
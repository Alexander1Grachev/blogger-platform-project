/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.e2e.test.ts$',
  maxWorkers: 1,  // последовательное выполнение.
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/start.stop.jest.setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  verbose: true
}
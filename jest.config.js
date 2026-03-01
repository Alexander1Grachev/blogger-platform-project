/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
testRegex: '.*\\.(e2e|integration)\\.test\\.ts$',
  maxWorkers: 1,  // последовательное выполнение.
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/start.stop.jest.setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  verbose: true,
  //setupFilesAfterEnv: ['<rootDir>/__tests__/setup/start.stop.jest.setup.ts'],// база поднимется один раз на все тесты и будет остановлена в конце.
}
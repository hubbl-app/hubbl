export default {
  displayName: 'utils',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json'
    }
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/utils',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts'],
  coverageReporters: ['text', 'html'],
  preset: '../../jest.preset.js'
};

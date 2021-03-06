export default {
  displayName: 'ui-components',

  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/next/babel'] }]
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/ui/components',
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx', '!src/**/index.ts'],
  coverageReporters: ['text', 'html'],
  preset: '../../../jest.preset.js'
};

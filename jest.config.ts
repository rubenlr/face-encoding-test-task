import { type JestConfigWithTsJest, createDefaultEsmPreset } from 'ts-jest'

const defaultPreset = createDefaultEsmPreset()

const jestConfig: JestConfigWithTsJest = {
  ...defaultPreset,
  setupFiles: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  verbose: true
}

export default jestConfig

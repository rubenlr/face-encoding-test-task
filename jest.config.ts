import { type JestConfigWithTsJest, createDefaultEsmPreset } from 'ts-jest'

const defaultPreset = createDefaultEsmPreset()

const jestConfig: JestConfigWithTsJest = {
  ...defaultPreset,  
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  verbose: true
}

export default jestConfig
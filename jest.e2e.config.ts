// const { pathsToModuleNameMapper } = require('ts-jest')
// const { compilerOptions } = require('./tsconfig.json')

import { compilerOptions, pathsToModuleNameMapper } from 'jest.config'

module.exports = {
  preset: 'ts-jest',
  rootDir: './',
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testRegex: '.*\\e2e-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [5098],
        },
        tsconfig: {
          ...compilerOptions,
          module: 'commonjs',
          moduleResolution: 'node',
        },
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!@faker-js/faker/)'],
  testEnvironment: 'node',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
}

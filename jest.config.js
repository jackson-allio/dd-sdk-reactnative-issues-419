/**
 * Jest Config based on React-Native starter
 * Potential fields we may need in the future, but seem to be fine for now:
 * @example
 * module.exports = {
 *   transform: {
 *     "^.+\\.(ts|tsx)?$": "ts-jest",
 *     "^.+\\.(js|jsx)$": "babel-jest",
 *   },
 *   collectCoverageFrom: [],
 * }
 * @see {@link https://github.com/NewBieBR/typescript-react-native-starter}
 */
module.exports = {
  preset: "react-native",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/tests/__mocks__/file.ts",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js|jsx)$",
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  transformIgnorePatterns: ["node_modules/?!(static-container)"],

  globals: {
    "ts-jest": {
      isolatedModules: true,
      babelConfig: true,
      diagnostics: false, // suppresses code coverage printout after running tests
    },
  },
  clearMocks: true,
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  collectCoverage: true,
  coverageReporters: ["lcov"],
};

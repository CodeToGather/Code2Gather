module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/prisma/', '/scripts/'],
  moduleDirectories: ['node_modules', 'src'],
};

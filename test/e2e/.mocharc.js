module.exports = {
  extension: ['js', 'ts', 'tsx'],
  recursive: true,
  slow: 500,
  timeout: (process.env.CIRCLECI === 'true' ? 6 : 4) * 1000, // Circle CI has low-performance CPUs.
  reporter: 'dot',
  require: [require.resolve('../utils/setupBabel')],
};

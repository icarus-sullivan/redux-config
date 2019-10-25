export default (runner, configuration) =>
  configuration.forEach(({ description, tests }) => {
    describe(description, () => {
      tests.forEach(({ name, params }) => {
        it(name, runner(...params));
      });
    });
  });

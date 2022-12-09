Test documentation (jest - create react app)


[jest-documentation](https://jestjs.io/docs/expect#content)
[jest-official-tuto](https://jestjs.io/docs/tutorial-react)
[react-testing-library](https://github.com/testing-library/react-testing-library)
 library for testing React components in a way that resembles the way the components are used by end users
__
**By default, when you run npm test, Jest will only run the tests related to files changed since the last commit.**

However it assumes that you don’t often commit the code that doesn’t pass the tests.
You can also press a in the watch mode to force Jest to run all tests.

Jest provides a built-in expect() global function for making assertions. A basic test could look like this:

```js

it('sums numbers', () => {
  expect(sum(1, 2)).toEqual(3);
  expect(sum(2, 2)).toEqual(4);
});
```
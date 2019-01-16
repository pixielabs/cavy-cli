# cavy-cli

[![npm version](https://badge.fury.io/js/cavy-cli.svg)](https://badge.fury.io/js/cavy-cli)

![Cavy logo](https://cloud.githubusercontent.com/assets/126989/22546798/6cf18938-e936-11e6-933f-da756b9ee7b8.png)

**cavy-cli** is a command line interface for
[Cavy](https://github.com/pixielabs/cavy), a cross-platform integration test
framework for React Native, by [Pixie Labs](https://pixielabs.io).

## What does it do?

**cavy-cli** builds, simulates, and tests your React Native app from the
command line. When the tests finish the command outputs the results and quits
with the relevant exit code (0 for success, 1 for failure) which can be used by
continuous integration scripts to determine if the test suite passed or not.

**cavy-cli is in an early stage of development**. But we are using it to test
Cavy itself! Check out [our sample app Circle CI
configuration](https://github.com/pixielabs/cavy/blob/master/.circleci/config.yml) 
for inspiration.

## Installation

To get started with **cavy-cli**, install it using `npm`:

```shell
$ npm install -g cavy-cli
```

or `yarn`:

```shell
$ yarn global add cavy-cli
```

Set the `sendReport` prop to `true` on your Cavy `<Tester>` component in your
app:

```jsx
<Tester specs={...} store={...} sendReport={true}>
...
</Tester>
```

## Basic usage

From within your React Native project, with Cavy already installed and set up

```shell
# To test on iOS
$ cavy run-ios

# To test on Android
$ cavy run-android
```

**cavy-cli** will use an `index.test.js` entry point if you have one in your
React Native project. This allows you to set up your tests to only run
when your app is built by **cavy-cli**.
 
## TODO

- Make this the default way of running Cavy; only run tests if **cavy-cli** is
  waiting for test results.
- Output to a report file so continuous integration tools can give a richer
  report of what tests passed/failed.
- Output the test results in progress, not just when they are all finished.
- Handle when Cavy never runs; time out if the app doesn't boot after a certain
  amount of time.
- Get a working example of an Android build in CI. We couldn't get an Android
  emulator running properly in Circle CI. If you have an example of
  **cavy-cli** working in CI for Android builds, please get in touch!
- Pass through arguments to react-native command.

## Contributing

Before contributing, please read the [code of conduct](CODE_OF_CONDUCT.md).

You can test your local version of cavy-cli by running `npm link` within the
`cavy-cli` folder. This will make it so `cavy` is pointing to the `cavy.js`
script in your local copy of `cavy-cli`. See
[the documentation for npm link](https://docs.npmjs.com/cli/link) for more
information.

- Check out the latest master to make sure the feature hasn't been implemented
  or the bug hasn't been fixed yet.
- Check out the issue tracker to make sure someone already hasn't requested it
  and/or contributed it.
- Fork the project.
- Start a feature/bugfix branch.
- Commit and push until you are happy with your contribution.
- Please try not to mess with the package.json, version, or history. If you
  want to have your own version, or is otherwise necessary, that is fine, but
  please isolate to its own commit so we can cherry-pick around it.

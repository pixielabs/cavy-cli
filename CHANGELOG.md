# 2.1.0

- Change Cavy's exit code when a test fails from 1 to 42. As 1, it was difficult
  to distinguish between a test failure and a build failure (which would also
  exit with code 1).

# 2.0.0

**BREAKING** If you're upgrading to cavy-cli 2.0, you will need to upgrade to
Cavy 4.0 to continue to run your tests with the following new features:

- Wait for a configurable length of time to receive a websocket connection from
  cavy and exit with an error code if no connection is made. cavy-cli won't hang
  indefinitely if your app fails to build and tests never run. Configure the
  timeout length with the new `--boot-timeout` option.

- Print test results in real-time.

# 1.5.0

- New `--xml` option, which writes out JUnit compatible test results to
  cavy_results.xml.

# 1.4.1

- Help text tweaks for options.

# 1.4.0

- New options `--skipbuild` and `--dev` for running cavy tests without first
building the app and keeping the report server alive between test runs,
respectively. Thanks to [TheAlmightyBob](https://github.com/TheAlmightyBob) for
these new features!

# 1.3.3

- Fix bug whereby a test entry file was always renamed to `index.js` rather than
the custom entry file specified with `--file` option. Thanks [TheAlmightyBob](https://github.com/TheAlmightyBob)
for spotting and fixing this!

# 1.3.2

- Fix issue with spawning React Native on Windows.

# 1.3.1

- Removed deprecated prop from `index.test.js` template
- Fixed example spec description

# 1.3.0

- New `--file` option for commands `cavy run-ios` and `cavy run-android` for
  users with non-standard app entry files.

# 1.2.0

- Added a new route to the internal web server so that Cavy can detect if
  cavy-cli is running. This is part of the work we are doing to remove the need
  for the `sendReport` prop (https://github.com/pixielabs/cavy/pull/125).

# 1.1.0

- New command `cavy init`, which adds example spec and index.test.js file to
React Native apps.

# 1.0.0

- Use an index.test.js entry file if it's available.

# 0.0.3

- README update, fix reported version number.

# 0.0.2

- Remove `--harmony`.

# 0.0.1

- Initial prototype release. With thanks to
  [@TGPSKI](https://github.com/TGPSKI) for his work on a fork of Cavy that
  tackles reporting and CI, which was inspiration for **cavy-cli**.

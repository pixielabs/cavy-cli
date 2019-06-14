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

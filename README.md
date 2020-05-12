<p align="center">
  <img src='https://cloud.githubusercontent.com/assets/126989/22546798/6cf18938-e936-11e6-933f-da756b9ee7b8.png' alt='Cavy logo' />
</p>

# cavy-cli

[![npm version](https://badge.fury.io/js/cavy-cli.svg)](https://badge.fury.io/js/cavy-cli)

**cavy-cli** is a command line interface for [Cavy](https://github.com/pixielabs/cavy),
a cross-platform integration test framework for React Native, by [Pixie Labs](https://pixielabs.io).

## 👶 Getting started

Get set up with Cavy and cavy-cli by following our
[installation guide](https://cavy.app/docs/getting-started/installing).

You might also want to [check out some articles and watch talks about Cavy](https://cavy.app/media)
to find out a bit more before you write code.

We use cavy-cli to test Cavy itself! Check out [our sample app Circle CI
configuration](https://github.com/pixielabs/cavy/blob/master/.circleci/config.yml)
for inspiration.

## 🗺️ Development roadmap
Take a look at our public [Pivotal Tracker](https://www.pivotaltracker.com/n/projects/2447582)
to see what we're currently working on, and what features we plan to add to
Cavy and cavy-cli next.

## 💯 Contributing

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

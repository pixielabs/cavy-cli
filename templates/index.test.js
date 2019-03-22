const content = `import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Tester, TestHookStore } from 'cavy';
import ExampleSpec from './specs/exampleSpec';

const testHookStore = new TestHookStore();

class AppWrapper extends Component {
  render() {
    return (
      <Tester specs={[ExampleSpec]} store={testHookStore} sendReport={true}>
        // Your app goes here
      </Tester>
    );
  }
}

AppRegistry.registerComponent('youAppName', () => AppWrapper);`;

module.exports = content;

function content(folderName) {
  return (

`import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Tester, TestHookStore } from 'cavy';
import ExampleSpec from './${folderName}/exampleSpec';

const testHookStore = new TestHookStore();

class AppWrapper extends Component {
  render() {
    return (
      <Tester specs={[ExampleSpec]} store={testHookStore}>
        // Your app goes here
      </Tester>
    );
  }
}

AppRegistry.registerComponent('yourAppName', () => AppWrapper);`

  )
}
module.exports = content;

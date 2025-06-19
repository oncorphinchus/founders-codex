import { AppRegistry } from 'react-native';
import App from './app/App';

// CONTEXT: This is the critical bootstrap pattern for React Native Web
// AppRegistry.registerComponent registers the app component
// AppRegistry.runApplication mounts it to the DOM and injects all React Native styles
AppRegistry.registerComponent('Mobile', () => App);

// This call is essential - it converts all StyleSheet.create styles to CSS
// and injects them into the document head, enabling proper styling
AppRegistry.runApplication('Mobile', {
  rootTag: document.getElementById('root'),
});

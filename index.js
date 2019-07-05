
import { AppRegistry } from 'react-native';
import App from './App';
import {name as appName} from './app.json';
/* Ignore yellow warnings */
console.disableYellowBox = true
AppRegistry.registerComponent(appName, () => App);

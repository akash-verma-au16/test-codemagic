
import { AppRegistry } from 'react-native';
import App from './App';
import {name as appName} from './app.json';
/* Ignore yellow warnings */
console.disableYellowBox = true

/* Debug api calls */
//  XMLHttpRequest = GLOBAL.originalXMLHttpRequest ? 
//  GLOBAL.originalXMLHttpRequest : GLOBAL.XMLHttpRequest;
  
AppRegistry.registerComponent(appName, () => App);

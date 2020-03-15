import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {leanCloudId,leanCloudKey} from './data-service/leancloud.config';
var AV = require('leancloud-storage');
AV.init({
  appId: leanCloudId,
  appKey: leanCloudKey,
  serverURLs: "http://localhost:3000"
});

console.log('av is',AV)

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

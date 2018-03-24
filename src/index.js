import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom';
import {createState, Provider} from './RxState'
import reducer$ from "./reducers";

const mountNode = document.getElementById('root');
ReactDOM.render(
  <Provider state$={createState(reducer$)}>
    <BrowserRouter basename="/mining">
      <App />
    </BrowserRouter>
  </Provider>,
  mountNode
);
registerServiceWorker();

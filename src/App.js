import React from 'react';
import './App.css';
import {Helmet} from "react-helmet";
import {Redirect, Route, Switch} from "react-router-dom";
import Loadable from 'react-loadable';

const Loading = () => <div>Loading...</div>;

const KeywordMiningPage = Loadable({
  loader: () => import('./KeywordMiningPage'),
  loading: Loading
});

export default function App() {
  return (
    <div className="App">
      <Helmet titleTemplate="%s - SG卖家成长" defaultTitle="关键词工具">
        <meta charSet="utf-8" />
        <meta name="description" content="SG卖家成长 Amazon亚马逊关键词挖掘工具" />
      </Helmet>
      <Switch>
        <Redirect exact from="/" to="/keyword" />
        <Route path="/keyword" component={KeywordMiningPage} />
      </Switch>
    </div>
  );
}

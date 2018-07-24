import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Document } from './screens';


export default class App extends Component {
  render() {
    return (<div>
      <MuiThemeProvider>
        <Document />
      </MuiThemeProvider>
    </div>);
  }
}

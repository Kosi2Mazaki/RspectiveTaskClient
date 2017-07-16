import React, { Component } from 'react'
import logo from './panda.svg'
import './App.css'
import Home from './Components/Home'
import AppAlert from './Components/AppAlert'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Panel, Navbar, Nav, NavItem } from 'react-bootstrap'
import store from './Reducers/appReducer'
import User from './Components/User'
import * as userActions from './Actions/userActions'
import Navigator from './Components/Navigator'

userActions.checkLocalStorage(store)

class App extends Component {
  render() {
    return (
      <Provider store={store} >
        <div>
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <img src={logo} className="icon-animation" alt="logo" />RspectiveTaskValidator
              </Navbar.Brand>
            </Navbar.Header>
            <Nav>
              <NavItem eventKey={1} href="/">Home</NavItem>
              <NavItem eventKey={2} href="/user">User</NavItem>
            </Nav>
          </Navbar>
          <Router>
            <Panel footer="Icon made by Freepik from www.flaticon.com ">
              <AppAlert />
              <Route path="/user" component={User} />
              <Navigator exact path="/" component={Home} />
            </Panel>
          </Router>
        </div>
      </Provider>
    );
  }
}

export default App;

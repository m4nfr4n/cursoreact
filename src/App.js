import React from 'react';
import './App.css';
import logo from './logo.png';
import { Home } from './home';
import { Contador } from './contador'
import FotoMuro from './muro';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

class Cabecera extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.toggle = () => this.setState(prev => ({ isOpen: !prev.isOpen }));
  }
  render() {
    return <Navbar color="light" light expand="md">
      <NavbarBrand href="/"><img src={logo} alt="logo" /></NavbarBrand>
      <NavbarToggler aria-controls="basic-navbar-nav" onClick={this.toggle} />
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav className="ml-auto" navbar>
          {this.props.menu.map((item, index) =>
            <NavItem key={index}>
              <NavLink className="nav-link" onClick={e=> this.props.onSeleccionar(index)}>{item.texto}</NavLink>
            </NavItem>
          )}
        </Nav>
      </Collapse>
    </Navbar>;
  }
}

/* Nombre conflictivo
function Header(props) {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      {props.menu.map((item, index) => <input key={index} type="button" className="btn btn-link" value={item.texto} onClick={ev => props.onSeleccionar(index)} />)}
    </header>
  );
}
*/

class App extends React.Component {
  constructor(props) {
    super(props);
    this.menu = [
      { texto: 'Muro', componente: <FotoMuro /> },
      { texto: 'Home', componente: <Home /> },
      { texto: 'Contador', componente: <Contador init={10} /> },
    ];
    this.state = { componente: this.menu[0].componente };
    this.seleccionar = indice => {
      this.setState({ componente: this.menu[indice].componente })
    };
  }
  render() {
    return (
      <div>
        <Cabecera menu={this.menu} onSeleccionar={this.seleccionar} />
        <main className="container-fluid">
          {this.state.componente}
        </main>
      </div>
    );
  }
}

export default App;

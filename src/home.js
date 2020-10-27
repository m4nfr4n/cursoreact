import React from 'react';
import './App.css';

import { Contador } from './contador'

function Saluda(props) {
    return (
        <React.Fragment>
            <h1>Hola {props.name && props.name.toUpperCase()}</h1>
            {props.children}
        </React.Fragment>
    );
}
class Despide extends React.Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }
    render() {
        return <h1>Adios {this.props.name}</h1>;
    }
}


function Confirmar(props) {
    return (
        <p>
            <button onClick={props.onOK} >Si</button>&nbsp;
            <button onClick={props.onCancel} >No</button>
        </p>
    );
}

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error) {  // Actualiza el estado para que el siguiente renderizado lo muestre
        return { hasError: true };
    }
    componentDidCatch(error, info) {  // También puedes registrar el error en un servicio de reporte de errores
        this.setState({ hasError: true, error: error, errorInfo: info })
    }
    render() {
        if (this.state.hasError) { // Puedes renderizar cualquier interfaz de repuesto
            return <div>
                <h1>ERROR</h1>
                {this.state.error && <p>{this.state.error.toString()}</p>}
                {this.state.errorInfo && <p>{this.state.errorInfo.componentStack}</p>}
            </div>;
        }
        return this.props.children;
    }
}

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.cont = 5;
        this.state = { cont: 7, valor: 7, boton: '', ver: true };
    }
    render() {
        let nombre = '<b>mundo</b>';
        //const numbers = [1, 2, 3, 4, 5];
        const listItems = [{ nombre: 'Don Pepito', texto: '¿Paso usted por mi casa?' }, { nombre: 'Don Jose', texto: 'Por su casa yo pase' }];

        return (
            <div className="App">
                <ErrorBoundary>
                    {this.state.ver &&
                        <Contador init={this.state.cont} onCambia={valor => this.setState({ valor })} onClick={valor => this.setState({ boton: valor })} />
                    }
                    <p><button onClick={(ev) => this.setState(prev => ({ cont: prev.cont + 1 }))} >Cambia</button>
                        <button onClick={(ev) => this.setState(prev => ({ ver: !prev.ver }))} >Ver</button>
                    Valor actual es {this.state.valor} {this.state.boton}
                    </p>
                </ErrorBoundary>
                <Confirmar onOK={(ev) => alert('Dice que OK')} onCancel={(ev) => alert('Cancela')} />
                <p>Hola <span dangerouslySetInnerHTML={{ __html: nombre }} /></p>
                <Saluda />
                {listItems.map((item, index) =>
                    <Saluda key={index} name={item.nombre}>
                        <h2>Dice:</h2>
                        <p>{item.texto}</p>
                    </Saluda>)}
                {listItems.map((item, index) => <Despide key={index} name={item.nombre} />)}
            </div>

        );
    }
}
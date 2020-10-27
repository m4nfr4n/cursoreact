import React, { Component } from 'react'
import loading from './loading.gif';

export class ValidationMessage extends Component {
    render() {
        if (this.props.msg) {
            return <span className="errorMsg">{this.props.msg}</span>;
        }
        return null;
    }
}
export class Esperando extends React.Component {
    render() {
        return <div>
        <div className="ajax-wait"></div>
        <img src={loading} alt="Cargando ..." />
      </div>;
    }
}

export function PageNotFound(props) {
    return <h1>404 Page not found!</h1>;
}
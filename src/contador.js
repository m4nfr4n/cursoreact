import React from 'react';
import PropTypes from 'prop-types';

export class Contador extends React.Component {
    constructor(props) {
        super(props);
        this.state = { contador: +this.props.init };

        this.sube = this.sube.bind(this);

        this.baja = (ev) => {
            this.cambia(-this.props.delta, ev);
            ev.preventDefault();
        }
        this.traza('constructor', props);
        this.btnBaja = React.createRef();
    }

    cambia(delta, ev) {
        let e = ev.target;
        this.setState((prev) => {
            const contador = prev.contador + delta;
            if (this.props.min > contador || contador > this.props.max) return {};
            // if(contador < 0) throw new Error('es una demo de Error interno')
            if (this.props.onCambia)
                this.props.onCambia(contador);
            if (this.props.onClick)
                this.props.onClick(e.textContent);
            return { contador };
        });
    }

    sube(ev) {
        this.cambia(+this.props.delta, ev);
        ev.preventDefault();
    }

    traza(metodo, props, state) {
        // console.info(`--- CONTADOR --> ${metodo}`, props, state);        
    }

    // componentWillMount() {
    //     this.traza('componentWillMount');
    // }

    // componentWillReceiveProps(next_props) {
    //     this.traza('componentWillReceiveProps', next_props);
    // }

    shouldComponentUpdate(next_props, next_state) {
        this.traza('shouldComponentUpdate', next_props, next_state);
        return true;
    }

    // componentWillUpdate(next_props, next_state) {
    //     this.traza('componentWillUpdate', next_props, next_state);
    // }

    render() {
        return (
            <div>
                <h1>{this.state.contador}</h1>
                <p>
                    <button onClick={this.sube} >Sube</button>&nbsp;
                    <button ref={this.btnBaja} onClick={this.baja} >Baja</button>
                </p>
            </div>
        );
    }

    componentDidMount() {
        this.traza('componentDidMount');
        this.btnBaja.current.focus();
    }

    componentDidUpdate(next_props, next_state) {
        this.traza('componentDidUpdate', next_props, next_state);
        this.btnBaja.current.focus();
    }

    componentWillUnmount() {
        this.traza('componentWillUnmount');
    }
}
Contador.propTypes = {
    init: PropTypes.number.isRequired,
    delta: PropTypes.any,
    min: PropTypes.number,
    max: PropTypes.number,
    onCambia: PropTypes.func
};
Contador.defaultProps = {
    delta: 1,
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER
};


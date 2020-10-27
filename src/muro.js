import React, { Component } from "react";
import { Contador } from "./contador";
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Esperando } from './comunes';

class FotoCard extends Component {
  render() {
    return (
      <div
        className="card"
        style={{ width: this.props.dim + "px" }} >
        <img
          src={this.props.foto}
          className="card-img-top rounded"
          style={{ cursor: "pointer" }}
          alt={this.props.titulo}
          title={this.props.titulo}
          onClick={ev => { ev.preventDefault(); if (this.props.onSelecciona) this.props.onSelecciona(); return false; }}
        />
        {this.props.dim >= 96 && (
          <div className="card-body">
            <h5 className="card-title">{this.props.titulo}</h5>
            {this.props.dim >= 256 && (
              <p className="card-text">{this.props.children}</p>
            )}
          </div>
        )}
      </div>
    );
  }
}
class FotoButton extends Component {
  render() {
    return (
      <React.Fragment>
        { this.props.onSelecciona &&
          <button
            style={this.props.tamaño}
            onClick={ev => { ev.preventDefault(); this.props.onSelecciona(); return false; }} >
            {this.props.children}
          </button>
        }
      </React.Fragment>);
  }
}
export default class FotoMuro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listado: null, elemento: {
        "id": "",
        "author": "",
        "width": "",
        "height": "",
        "url": "",
        "download_url": ""
      }, dim: 128, pagina: 0, cargando: true
    };
  }
  cambia(f, c) {
    this.setState(prev => {
      prev.listado[f][c].visible = true;
      return { listado: prev.listado };
    });
  }
  anula(f, c) {
    this.setState(prev => {
      prev.listado[f][c].visible = false;
      return { listado: prev.listado };
    });
  }
  componentDidMount() {
    this.cargaRemota();
  }

  cargaRemota(page = 0) {
    const lst = [];
    let nextColumna = 11;
    this.setState({ listado: null, pagina: page, cargando: true });

    fetch(`https://picsum.photos/v2/list?page=${page}&limit=100`)
      .then(response => {
        if (response.ok)
          response.json().then(data => {
            for (let item of data) {
              item.visible = false;
              if (nextColumna >= 10) {
                lst[lst.length] = [];
                nextColumna = 0;
              }
              lst[lst.length - 1][nextColumna++] = item;
            }
            this.setState({ listado: lst, cargando: false });
          });
      });
  }
  cargaUno(id) {
    this.setState({ cargando: true });
    fetch(`https://picsum.photos/id/${id}/info`)
      .then(response => {
        if (response.ok)
          response.json().then(data => {
            this.setState({ elemento: data, cargando: false });
          });
      });
  }

  render() {
    // if(this.state.listado[0][0]) throw new Error("Forzado");
    if (!this.state.listado)
      return <Esperando />
    const tamaño = {
      height: this.state.dim,
      width: this.state.dim,
      fontSize: this.state.dim / 128 + "em"
    };
    const rslt = this.state.listado.map((fila, index) => {
      return (
        <div className="row" key={"F" + index.toString()}>
          {fila.map((celda, subindex) => (
            <div
              className="col"
              key={celda.id} >
              {celda.visible ? (
                <FotoCard
                  foto={`https://picsum.photos/id/${celda.id}/512/512`}
                  titulo={`${celda.id} - ${celda.author}`}
                  dim={this.state.dim}
                  onSelecciona={this.anula.bind(this, index, subindex)} >
                  Tamaño: {celda.height} x {celda.width}<br />
                    Descarga: <a href={celda.download_url} target="_blank" rel="noopener noreferrer">{celda.download_url}</a>
                  <button className="btn btn-link" onClick={ev => this.cargaUno(celda.id)} >Editar</button>
                </FotoCard>
              ) : (
                  <FotoButton tamaño={tamaño}
                    onSelecciona={this.cambia.bind(this, index, subindex)} >
                    {`${celda.id} - ${celda.author}`}
                  </FotoButton>
                )}
            </div>
          ))}
        </div>
      );
    });
    return (
      <div style={{ overflow: 'hidden' }}>
        <Contador init={this.state.dim} delta={32} min={32} max={512} onCambia={rslt => this.setState({ dim: rslt })} />
        <Pagination aria-label="Page navigation">
          <PaginationItem>
            <PaginationLink first onClick={ev => this.cargaRemota(0)} />
          </PaginationItem>
          {(new Array(...'01234567890')).map((item, index) =>
            <PaginationItem key={index} active={this.state.pagina === index} >
              <PaginationLink onClick={ev => this.cargaRemota(index)}>{index + 1}</PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink last onClick={ev => this.cargaRemota(10)} />
          </PaginationItem>
        </Pagination>
        <FotoForm elemento={this.state.elemento} />
        <div className="container-fluid">{rslt}</div>
      </div>
    );
  }

}
/*
export default class FotoMuro extends Component {
  constructor(props) {
    super(props);
    const max = 10;
    // const t = (new Array(max)).fill(null, 0, max);
    // for (let i = 0; i < t.length; i++) {
    //   t[i] = new Array(max).fill(null, 0, max);
    // }
    this.state = { listado: (new Array(max)).fill(null, 0, max).map(() => new Array(max).fill(null, 0, max)), dim: 128 };
  }
  cambia(f, c) {
    this.setState(prev => {
      let alea = Math.floor(Math.random() * 1000);
      prev.listado[f][c] = `https://picsum.photos/id/${alea}/512/512`;
      return { listado: prev.listado };
    });
  }
  anula(f, c) {
    this.setState(prev => {
      prev.listado[f][c] = null;
      return { listado: prev.listado };
    });
  }
  componentDidMount() {
    this.intervalo = setInterval(() => {
      const f = Math.floor(Math.random() * this.state.listado.length);
      const c = Math.floor(Math.random() * this.state.listado[0].length);
      if (!this.state.listado[f][c]) this.cambia(f, c);
      // console.log('-------------> Pidiendo imagen');
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalo);
  }

  render() {
    // if(this.state.listado[0][0]) throw new Error("Forzado");

    const tamaño = {
      height: this.state.dim,
      width: this.state.dim,
      fontSize: this.state.dim / 64 + "em"
    };
    const rslt = this.state.listado.map((fila, index) => {
      return (
        <div className="row" key={"F" + index.toString()}>
          {fila.map((celda, subindex) => (
            <div
              className="col"
              key={"F" + index.toString() + "C" + subindex.toString()} >
              {celda ? (
                <FotoCard
                  foto={celda}
                  titulo={index + 1 + "-" + (subindex + 1)}
                  dim={this.state.dim}
                  onSelecciona={this.anula.bind(this, index, subindex)} >
                  Descargado de {celda}
                </FotoCard>
              ) : (
                  <FotoButton tamaño={tamaño}
                    onSelecciona={this.cambia.bind(this, index, subindex)} >
                    {index + 1 + "-" + (subindex + 1)}
                  </FotoButton>
                )}
            </div>
          ))}
        </div>
      );
    });
    return (
      <div>
        <Contador init={this.state.dim} delta={32} min={32} max={512} onCambia={rslt => this.setState({ dim: rslt })} />
        <div className="container-fluid">{rslt}</div>
      </div>
    );
  }

}
*/
class FotoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elemento: props.elemento, msgErr: {}, invalid: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.enviar = this.enviar.bind(this);
    this.form = React.createRef();
    this.debeValidar = false;
  }

  shouldComponentUpdate(next_props, next_state) {
    if (this.props.elemento.id != next_props.elemento.id) {
      next_state.elemento = next_props.elemento;
    }
    return true;
  }

  checkCustomValidity(campo, valor) {
    if (valor !== '' && valor !== null && typeof (valor) !== "undefined")
      // eslint-disable-next-line default-case
      switch (campo) {
        case 'author':
          if (valor !== valor.toUpperCase())
            return 'Tiene que estar en mayusculas';
          break;
        case 'width':
          if (+valor < +this.state.elemento.height)
            return 'Debe ser mayor que el alto';
          break;
        case 'height':
          if (+valor > +this.state.elemento.width)
            return 'Debe ser menor que el ancho';
          break;
      }
    return '';
  }
  handleChange(event) {
    const cmp = event.target.name;
    const value = event.target.value;
    this.setState(prev => {
      prev.elemento[cmp] = value;
      return { elemento: prev.elemento };
    });
  }
  getValidateInfo() {
    let msgErr = {};
    let invalid = false;
    for (let indice = 0; indice < this.form.current.length; indice++)
      if (this.form.current[indice].name) {
        const cntrl = this.form.current[indice];
        cntrl.setCustomValidity(this.checkCustomValidity(cntrl.name, cntrl.value));
        msgErr[cntrl.name] = cntrl.validationMessage;
        invalid = invalid || !cntrl.checkValidity();
      }
    return { msgErr, invalid };
  }
  componentDidMount() {
    this.setState({ ...this.getValidateInfo() })
  }
  componentDidUpdate() {
    if (this.debeValidar) {
      this.debeValidar = false;
      this.setState({ ...this.getValidateInfo() })
    } else
      this.debeValidar = true;
  }

  enviar(ev) {
    alert("Enviando " + JSON.stringify(this.state.elemento));
    ev.preventDefault();
  }
  render() {
    return (
      <form className="was-validated" ref={this.form} onSubmit={this.enviar}>
        <div className="form-group">
          <label htmlFor="id">Código</label>
          <input type="number" className="form-control" id="id" name="id"
            value={this.state.elemento.id} onChange={this.handleChange} required min={10} />
          <div className="invalid-feedback">{this.state.msgErr.id}</div>
        </div>
        <div className="form-group">
          <label htmlFor="author">Autor</label>
          <input type="text" className="form-control" id="author" name="author"
            value={this.state.elemento.author} onChange={this.handleChange} required minLength="2" maxLength="10" />
          <div className="invalid-feedback">{this.state.msgErr.author}</div>
        </div>
        <div className="form-group">
          <label htmlFor="width">Ancho</label>
          <input type="number" className="form-control" id="width" name="width"
            value={this.state.elemento.width} onChange={this.handleChange} />
          <div className="invalid-feedback">{this.state.msgErr.width}</div>
        </div>
        <div className="form-group">
          <label htmlFor="height">Alto</label>
          <input type="number" className="form-control" id="height" name="height"
            value={this.state.elemento.height} onChange={this.handleChange} />
          <div className="invalid-feedback">{this.state.msgErr.height}</div>
        </div>
        <div className="form-group">
          <label htmlFor="url">Página</label>
          <input type="url" className="form-control" id="url" name="url"
            value={this.state.elemento.url} onChange={this.handleChange} />
          <div className="invalid-feedback">{this.state.msgErr.url}</div>
        </div>
        <div className="form-group">
          <label htmlFor="download_url">Foto</label>
          <input type="url" className="form-control" id="download_url" name="download_url"
            value={this.state.elemento.download_url} onChange={this.handleChange} />
          <div className="invalid-feedback">{this.state.msgErr.download_url}</div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={this.state.invalid} >Submit</button>
        <button type="button" className="btn btn-primary" disabled={this.state.invalid} onClick={this.enviar}>Enviar</button>
      </form>
    );
  }
}

// export default class FotoMuro extends Component {
//   constructor(props) {
//     super(props);
//     const t = (new Array(10)).fill(null, 0, 10);
//     this.state = { listado: t }
//     this.cambia = indice => {
//       //const indice = +ev.target.value;
//       if(this.state.listado[indice])
//         this.setState((prev)=> {
//           prev.listado[indice] = null;
//           return { listado: prev.listado};
//         });
//       else
//         this.setState((prev)=> {
//           prev.listado[indice] = `https://picsum.photos/200/300?${Math.random()}`;
//           return { listado: prev.listado};
//         });
//     };
//   }

//   render() {
//     return (
//       <div>
//         {this.state.listado.map((item, index) => item ? (
//           <img key={index} src={item} onClick={this.cambia.bind(this, index)} />
//         ) : (
//           <input type="button" value={index} onClick={this.cambia.bind(this, index)} />
//         ))}
//       </div>
//     );
//   }
// }
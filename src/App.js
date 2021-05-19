import React, { useState, useEffect } from "react";
import Buscador from "./components/Buscador";
import ListaImagenes from "./components/ListaImagenes";

function App() {
  /* states */

  const [busqueda, guardarBusqueda] = useState("");
  const [imagenes, guardarImagenes] = useState([]);
  const [paginaActual, guardarPaginaActual] = useState(1);
  const [totalPaginas, guardarTotalPaginas] = useState(1);

  /* eventos */

  useEffect(() => {
    if (busqueda === "") return;

    const consultarApi = async () => {
      const imagenesPorPagina = 30;
      const key = "11884612-e006e868296b0da794101dfb2";
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaActual}`;

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      guardarImagenes(resultado.hits);

      /* calcular el total de paginas */

      const calcularTotalPaginas = Math.ceil(
        resultado.totalHits / imagenesPorPagina
      );
      guardarTotalPaginas(calcularTotalPaginas);

      /*  Mover la pantalla hacia la parte superior */

      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({behavior :"smooth", block: 'end'});
    };

    consultarApi();
  }, [busqueda, paginaActual]);

  /* Evento de Paginado */

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      let nuevaPagina = paginaActual - 1;

      //Colocarlo en el state

      guardarPaginaActual(nuevaPagina);
    }
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      let nuevaPagina = paginaActual + 1;

      /* Colocarlo en el state */

      guardarPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="app container">
      <div className="jumbotron">
        <p className="lead text-center">Buscador de imagenes</p>

        <Buscador guardarBusqueda={guardarBusqueda} />
      </div>

      <div className="row justify-content-center">
        <ListaImagenes imagenes={imagenes} />

        {/* quitamps el boton si no hay paginas anterior */}
        {paginaActual === 1 ? null : (
          <button
            onClick={paginaAnterior}
            type="button"
            className="btn btn-info mr-2"
          >
            Anterior &laquo;
          </button>
        )}

        {/* quitamos el boton si no hay mas pagians que mostrar */}
        {paginaActual === totalPaginas ? null : (
          <button
            onClick={paginaSiguiente}
            type="button"
            className="btn btn-info "
          >
            Siguiente &raquo;
          </button>
        )}
      </div>
    </div>
  );
}

export default App;

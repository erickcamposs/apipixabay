//Selectores
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacion = document.querySelector('#paginacion');

const cantidadImagenes = 30;
let paginaActual = 1;

let noPaginas;
let iterador;

//Cargar Documento
window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

//Funciones
function validarFormulario(e){
    e.preventDefault();
    const termino = document.querySelector('#termino').value;

    if(termino === ''){
        imprimirAlerta('Introduce un término de búsqueda');
        return;
    }

    busquedaImagen();
}

function busquedaImagen(){
    const termino = document.querySelector('#termino').value;

    const key = '18044162-7c315b70ceaf52a04d1fd1e11';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&image_type=photo&per_page=${cantidadImagenes}&page=${paginaActual}`

    fetch(url)
        .then(resolve => resolve.json())
        .then(respuesta => {
            noPaginas = calcularPaginas(respuesta.totalHits);
            mostrarImagenes(respuesta.hits);
        });
}
function mostrarImagenes(imagenes){
    limpiarHTML(resultado);
    imagenes.forEach(imagen => {
        const { downloads, largeImageURL, likes, previewURL, views } = imagen;
        resultado.innerHTML += `
            <div class = "w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class = "bg-white">
                    <img class="w-full" src=${previewURL}>
                    <div class="p-4">
                        <p class="font-bold flex"> ${likes} <span class="font-light">Me Gusta</span></p>
                        <p class="font-bold"> ${views} <span class="font-light">Veces Vista</span> </p>
                        <p class="font-bold"> ${downloads} <span class="font-light">Descargas</span> </p>
                        <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 pd-1" href = "${largeImageURL}" target="_blank" rel="noopener noreferrer"> Ver Imagen
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    limpiarHTML(paginacion);
    imprimirPaginacion();
}
// Calcular las páginas que debe tener
function calcularPaginas(total){
    return parseInt(Math.ceil(total / cantidadImagenes));
}
//Generador para crear la paginación
function *crearTotalPaginas(total){
    for(let i = 1; i <= total; i++){
        yield i;
    }
}
function imprimirPaginacion(){
    iterador = crearTotalPaginas(noPaginas);
    while(true){
        const {value, done} = iterador.next();
        if(done){
            return;
        } 
        const boton = document.createElement('A');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');
        boton.onclick = () => {
            console.log(paginaActual);
            paginaActual = value;
            console.log(paginaActual);
            busquedaImagen();
        }
        paginacion.appendChild(boton);

    }
}


//Funciones Complementarias
function imprimirAlerta(mensaje){
    const div = document.createElement('P');
    const alerta = document.querySelector('.alerta');
    if(!alerta){
        div.textContent = mensaje;
        div.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'alerta');
        formulario.appendChild(div);

        setTimeout(() => {
            div.remove();
        }, 2500);
    }
}

function limpiarHTML(div){
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
}
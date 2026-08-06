let page = 1;

const btnSiguiente = document.getElementById('btnSiguiente');
const btnAnterior = document.getElementById('btnAnterior');

btnSiguiente.addEventListener('click', () => {
    page += 1;
    init()
})

btnAnterior.addEventListener('click', () => {
    if (page > 1) {
        page -= 1;
        init()
        
    }
})

// Funncion para extraer la lista de pokemones
const listaPokemones = async() => {
    const limite = 20;
    let offset = (page - 1) * limite;

    try {
        // Traer informacion de la API con GET
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${offset}`)
        
        // Imprime el estado de la respuesta, 200 si todo esta bien
        console.log(respuesta.status)
    
        // Condicion si el estado de la respuesta es 200 procesa la informacion a JSON
        if (respuesta.status === 200) {
            const datosRecibidos = await respuesta.json();

            // Imprime los datos extraidos de la API
            console.log(datosRecibidos)
            const pokeList = datosRecibidos.results;
            return pokeList
    }
        
    } catch (error) {
        
        console.log(`error: ${error}`)
        
    }
}

// obtener detalles individuales de los pokemones
async function obtenerPokemonIndividual(url) {
    const respuesta = await fetch(url);
    return await respuesta.json();
}

// Unificar la informacion e inseertarla en el HTML
async function procesarPokedex(pokeList) {
    const listaDetallada = await Promise.all(
        pokeList.map(pokemon => obtenerPokemonIndividual(pokemon.url))
    );

    let pokeCard = ``;
    listaDetallada.forEach(pokemon => {
        const imgUrl = pokemon.sprites.front_default;

        pokeCard += `

            <div class="pokeTarjeta">
                <img src="${imgUrl}">

                <h3>${pokemon.name}</h3>
            </div>

        `

    });

    document.getElementById('pokeTargets').innerHTML = pokeCard
}

// Extraer los tipos a traves del endpoint de tipos
async function cargarTipos() {
    const respuesta = await fetch('https://pokeapi.co/api/v2/type')
    const datos = await respuesta.json();

    // Elemento html select
    const select = document.getElementById('selectTipo');

    datos.results.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.name;
        option.textContent = tipo.name;
        select.appendChild(option);
    });
}

// Extraer los pokemon de un tipo especifico
async function listaPokemonesPorTipo(tipo) {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`)
    const datos = await respuesta.json();
    return datos.pokemon.map(item => item.pokemon)
}

// Evento de cambiar filtro
const selectTipo = document.getElementById('selectTipo');

selectTipo.addEventListener('change', async (e) =>{ // e acronimo de event
    const tipoSeleccionado = e.target.value; // target se refiere al elemento que activo el evento y value a su valor.
    // reinicio la paginacion
    page = 1;

    if (tipoSeleccionado === "Todos") {
        init() // lista norma de pokemones con paginacion
    } else { // si no es 'Todos' lista de tipos sin paginacion
        const listaFiltrada = await listaPokemonesPorTipo(tipoSeleccionado);

        procesarPokedex(listaFiltrada)
    }
})


// Funcion para iniciar todo
async function init() {
    const pokeList = await listaPokemones();

    if (pokeList) {
        procesarPokedex(pokeList);
    }
}

cargarTipos();
init()
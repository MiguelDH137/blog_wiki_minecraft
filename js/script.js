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




// Funcion para iniciar todo
async function init() {
    const pokeList = await listaPokemones();

    if (pokeList) {
        procesarPokedex(pokeList);
    }
}

init()
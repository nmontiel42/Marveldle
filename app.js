const publicKey = '84bccab964f6976f3a48290cacb4adeb';  // Inserta tu clave pública aquí
const privateKey = '5715582f9eada89ea632ef74803e8dfaaa19375e';  // Inserta tu clave privada aquí
const charactersContainer = document.getElementById('characters');
const searchInput = document.getElementById('search');

// Genera el hash de la API usando la clave privada y pública
const ts = new Date().getTime();
const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString(CryptoJS.enc.Hex);

async function fetchMarvelCharacters(searchQuery = '') {
    if (!searchQuery) {
        // Si searchQuery está vacío, no hacer la solicitud
        charactersContainer.innerHTML = '<p>Por favor, ingresa un nombre para buscar.</p>';
        return;
    }

    const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${searchQuery}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.code === 200) {
            displayCharacters(data.data.results);
        } else {
            console.error("Error en la respuesta de la API:", data);
            charactersContainer.innerHTML = '<p>No se pudieron cargar los héroes o villanos.</p>';
        }
    } catch (error) {
        console.error("Error fetching characters:", error);
        charactersContainer.innerHTML = '<p>Hubo un error al obtener los personajes.</p>';
    }
}

function displayCharacters(characters) {
    charactersContainer.innerHTML = '';
    if (characters.length === 0) {
        charactersContainer.innerHTML = '<p>No se encontraron héroes o villanos</p>';
    } else {
        characters.forEach(character => {
            const characterElement = document.createElement('div');
            characterElement.classList.add('character');
            characterElement.innerHTML = `
                <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
                <h3>${character.name}</h3>
            `;
            charactersContainer.appendChild(characterElement);
        });
    }
}

// Llama a la API al cargar la página (con búsqueda vacía o predeterminada)
fetchMarvelCharacters();

// Filtra los resultados cuando el usuario escribe
searchInput.addEventListener('input', (e) => {
    const searchValue = e.target.value.trim(); // Elimina espacios innecesarios
    fetchMarvelCharacters(searchValue);
});

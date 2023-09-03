const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const pokemonModal = document.getElementById("pokemonModal");
const closeModalButton = document.getElementById("closeModalButton");
const modalContent = document.getElementById("modalContent");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
	return `
        <li class="pokemon ${pokemon.type}" data-pokemon-id="${pokemon.number}">
            <div class="pokemon__header">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
            </div>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
											.map((type) => `<li class="type ${type}">${type}</li>`)
											.join("")}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
	pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
		const newHtml = pokemons.map(convertPokemonToLi).join("");
		pokemonList.innerHTML += newHtml;

		const pokemonCards = document.querySelectorAll(".pokemon");
		pokemonCards.forEach((pokemonCard) => {
			pokemonCard.addEventListener("click", () => {
				const pokemonId = pokemonCard.getAttribute("data-pokemon-id");
				showPokemonInfo(pokemonId);
			});
		});
	});
}

async function showPokemonInfo(pokemonId) {
	try {
		const pokemonDetails = await pokeApi.getPokemonModalDetail(pokemonId);

		const progressBars = pokemonDetails.stats
			.map(
				(stat) => `
        <div class="progress-container">
          <p>${stat.stat.name}: ${stat.base_stat}</p>
          <div class="progress-bar" style="width: ${stat.base_stat}%;"></div>
        </div>
      `
			)
			.join("");

		modalContent.innerHTML = `
        <div class="modal__header">
          <span class="number">#${pokemonDetails.number}</span>
          <span class="name">${pokemonDetails.name}</span>
        </div>
  
        <div class="div__img">
          <img src="${pokemonDetails.photo}" alt="${pokemonDetails.name}">
        </div>
  
        <div>
          <ol class="types">
            ${pokemonDetails.types
							.map((type) => `<li class="type ${type}">${type}</li>`)
							.join("")}
          </ol>
        </div>
  
        <div class="div__abilities">
          <p>Peso: <span>${pokemonDetails.weight} kg</span></p>
          <p>Altura: <span>${pokemonDetails.height} m</span></p>
          <p>Habilidades: ${pokemonDetails.abilities
						.map((ability) => `<span>${ability}</span>`)
						.join(", ")}</p>
        </div>
  
        ${progressBars}
  
      `;

		pokemonModal.style.display = "block";
	} catch (err) {
		console.error("Erro ao buscar detalhes do Pokémon:", error);
	}
}

closeModalButton.addEventListener("click", () => {
	pokemonModal.style.display = "none";
});

function getPokemonDetails(pokemonId) {}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
	offset += limit;
	const qtdRecordsWithNexPage = offset + limit;

	if (qtdRecordsWithNexPage >= maxRecords) {
		const newLimit = maxRecords - offset;
		loadPokemonItens(offset, newLimit);

		loadMoreButton.parentElement.removeChild(loadMoreButton);
	} else {
		loadPokemonItens(offset, limit);
	}
});

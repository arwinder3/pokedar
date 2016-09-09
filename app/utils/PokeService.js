export function getNearbyPokemonInBounds(bounds) {
    const ne = bounds.northEast,
        sw = bounds.southWest;

    return fetch(`http://localhost:2998/api/sightingsInBounds?nelat=${ne.lat()}&nelng=${ne.lng()}&swlat=${sw.lat()}&swlng=${sw.lng()}`)
        .then(response => response.json());
}

export function getPokemonList() {
    return fetch("http://localhost:2998/api/pokemonlist")
        .then(response => response.json());
}

export function reportSighting(sighting) {
    return fetch("http://localhost:2998/api/sighting", {
        method: "POST",
        body: JSON.stringify(sighting),
        headers: new Headers({
            "Content-Type": "application/json"
        })
    }).then(response => response.json());
}

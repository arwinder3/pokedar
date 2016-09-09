const sightingshome = [
    {
        id: "86cb23c8-4ccb-461b-8483-61fe8693a2ec",
        pokemonId: 2,
        name: "Ivysaur",
        lat: 37.551407,
        lng: -122.290501
    },
    {
        id: "1f8147f2-8d55-4b78-b4a9-c607a79c6bda",
        pokemonId: 2,
        name: "Ivysaur",
        lat: 37.551019,
        lng: -122.288862
    },
    {
        id: "cccd1154-bc2f-41f6-a0e7-75b4dc2f9ebf",
        pokemonId: 2,
        name: "Ivysaur",
        lat: 37.546496,
        lng: -122.292316
    },
    {
        id: "9a0c141a-bec7-421f-a6c4-42d25f92247c",
        pokemonId: 20,
        name: "Raticate",
        lat: 37.548770,
        lng: -122.281674
    },
    {
        id: "f0cf9402-f34a-4285-ae9a-e1d337aa55e3",
        pokemonId: 34,
        name: "Nidoking",
        lat: 37.545771,
        lng: -122.287790
    },
    {
        id: "80e265c3-c5c5-47a4-a393-ecaa2ab3a072",
        pokemonId: 17,
        name: "Pidgeotto",
        lat: 37.552431,
        lng: -122.279136
    },
    {
        id: "793be209-0010-4860-a97a-0a77d884b124",
        pokemonId: 64,
        name: "Kadabra",
        lat: 37.543796,
        lng: -122.290800
    },
    {
        id: "de3d6554-7f41-4c61-b556-c01df80ba7b2",
        pokemonId: 10,
        name: "Caterpie",
        lat: 37.554326,
        lng: -122.282560
    },
    {
        id: "02e2eb24-4580-4901-b5c5-834652db8048",
        pokemonId: 5,
        name: "Charmeleon",
        lat: 37.547908,
        lng: -122.283755
    }
];

const sightingswork = [
    {
        id: "86cb23c8-4ccb-461b-8483-61fe8693a2ec",
        pokemonId: 2,
        name: "Ivysaur",
        lat: 37.425796,
        lng: -122.092203
    },
    {
        id: "1f8147f2-8d55-4b78-b4a9-c607a79c6bda",
        pokemonId: 2,
        name: "Ivysaur",
        lat: 37.423286,
        lng: -122.091989
    },
    {
        id: "cccd1154-bc2f-41f6-a0e7-75b4dc2f9ebf",
        pokemonId: 2,
        name: "Ivysaur",
        lat: 37.431916,
        lng: -122.099504
    },
    {
        id: "9a0c141a-bec7-421f-a6c4-42d25f92247c",
        pokemonId: 20,
        name: "Raticate",
        lat: 37.428079,
        lng: -122.094306
    },
    {
        id: "f0cf9402-f34a-4285-ae9a-e1d337aa55e3",
        pokemonId: 34,
        name: "Nidoking",
        lat: 37.429988,
        lng: -122.099499
    },
    {
        id: "80e265c3-c5c5-47a4-a393-ecaa2ab3a072",
        pokemonId: 17,
        name: "Pidgeotto",
        lat: 37.422115,
        lng: -122.098598
    },
    {
        id: "793be209-0010-4860-a97a-0a77d884b124",
        pokemonId: 64,
        name: "Kadabra",
        lat: 37.426069,
        lng: -122.096752
    },
    {
        id: "de3d6554-7f41-4c61-b556-c01df80ba7b2",
        pokemonId: 10,
        name: "Caterpie",
        lat: 37.429783,
        lng: -122.088556
    },
    {
        id: "02e2eb24-4580-4901-b5c5-834652db8048",
        pokemonId: 5,
        name: "Charmeleon",
        lat: 37.430533,
        lng: -122.094049
    }
];

module.exports = {
    mockSightings: (location) => {
        return (location === "work") ?
            sightingswork : sightingshome;
    }
};

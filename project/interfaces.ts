export interface Pokemon {
    id: number,
    name: string,
    description: string,
    order: number,
    active: boolean,
    birthdate: string,
    imageUrl: string,
    type: string,
    hobbies: string[],
    favoriteMove: {
        id: number,
        name: string,
        type: string,
        power: number | null,
        accuracy: number | null,
        description: string
    }
}

/*export interface PokemonMoves {
    id: number,
    name: string,
    type: string,
    power: number,
    accuracy: number,
    description: string
}*/
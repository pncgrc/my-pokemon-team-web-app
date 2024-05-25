export interface Pokemon {
    id: number,
    name: string,
    nickname: string,
    description: string,
    order: number,
    active: boolean,
    imageUrl: string,
    type: string,
    hobbies: string[],
    favoriteAbility: Ability
}

export interface Ability {
    id: number,
    name: string,
    type: string,
    power: number | null,
    accuracy: number | null,
    description: string
}
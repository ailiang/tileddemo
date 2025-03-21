
enum TILE_TYPE {
    Normal = 1,
    Stone, 

}

const tileMap = new Map<number, TILE_TYPE>([ 
    [32, TILE_TYPE.Stone],
])


export function IsPassable(tileId :number): boolean {
    return tileMap.get(tileId) != TILE_TYPE.Stone
}


enum TILE_TYPE {
    Normal = 1,
    Stone, 
    Brick,

}

const blockType = [
    TILE_TYPE.Stone,
    TILE_TYPE.Brick,
]

const tileMap = new Map<number, TILE_TYPE>([ 
    [32, TILE_TYPE.Stone],
    [10, TILE_TYPE.Brick],
])


export function IsPassable(tileId :number): boolean {
    const tileType = tileMap.get(tileId)
    return blockType.indexOf(tileType) < 0 
}


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

type MapProfile =  {
    mapWidth : number
    mapHeight: number
    tileWidth : number
    tileHeight : number
    tileNumX: number
    tileNumY: number
};

export const mapProfile : MapProfile = {
    mapWidth: 0,
    mapHeight: 0,
    tileWidth: 0,
    tileHeight: 0,
    tileNumX : 0,
    tileNumY: 0,
};

 
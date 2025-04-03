
import { _decorator, Component, Node, TiledMap, Vec3, Animation, resources, Prefab, instantiate, Camera, TiledLayer, find, animation, Sprite, UITransform, v3 } from 'cc';
import { IsPassable, mapProfile  } from './data/Mapdata'; 
import PlayerController from './PlayerControler';
import { FindPath, GridCell} from './base/Findpath';
import { CreateNode } from './base/Util';
const { ccclass, property } = _decorator;

@ccclass('mapmanager')
export class MapManager extends Component {

    @property(Camera) // 绑定主摄像机
    mainCamera: Camera = null!;

    private player: Node = null

    private findpath: FindPath 

    protected start(): void {
        const tilemap = this.getComponent(TiledMap)
        const mapsize = tilemap.getMapSize()
        const tilesize = tilemap.getTileSize()
        mapProfile.tileNumX = mapsize.width
        mapProfile.tileNumY = mapsize.height
        mapProfile.tileWidth = tilesize.width
        mapProfile.tileHeight = tilesize.height
        mapProfile.mapWidth = mapsize.width * tilesize.width
        mapProfile.mapHeight = mapsize.height * tilesize.height
        
        //gen find path map
        this.genFindpath(tilemap.getLayer("background"))

        // get spawn point
        const obj = tilemap.getObjectGroup("objects")
        const objs = obj.getObjects()
        var spawnpoint: Vec3 = v3(0, 0, 0)
        objs.forEach(o => {
            if (o.name == 'spawnpoint') {
                spawnpoint = this.objCoordinate2Cocos(o.x, o.y)
            }
        })

        // create player
        this.player = CreateNode('player') 
        this.player.setPosition(spawnpoint)
        const ctrl = this.player.addComponent(PlayerController)
        ctrl.Init(tilemap, this.mainCamera, this.findpath)
        this.node.addChild(this.player)

        return
   }
    

    genFindpath(background: TiledLayer) {
        const grids: GridCell[][] = []
        for ( var i = 0; i < mapProfile.tileNumX; i++) {
            grids[i] = []
            for ( var j = 0; j < mapProfile.tileNumY; j++) {
                const tileGID = background.getTileGIDAt(i, j);
                grids[i][j] = {
                    x: i,
                    y: j,
                    passable: IsPassable(tileGID)
                }
            }
        }
        this.findpath = new FindPath( grids)
   }
    objCoordinate2Cocos( x: number, y: number): Vec3 {
        return new Vec3(x - mapProfile.mapWidth / 2 + mapProfile.tileWidth / 2,
            y - mapProfile.mapHeight / 2 - mapProfile.tileHeight / 2,
            0)
    }
}
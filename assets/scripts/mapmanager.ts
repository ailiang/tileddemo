
import { _decorator, Component, Node, TiledMap, Vec3, Animation, resources, Prefab, instantiate, Camera, TiledLayer, find, animation, Sprite } from 'cc';
import { IsPassable, mapProfile  } from './data/mapdata'; 
import PlayerControllerGpt from './PlayerControlerGpt';
import { FindPath, GridCell} from './base/Findpath';
const { ccclass, property } = _decorator;

@ccclass('mapmanager')
export class mapmanager extends Component {

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
        
        const obj = tilemap.getObjectGroup("objects")
        const objs = obj.getObjects()
        resources.load("prefab/player", Prefab, (err, res: Prefab) => {
            if (err) {
                console.error(err);
                return;
            }
            this.player = instantiate(res)
            objs.forEach(o => {
                if(o.name == 'spawnpoint') {
                    this.genFindpath(tilemap.getLayer("background"))
                    const pos = this.objCoordinate2Cocos(o.x, o.y)
                    this.player.setPosition(pos.x, pos.y)
                    const ctrl = this.player.addComponent(PlayerControllerGpt)
                    ctrl.Init( tilemap, this.mainCamera, this.findpath)

                    this.node.addChild(this.player)
                    const anim = this.player.getComponent(Animation)
                    anim.play()
                    return
                }
            })
        })
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
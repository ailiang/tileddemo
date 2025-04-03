
import { _decorator, Component,Input, input, KeyCode, TiledMap, Vec3, EventKeyboard, v3, EventMouse, Camera, Animation, Sprite } from 'cc';
import { FindPath } from './base/Findpath';
import { PlayerStateMachine } from './state/PlayerStateMachine';
import { PlayerState, mapProfile, IsPassable } from './data/Mapdata';
const { ccclass, property } = _decorator;


@ccclass
export default class PlayerController extends Component {
    @property(TiledMap)
    tileMap: TiledMap = null;

    private mainCamera: Camera 

    private speed: number = 100;  // Player 移动速度

    private direction: Vec3 = v3(0, 0);

    private target : Vec3  = null

    private findpath: FindPath = null

    private paths: Vec3[] = [] 

    private stateMachine: PlayerStateMachine

    onLoad() {
        console.log("init load")
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        input.on(Input.EventType.MOUSE_DOWN, this.onMouseClick, this);

        const anim = this.getComponent(Animation) || this.addComponent(Animation)

        this.stateMachine = new PlayerStateMachine(anim)
        this.stateMachine.switchState(PlayerState.IdleRight)
    }
    // 鼠标点击回调
    private onMouseClick(event: EventMouse) {
        this.findpathclick(event)
        //this.movetoclick(event)
        return
    }

    private findpathclick(event : EventMouse) {
        this.paths = []
        const screenPos = event.getLocation();
        const worldPos = this.mainCamera.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0));
        const tilemapWorldPos = this.tileMap.node.worldPosition;
        const localPos = v3(
            worldPos.x - tilemapWorldPos.x,
            worldPos.y - tilemapWorldPos.y,
            0
        );
        const { x: targetTileX, y: targetTileY } = this.pos2tileIndex(localPos)
        const {x: startTileX, y: startTileY} = this.pos2tileIndex( this.node.position)
        const re = this.findpath.findPath( {x: startTileX, y: startTileY, passable: true}, {x:targetTileX, y:targetTileY, passable:true})
        console.log("findpath: ", re)
        if( re.found ) {
            for (let i = 1; i < re.path.length; i++) {
                this.paths.push(this.tile2mapAnchor( this.tileindex2tilepos(re.path[i].x, re.path[i].y)) )
            } 
            console.log("paths: ", this.paths)
        }
    }


    private movetoclick(event: EventMouse) {
          // 1. 获取屏幕坐标并转世界坐标
          const screenPos = event.getLocation();
          const worldPos = this.mainCamera.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0));
  
          // 2. 转换为 Tilemap 本地坐标
          const tilemapWorldPos = this.tileMap.node.worldPosition;
          const localPos = v3(
              worldPos.x - tilemapWorldPos.x,
              worldPos.y - tilemapWorldPos.y,
              0
          );

          // 4. 计算 Tile 索引
          const { x: tileX, y: tileY} = this.pos2tileIndex(localPos)
  
          // 5. 越界检测
          if (tileX < 0 || tileX >= mapProfile.tileNumX || tileY < 0 || tileY >= mapProfile.tileNumY) {
              console.log("点击位置超出地图范围");
          } else {
              console.log("Tile 索引:", tileX, tileY);
          }

        const tilepos = this.tileindex2tilepos(tileX, tileY) 
        this.target = this.tile2mapAnchor ( tilepos )
 
    }

    Init(mp : TiledMap, campera : Camera, fp : FindPath) {
        this.tileMap = mp
        this.mainCamera = campera
        this.findpath = fp

        this.addComponent(Sprite)

        console.log("init")
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this.direction.y = 1
                break;
            case KeyCode.KEY_S:
                this.direction.y = -1
                break;
            case KeyCode.KEY_A:
                this.direction.x = -1
                break;
            case KeyCode.KEY_D:
                this.direction.x = 1
                break;
        }
    }


    onKeyUp(event: EventKeyboard) {
        this.direction.set(Vec3.ZERO); // 将方向向量设置为零向量 = Vec3.ZERO;
        return
    }
    protected update(dt: number): void {
        if( this.target == null) {
            if ( this.paths.length == 0 ) {
                return  
            }
            this.target = this.paths.shift() 
        } 
        if( this.node.position.equals(this.target)) {
            if( this.paths.length > 0 ) {
               this.target = this.paths.shift() 
            } else {
                return
            }
        }
        this.direction.set(Vec3.ZERO);
        const curPos = this.node.position
        if( Math.abs( curPos.x - this.target.x ) > 1 ) {
            this.direction.x = this.target.x - curPos.x 
        }  else if( Math.abs( curPos.y - this.target.y ) > 1 ) {
            this.direction.y = this.target.y - curPos.y 
        } else {
            this.node.position = this.target
            return
        }
        const moveDelta = this.direction.clone().normalize().multiplyScalar(this.speed * dt);
        this.node.position = this.node.position.add(moveDelta) 
    }

    update1(dt: number) {
        if (this.target == null) {
            return
        }
        if (this.target.equals(this.node.position)) {
            return
        }
        console.log(this.target)
        this.direction.set(Vec3.ZERO);
        const curPos = this.node.position
        if( Math.abs( curPos.x - this.target.x ) > 1 ) {
            this.direction.x = this.target.x - curPos.x 
        }  else if( Math.abs( curPos.y - this.target.y ) > 1 ) {
            this.direction.y = this.target.y - curPos.y 
        } else {
            this.node.position.set(this.target)
            return
        }
        const moveDelta = this.direction.clone().normalize().multiplyScalar(this.speed * dt);
        const anchorOffsetDelata = this.direction.clone().normalize().multiplyScalar(mapProfile.tileWidth / 2);
        const newPosition = this.node.position.clone().add(moveDelta);
        const newAnchorOffset = newPosition.clone().add(anchorOffsetDelata);
        if (this.isPositionPassable(newAnchorOffset)) {
            this.node.position = newPosition;
        } else {
            this.target.set( this.node.position     )
        }
    }

    isPositionPassable(position: Vec3): boolean {
        const {x: tileX, y: tileY} = this.pos2tileIndex(position)
        const ground = this.tileMap.getLayer('background')
        const tileGID = ground.getTileGIDAt(tileX, tileY);
        return IsPassable(tileGID)
    }

    map2tileAnchor(pos :Vec3): Vec3 {
        const tilex = pos.x + mapProfile.mapWidth / 2;
        const tiley = mapProfile.mapHeight / 2 - pos.y;
        return v3(tilex, tiley, 0)
    }

    tile2mapAnchor(pos: Vec3): Vec3 {
        const mapx = pos.x - mapProfile.mapWidth / 2;
        const mapy = mapProfile.mapHeight / 2 - pos.y;
        return v3(mapx, mapy, 0)
    }

    pos2tileIndex(pos: Vec3): Vec3{
        const tilepos = this.map2tileAnchor(pos)
        const tileX = Math.floor(tilepos.x / 32);
        const tileY = Math.floor(tilepos.y / 32);
        return v3(tileX, tileY) 
    }

    tileindex2tilepos(tileX: number, tileY: number) : Vec3{
         const tileCenterX = tileX * mapProfile.tileWidth + mapProfile.tileWidth / 2;
         const tileCenterY = tileY * mapProfile.tileHeight + mapProfile.tileHeight / 2;
        return v3(tileCenterX, tileCenterY, 0)
    }
    
}
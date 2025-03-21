
import { _decorator, BoxCollider2D, Component, Vec2, Node, Size, TiledMap, RigidBody2D, Vec3, ERigidBody2DType, UITransform, TiledLayer, Sprite, color, Color, resources, Prefab, instantiate } from 'cc';
import { PlayerController } from './PlayerControler';
import { IsPassable  } from './data/mapdata'; 
const { ccclass, property } = _decorator;

@ccclass('mapmanager')
export class mapmanager extends Component {

    private player: Node = null
    private mapWidth : number
    private mapHeight: number
    private tileWidth : number
    private tileHeight : number
    private tileNumX: number
    private tileNumY: number
    protected start(): void {
        const tilemap = this.getComponent(TiledMap)
        const ground = tilemap.getLayer('background')
        const mpsize = tilemap.getMapSize()
        const tilesz = tilemap.getTileSize()
        this.tileNumX = mpsize.width
        this.tileNumY = mpsize.height
        this.tileWidth = tilesz.width
        this.tileHeight = tilesz.height
        this.mapWidth = mpsize.width * tilesz.width
        this.mapHeight = mpsize.height * tilesz.height
        for (var i = 0; i < tilemap.getMapSize().width; i++) {
            for (var j = 0; j < tilemap.getMapSize().height; j++) {
                const gid = ground.getTileGIDAt(i, j)
                if ( !IsPassable (gid) ){
                    this.genBlock(i,j)
                }
           }
        }

        const obj = tilemap.getObjectGroup("objects")
        const objs = obj.getObjects()
        resources.load("prefab/player", Prefab, (err, res: Prefab) => {
            if (err) {
                console.error(err);
                return;
            }
            this.player = instantiate(res)
            objs.forEach(o => {
                if(o.name == 'lb') {
                    const pos = this.objCoordinate2Cocos(o.x, o.y)
                    this.player.setPosition(pos.x, pos.y)
                    console.log(o.name, o, pos)
                    const ctrl = this.player.addComponent(PlayerController)
                    this.addCollider(this.player, ERigidBody2DType.Dynamic)
                    ctrl.Init()
                    this.node.addChild(this.player)
                    return
                }
            })
        })
    }

    addCollider(node: Node, typ: ERigidBody2DType) {
        const collider =  node.addComponent(BoxCollider2D);
        collider.size = new Size(this.tileWidth, this.tileHeight);
        collider.offset = new Vec2(0, 0);
        collider.apply();
        const rigidBody = node.addComponent(RigidBody2D);
        rigidBody.type = typ; 
        rigidBody.fixedRotation = true
        rigidBody.enabledContactListener = true;
    }

    genBlock(i: number, j: number) {
        const colliderNode = new Node('colliderNode');
        const pos = this.tileIndex2Cocos(i, j)
        colliderNode.setPosition(pos) 
        const trans = colliderNode.addComponent(UITransform)
        trans.setAnchorPoint(0.5, 0.5)
        trans.setContentSize(this.tileWidth, this.tileHeight)
        this.addCollider(colliderNode, ERigidBody2DType.Static)
        this.node.addChild(colliderNode);
        console.log(i, j, pos)
    }

    objCoordinate2Cocos( x: number, y: number): Vec3 {
        return new Vec3(x - this.mapWidth / 2 + this.tileWidth / 2,
            y - this.mapHeight / 2 - this.tileHeight / 2,
            0)
    }

    tileIndex2Cocos(i: number, j: number) : Vec3 {
        const y = this.mapHeight / 2 - j * this.tileHeight - this.tileHeight / 2
        const x = -(this.mapWidth/2 - i * this.tileWidth) + this.tileWidth / 2 
        return new Vec3(x, y, 0)
    }

}
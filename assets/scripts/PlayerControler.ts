import { _decorator, Component,CCFloat, Canvas, IPhysics2DContact, Input, input, KeyCode, TiledMap, Vec3, Vec2, EventKeyboard, Collider2D, RigidBody2D, BoxCollider2D, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property({ type: CCFloat})
    moveSpeed: number = 1;

    @property(TiledMap)
    tiledMap: TiledMap | null = null;

    private rigidBody: RigidBody2D | null = null;

    Init() {
        this.moveSpeed = 0.5 
        this.rigidBody = this.getComponent(RigidBody2D);
        if (!this.rigidBody) {
            console.error("Player 缺少 RigidBody2D 组件！");
        }
        const collider = this.getComponent(BoxCollider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionBegin, this)
        }else {
            console.error("Player 缺少 BoxCollider2D 组件！");
        }
    }
    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt: number){
    }

   
    onCollisionBegin(
        selfCollider: Collider2D, 
        otherCollider: Collider2D,
        contact: IPhysics2DContact| null
    ) {
        console.log('oncllide begin :' , this.node.position);
        return
        let velocity = this.rigidBody.linearVelocity;
        let impulse = new Vec2(-velocity.x *0.8, -velocity.y *0.8);
        let tmp = new Vec2()
        this.rigidBody.applyLinearImpulse(impulse, this.rigidBody.getWorldCenter(tmp), true);
    }

       onKeyDown(event: EventKeyboard) {
        const velocity = new Vec2();
        switch (event.keyCode) {
            case KeyCode.KEY_W: velocity.y = this.moveSpeed; break;
            case KeyCode.KEY_S: velocity.y = -this.moveSpeed; break;
            case KeyCode.KEY_A: velocity.x = -this.moveSpeed; break;
            case KeyCode.KEY_D: velocity.x = this.moveSpeed; break;
        }
        if (this.rigidBody) {
            this.rigidBody.linearVelocity = velocity; 
            console.log('PlayerPos: ', this.node.position);
        }
    }


    onKeyUp(event: EventKeyboard) {
        this.rigidBody.linearVelocity = new Vec2(0, 0);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }
}
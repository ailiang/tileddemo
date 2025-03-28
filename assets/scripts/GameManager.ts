import { _decorator, Component, director, Node, tween } from 'cc';
import { eventManager, EventType } from './base/EventManager';
const { ccclass, property } = _decorator;

enum GameState {
    Idle = 1,
    Play = 2,
}

@ccclass('GameManager')
export class GameManager extends Component {
    private _gameState : GameState = GameState.Idle

    @property({type: Node})
    public MainUI : Node = null;

    @property({type: Node})
    public LevelManager: Node = null

    get GameState() : GameState{
        return this._gameState
    }

    set GameState(gs: GameState) {
        this._gameState = gs
        this.onStateChanged()
    } 

    protected onLoad(): void {
        eventManager.on(EventType.EvtPlayerDeath, this.onPlayerDeath, this) 
    }

    start() {
        this.GameState = GameState.Idle
    }

    update(deltaTime: number) {
        
    }

    onPlay() {
        this.GameState = GameState.Play
    }

    onPlayerDeath() {
        console.log("death", this)
        this.GameState = GameState.Idle
    }

    onStateChanged() {
        if( this._gameState == GameState.Idle) {
            this.LevelManager.active = false
            this.MainUI.active = true
        } else if( this._gameState == GameState.Play) {
            this.LevelManager.active = true
            this.MainUI.active = false
        } 
    }
}



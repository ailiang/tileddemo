
// src/states/IdleFrontState.ts
import { _decorator, Animation, AnimationClip } from 'cc';
import { IPlayerState } from '../base/GameTypes';
import { PlayerStateResPath } from '../data/Mapdata';
import { loadClip } from '../base/Util';

export class IdleFrontState implements IPlayerState {
    private _animation: Animation;
    private _clip: AnimationClip | null = null;

    constructor(animation: Animation) {
        this._animation = animation;
    }

    async onEnter() {
        if (!this._clip) {
            this._clip = await loadClip(PlayerStateResPath.IdleFront);
        }
        this._animation.defaultClip = this._clip
        this._animation.play();
        console.log("onEnter IdleFrontState")
    }

    async onExit() {
        this._animation.stop();
    }
}
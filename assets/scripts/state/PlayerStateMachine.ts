
import { Animation } from 'cc';
import { IPlayerStateMachine, IPlayerState } from '../base/GameTypes';
import { IdleFrontState } from './PlayerIdleFrontState';
import { PlayerState } from '../data/Mapdata';
import { IdleBackState } from './PlayerIdleBackState';
import { IdleRightState } from './PlayerIdleRightState';

export class PlayerStateMachine implements IPlayerStateMachine {
    private _currentState: IPlayerState | null = null;
    private _states: Map<string, IPlayerState> = new Map();

    constructor(anim: Animation) {
        this._states.set(PlayerState.IdleFront, new IdleFrontState(anim));
        this._states.set(PlayerState.IdleBack, new IdleBackState(anim));
        this._states.set(PlayerState.IdleRight, new IdleRightState(anim));
    }

    async switchState(stateId: string) {
        const newState = this._states.get(stateId);
        if (!newState || this._currentState === newState) return;

        if (this._currentState) {
            await this._currentState.onExit();
        }

        this._currentState = newState;
        await this._currentState.onEnter();
    }
}
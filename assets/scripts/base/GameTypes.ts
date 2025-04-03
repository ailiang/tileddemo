export interface IPlayerState {
    onEnter(): Promise<void>;
    onExit(): Promise<void>;
}

export interface IPlayerStateMachine {
    switchState(stateId: string): Promise<void>;
}


export type MessageType = "input"

export interface IBaseMessage{
    
}

export interface ISnapshot
{
    type: string;
    playerId: string;
    lastProcessedInputSeq: number;
    players: IPlayerSnapshot[];
}

export interface IInputMessage extends IBaseMessage
{
    type: MessageType;
    seq: number ;
    up: boolean ;
    down: boolean;
    left: boolean ;
    right: boolean ;
}

export interface IPlayerSnapshot extends IBaseMessage
{
    id : string;
    x : number;
    y : number;
}
export interface IFrame {
    Roll1?: number;
    Roll2?: number;
    Roll3?: number;
    Total?: number;
}

export interface ILane {
    LaneId: number;
    Frames: Array<IFrame>;
    TotalScore: number;
}

export interface IGame {
    GameId: string;
    Lanes: Array<ILane>;
}
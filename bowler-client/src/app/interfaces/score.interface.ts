export interface Score {
    Id: string;
    GameId: string;
    Name?: string;
    LaneId: number;
    TotalScore: number;
    CreatedAt?: Date;
}
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IFrame, IGame, ILane } from '../interfaces/bowling.interfaces';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-bowling-container',
  templateUrl: './bowling-container.component.html',
  styleUrls: ['./bowling-container.component.scss']
})
export class BowlingContainerComponent implements OnInit {

  public game: IGame = { GameId: '', Lanes: [] };
  public gameId: string = '';
  public isGameStarted: boolean = false;
  public isRollStarted: boolean = false;
  public remainingPins: number = 10;
  public dataSource: MatTableDataSource<ILane> = new MatTableDataSource(this.game.Lanes);
  public gameName: string = '';
  public isGameOver: boolean = false;

  private currentLane: number = 1;

  constructor(private gameService: GameService) { }

  public ngOnInit(): void {
  }

  public initializeFramesArray(): Array<IFrame> {
    let frames: Array<IFrame> = [];
    for (let i = 0; i < 10; i++) {
      frames.push({
        Roll1: undefined,
        Roll2: undefined,
        Roll3: undefined,
        Total: undefined,
      });
    }
    return frames;
  }

  public intializeLane(index: number): ILane {
    let lane: ILane =  {
      LaneId: index,
      TotalScore: 0,
      Frames: this.initializeFramesArray()
    };

    return lane;
  }

  public startGame(): void {
    this.isGameStarted = true;
    this.createGame({Name: this.gameName});
    this.game.Lanes = [];
    this.game.Lanes.push(this.intializeLane(this.currentLane));
    this.dataSource = new MatTableDataSource(this.game.Lanes);
  }

  public addNewPlayer(): void {
    this.currentLane++;
    this.game.Lanes.push(this.intializeLane(this.currentLane));
    this.dataSource = new MatTableDataSource(this.game.Lanes);
  }

  public isRollingStarted(isStarted: boolean): void {
    this.isRollStarted = isStarted;
  }

  public remainingPingsChanged(remainingPins: number): void {
    this.remainingPins = remainingPins;
  }

  public gameStateChanged(state: boolean): void {
    this.isGameOver = state;
  }

  private createGame(game: any): void  {
    this.gameService.createGame(game).subscribe((data: any) => {
      if (data) {
        this.game.GameId = data.id;
      }
    });
  }
}

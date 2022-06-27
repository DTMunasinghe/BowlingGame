import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { IFrame, IGame, ILane } from 'src/app/interfaces/bowling.interfaces';
import { ScoreService } from 'src/app/services/score.service';

@Component({
  selector: 'app-bowling-score-card',
  templateUrl: './bowling-score-card.component.html',
  styleUrls: ['./bowling-score-card.component.scss']
})
export class BowlingScoreCardComponent implements OnInit {

  @Input()
  public game: IGame = { GameId: '', Lanes: [] };

  @Input()
  public dataSource: MatTableDataSource<ILane> = new MatTableDataSource(this.game.Lanes);

  @Output()
  public rollStarted: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public remainingPingsChanged: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public gameStateChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isGameOver: boolean = false;
  public displayedColumns: string[] = ['Player #', 'Frame 1', 'Frame 2', 'Frame 3', 'Frame 4', 'Frame 5', 'Frame 6', 'Frame 7', 'Frame 8', 'Frame 9', 'Frame 10', 'Total Score'];

  private activeLane: number = 1;
  private activeFrame: number = 1;
  public remainingPins: number = 10;

  constructor(private _snackBar: MatSnackBar, private scoreService: ScoreService) { }

  public ngOnInit(): void {
  }

  public isMyTurn(laneId: number, frame: number): boolean {
    return (this.activeLane === laneId && this.activeFrame === frame);
  }

  public roll(laneId: number, frame: number): void {
    this.startRolling();
    const fallenPins: number = Math.floor(Math.random() * (this.remainingPins + 1)); //Generate random number

    this.openSnackBar(`No of fallen pins : ${fallenPins}`);
    
    const currentFrame: IFrame = this.game.Lanes[laneId - 1].Frames[frame - 1];
    
    if (this.isLastFrame(frame)) {
      if (this.isFirstRoll(currentFrame)) {
        if (this.isStrike(fallenPins)) {
          this.resetRemainingPins();
          this.updateRollOne(laneId, frame, fallenPins);
        } else {
          this.updateRemainingPins(fallenPins);
          this.updateRollOne(laneId, frame, fallenPins);
        }
        this.game.Lanes[laneId - 1].Frames[frame - 1].Total = <number>this.game.Lanes[laneId - 1].Frames[frame - 2].Total + fallenPins; // Update Total
        this.updateLastScore(laneId, frame);
      } else if (this.isSecondRoll(currentFrame)) {
        if (this.isSpare(<number>currentFrame.Roll1, fallenPins)) {
          this.resetRemainingPins();
          this.updateRollTwo(laneId, frame, fallenPins);
          this.game.Lanes[laneId - 1].Frames[frame - 1].Total = <number>this.game.Lanes[laneId - 1].Frames[frame - 1].Total + fallenPins; // Update Total
          this.updateLastScore(laneId, frame);
        } else {
          this.updateRemainingPins(fallenPins);
          this.updateRollTwo(laneId, frame, fallenPins);
          this.game.Lanes[laneId - 1].Frames[frame - 1].Total = <number>this.game.Lanes[laneId - 1].Frames[frame - 1].Total + fallenPins; // Update Total
          this.updateLastScore(laneId, frame);

          if (this.isBowlingGameOver()) {
            this.saveFinalScoreOfTheLane(laneId); // Save the Total Score of the Lane
            this.stopGame();
            this.showWinner();
          } else {
            this.moveToNextLane();
            this.saveFinalScoreOfTheLane(laneId); // Save the Total Score of the Lane
          }
        }
      } else if (this.isStrike(<number>currentFrame.Roll1) || this.isSpare(<number>currentFrame.Roll1, <number>currentFrame.Roll2)) { // Third roll
        this.updateRollThree(laneId, frame, fallenPins);
        this.game.Lanes[laneId - 1].Frames[frame - 1].Total = <number>this.game.Lanes[laneId - 1].Frames[frame - 1].Total + fallenPins; // Update Total
        this.updateLastScore(laneId, frame);

        if (this.isBowlingGameOver()) {
          this.saveFinalScoreOfTheLane(laneId); // Save the Total Score of the Lane
          this.stopGame();
          this.showWinner();
        } else {
          this.moveToNextLane();
          this.saveFinalScoreOfTheLane(laneId); // Save the Total Score of the Lane
        }
      }
    } else {
      if (this.isFirstRoll(currentFrame)) { // First Roll
        if (this.isStrike(fallenPins)) { // Strike
          this.moveToNextLane();
          this.resetRemainingPins();
        } else {
          this.updateRemainingPins(fallenPins);
        }
        this.updateRollOne(laneId, frame, fallenPins);
        if (frame > 1) {
          this.game.Lanes[laneId - 1].Frames[frame - 1].Total = <number>this.game.Lanes[laneId - 1].Frames[frame - 2].Total + fallenPins
        } else {
          this.game.Lanes[laneId - 1].Frames[frame - 1].Total = fallenPins; // Update Total
        }
        this.updateLastScore(laneId, frame);
      } else { // Second roll
        this.updateRollTwo(laneId, frame, fallenPins);
        this.resetRemainingPins();
        this.moveToNextLane();
        if (frame > 1) {
          this.game.Lanes[laneId - 1].Frames[frame - 1].Total = <number>this.game.Lanes[laneId - 1].Frames[frame - 2].Total 
                                                                + <number>this.game.Lanes[laneId - 1].Frames[frame - 1].Roll1 + fallenPins;
          this.updateLastScore(laneId, frame);
        } else {
          this.game.Lanes[laneId - 1].Frames[frame - 1].Total = <number>this.game.Lanes[laneId - 1].Frames[frame - 1].Roll1 + fallenPins; // Update Total
          this.updateLastScore(laneId, frame);
        }
      }
    }
    this.progressGame();
  }

  private updateLastScore(laneId: number, frame: number) {
    this.game.Lanes[laneId - 1].TotalScore = <number>this.game.Lanes[laneId - 1].Frames[frame - 1].Total;
  }

  private saveFinalScoreOfTheLane(laneId: number): void {
    const scoreObj: any = {
      GameId: this.game.GameId,
      LaneId: laneId,
      TotalScore: this.game.Lanes[laneId - 1].TotalScore
    };

    this.scoreService.addScore(scoreObj).subscribe();
  }

  private updateRemainingPins(fallenPins: number): void {
    this.remainingPins = this.remainingPins - fallenPins;
    this.remainingPingsChanged.emit(this.remainingPins);
  }

  private updateRollOne(laneId: number, frame: number, fallenPins: number): void {
    this.game.Lanes[laneId - 1].Frames[frame - 1].Roll1 = fallenPins;
    if (frame > 1) {
      if (this.isPreviousFrameIsStrike(laneId, frame) || this.isPreviousFrameIsSpare(laneId, frame)) {
        // update previous frame total
        this.game.Lanes[laneId - 1].Frames[frame - 2].Total = <number>this.game.Lanes[laneId - 1].Frames[frame - 2].Total 
                                                              + <number>this.game.Lanes[laneId - 1].Frames[frame - 1].Roll1;
      }

      if (frame> 2 && this.isOneBeforeThePreviousFrameIsStrike(laneId, frame) && this.isPreviousFrameIsStrike(laneId, frame)) {
        // update one before previous frame total
        this.game.Lanes[laneId - 1].Frames[frame - 3].Total = <number>this.game.Lanes[laneId - 1].Frames[frame - 3].Total 
                                                              + <number>this.game.Lanes[laneId - 1].Frames[frame - 1].Roll1
      }
    }
  }

  private updateRollTwo(laneId: number, frame: number, fallenPins: number): void {
    this.game.Lanes[laneId - 1].Frames[frame - 1].Roll2 = fallenPins;
    if (frame > 1) {
      if (this.isPreviousFrameIsStrike(laneId, frame)) {
        // update previous frame total
        this.game.Lanes[laneId - 1].Frames[frame - 2].Total = <number>this.game.Lanes[laneId - 1].Frames[frame - 2].Total 
                                                              + <number>this.game.Lanes[laneId - 1].Frames[frame - 1].Roll2;
      }
    }
  }

  private updateRollThree(laneId: number, frame: number, fallenPins: number): void {
    this.game.Lanes[laneId - 1].Frames[frame - 1].Roll3 = fallenPins;
  }

  private isFirstRoll(currentFrame: IFrame): boolean {
    return currentFrame.Roll1 === undefined;
  }

  private isSecondRoll(currentFrame: IFrame): boolean {
    return <number>currentFrame.Roll1 >= 0 && currentFrame.Roll2 === undefined;
  }

  private openSnackBar(message: string): void {
    this._snackBar.open(message, '', { duration: 2000, verticalPosition: 'top' });
  }

  private showWinner(): void {
    const winner: number = this.game.Lanes.sort((a, b) => b.TotalScore - a.TotalScore)[0].LaneId;
    this._snackBar.open(`The winner is Player No. ${winner} `, '', { verticalPosition: 'top', panelClass: ['snack-bar-color'] });
  } 

  private progressGame(): void {
    if (this.isLastLane(this.activeLane)) {
      this.moveToNexFrame();
      this.resetActiveLane();
    }
  }

  private startRolling(): void {
    this.rollStarted.emit(true);
  }

  private stopGame(): void {
    this.isGameOver = true;
    this.gameStateChanged.emit(true);
  }

  private resetActiveLane(): void {
    this.activeLane = 1; 
  }

  private moveToNexFrame(): void {
    this.activeFrame++;
  }

  private moveToNextLane(): void {
    this.activeLane++;
  }

  private resetRemainingPins(): void {
    this.remainingPins = 10;
    this.remainingPingsChanged.emit(this.remainingPins);
  }

  private isPreviousFrameIsStrike(laneId: number, frame: number): boolean {
    const previousFrame: IFrame = this.game.Lanes[laneId - 1].Frames[frame - 2];
    return this.isStrike(<number>previousFrame.Roll1);
  }

  private isPreviousFrameIsSpare(laneId: number, frame: number): boolean {
    const previousFrame: IFrame = this.game.Lanes[laneId - 1].Frames[frame - 2];
    return this.isSpare(<number>previousFrame.Roll1, <number>previousFrame.Roll2);
  }

  private isOneBeforeThePreviousFrameIsStrike(laneId: number, frame: number): boolean {
    const oneBeforeThePreviousFrame: IFrame = this.game.Lanes[laneId - 1].Frames[frame - 3];
    return this.isStrike(<number>oneBeforeThePreviousFrame.Roll1);
  }

  private isBowlingGameOver(): boolean {
    return (this.activeLane === this.game.Lanes.length);
  }

  private isStrike(pins: number): boolean {
    return (pins === 10);
  }

  private isLastFrame(frame: number): boolean {
    return frame === 10;
  }

  private isLastLane(laneId: number): boolean {
    return this.game.Lanes.length < laneId;
  }

  private isSpare(fallenPinsOfRoll1: number, fallenPinsOfRoll2: number,) {
    return (fallenPinsOfRoll1 + fallenPinsOfRoll2 === 10);
  }

}

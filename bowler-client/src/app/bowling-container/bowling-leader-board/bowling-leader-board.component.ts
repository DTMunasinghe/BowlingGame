import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Game } from 'src/app/interfaces/game.interface';
import { Score } from 'src/app/interfaces/score.interface';
import { GameService } from 'src/app/services/game.service';
import { ScoreService } from 'src/app/services/score.service';
import { Observable, combineLatest  } from 'rxjs';

@Component({
  selector: 'app-bowling-leader-board',
  templateUrl: './bowling-leader-board.component.html',
  styleUrls: ['./bowling-leader-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BowlingLeaderBoardComponent implements OnInit, OnChanges {

  public displayedColumns: string[] = ['game', 'player', 'score'];
  public topScores: Score[] = [];
  public dataSource: MatTableDataSource<Score> = new MatTableDataSource(this.topScores);

  @Input()
  public isGameOver: boolean = false;

  constructor(
    private scoreService: ScoreService, 
    private gameService: GameService, 
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  public ngOnInit(): void {
    this.fetchData();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['isGameOver'].currentValue === true) {
      this.fetchData();
    }
  }

  private getTopScores(count: number = 10): Observable<Score[]> {
    return this.scoreService.getTopScores(count);
  }

  private getGames(): Observable<Game[]> {
    return this.gameService.getAllGames();
  }

  private mapDataToGetTopScores(scores: any, games: any[]): void {
    this.topScores = [];
    if (scores.length && games.length) {
      scores.forEach((score: any) => {
        this.topScores.push({
          Id: score.id,
          GameId: score.gameId,
          Name: this.getGameName(score.gameId, games),
          LaneId: score.laneId,
          TotalScore: score.totalScore
        });
      });
      this.dataSource = new MatTableDataSource(this.topScores); 
      this.changeDetectorRef.markForCheck();
    }
  }

  private getGameName(gameId: string, games: any[]): string {
    return games.filter(x => x.id === gameId)[0].name;
  }

  // I don't have to to this if I used an actual DB
  private fetchData(): void {
    combineLatest([
      this.getTopScores(), 
      this.getGames()
    ]).subscribe(([scores, games]) => {
      this.mapDataToGetTopScores(scores, games);
    });
  }

}

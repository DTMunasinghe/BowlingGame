import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, retry } from 'rxjs';
import { environment } from '../environments/environment.dev';
import { Score } from '../interfaces/score.interface';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  
  constructor(private httpClient: HttpClient) { }

  public addScore(score: Score): Observable<Score> {
    return this.httpClient.post<Score>(environment.baseApiUrl + `scores`, JSON.stringify(score), this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  public getTopScores(count: number): Observable<Score[]> {
    return this.httpClient.get<Score[]>(environment.baseApiUrl + `scores/top-scores/${count}`, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  private handleError(error: any): Observable<any> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { BowlingContainerComponent } from './bowling-container/bowling-container.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BowlingScoreCardComponent } from './bowling-container/bowling-score-card/bowling-score-card.component';
import { BowlingLeaderBoardComponent } from './bowling-container/bowling-leader-board/bowling-leader-board.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    BowlingContainerComponent,
    BowlingScoreCardComponent,
    BowlingLeaderBoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

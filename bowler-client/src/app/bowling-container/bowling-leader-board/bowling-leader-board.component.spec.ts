import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BowlingLeaderBoardComponent } from './bowling-leader-board.component';

describe('BowlingLeaderBoardComponent', () => {
  let component: BowlingLeaderBoardComponent;
  let fixture: ComponentFixture<BowlingLeaderBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BowlingLeaderBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BowlingLeaderBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

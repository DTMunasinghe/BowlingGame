import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BowlingScoreCardComponent } from './bowling-score-card.component';

describe('BowlingScoreCardComponent', () => {
  let component: BowlingScoreCardComponent;
  let fixture: ComponentFixture<BowlingScoreCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BowlingScoreCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BowlingScoreCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

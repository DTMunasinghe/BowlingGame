import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BowlingContainerComponent } from './bowling-container.component';

describe('BowlingContainerComponent', () => {
  let component: BowlingContainerComponent;
  let fixture: ComponentFixture<BowlingContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BowlingContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BowlingContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

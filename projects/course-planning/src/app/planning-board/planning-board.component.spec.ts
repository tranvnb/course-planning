import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningBoardComponent } from './planning-board.component';

describe('PlanningBoardComponent', () => {
  let component: PlanningBoardComponent;
  let fixture: ComponentFixture<PlanningBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanningBoardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

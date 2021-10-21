import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-planning-board',
  templateUrl: './planning-board.component.html',
  styleUrls: ['./planning-board.component.scss'],
})
export class PlanningBoardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.debug('Dashboard init');
  }
}

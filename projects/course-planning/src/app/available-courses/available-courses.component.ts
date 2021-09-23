import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-available-courses',
  templateUrl: './available-courses.component.html',
  styleUrls: ['./available-courses.component.scss'],
})
export class AvailableCoursesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.debug('Available courses init');
  }
}

import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'cp-available-courses',
  templateUrl: './available-courses.component.html',
  styleUrls: ['./available-courses.component.scss'],
})
export class AvailableCoursesComponent implements OnInit {
  todo = ['get to work', 'picup groceries', 'run earrand'];

  done = ['get up', 'take a shower'];

  availableCourses = ['course 1', 'course 2', 'courses 3'];

  constructor() {}

  ngOnInit(): void {
    console.debug('Available courses init');
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log('event.previousContainer', event.previousContainer);
    console.log('event.container', event.container);
    console.log('event.container.data', event.container.data);
    console.log('event.previousIndex', event.previousIndex);
    console.log('event.currentIndex', event.currentIndex);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ICourse } from '../../interfaces/ICourse';
import { CourseService } from '../../services/course.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'cp-planning-board',
  templateUrl: './planning-board.component.html',
  styleUrls: ['./planning-board.component.scss'],
})
export class PlanningBoardComponent implements OnInit {
  constructor(private courseService: CourseService) {}

  todo: ICourse[] = [];

  done: ICourse[] = [];

  availableCourses: ICourse[] = [];

  semesterList: ICourse[][] = [];

  ngOnInit(): void {
    console.debug('Dashboard init');
    this.getDoneCourses();
    this.getTodoCourses();
    this.getAvailableCourses();
    this.semesterList = [
      this.todo,
      this.done,
      this.todo,
      this.done,
      this.todo,
      this.done,
      this.todo,
      this.done,
      this.todo,
      this.done,
    ];
  }

  getTodoCourses(): void {
    this.courseService
      .getTodoCourses()
      .subscribe((courses) => (this.todo = courses));
  }

  getDoneCourses(): void {
    this.courseService
      .getDoneCourses()
      .subscribe((courses) => (this.done = courses));
  }

  getAvailableCourses(): void {
    this.courseService
      .getAvailableCourses()
      .subscribe((courses) => (this.availableCourses = courses));
  }

  drop(event: CdkDragDrop<ICourse[]>) {
    // https://blog.logrocket.com/angular-state-management-made-simple-with-ngrx/
    // https://www.learnrxjs.io/learn-rxjs/subjects/behaviorsubject

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

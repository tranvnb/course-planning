import { Component, OnInit } from '@angular/core';
import { ICourse } from '../../interfaces/ICourse';
import { CourseService } from '../../services/course.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ISemester } from '../../interfaces/ISemester';

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

  semesterList: ISemester[] = [];

  ngOnInit(): void {
    console.debug('Dashboard init');
    this.getDoneCourses();
    this.getTodoCourses();
    this.getAvailableCourses();
    this.getSemesters();
  }

  getSemesters(): void {
    this.courseService.getSemesters().subscribe(sem => this.semesterList=sem)
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
      // emit an event to notify the item changed
      if (event.previousContainer.id === "available-courses") { // need inject token for this constant value
        this.courseService.addCourseToSemester(event.item.data, this.semesterList[parseInt(event.container.id)])
      } else {
        this.courseService.removeCourseFromSemester(event.item.data as ICourse, this.semesterList[parseInt(event.container.id)])
      }
      console.log(event.previousContainer.data, event.container.data[event.currentIndex])
      // console.log(event.previousContainer.id)
      // console.log(event.container.id)
    }
  }

  addNewSemester(): void {
    this.courseService.addSemester()
  }

  removeSemester(semester: ISemester): void {
    this.courseService.deleteSemester(semester)
  }
}

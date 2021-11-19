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
    this.courseService.fetchAllData().subscribe(() => {
      this.getAvailableCourses();
      this.getSemesters();
    });
  }

  getSemesters(): void {
    this.courseService
      .getSemesters()
      .subscribe((sem) => (this.semesterList = sem));
  }

  getAvailableCourses(): void {
    this.courseService
      .getAvailableCourses()
      .subscribe((courses) => (this.availableCourses = courses));
  }

  drop(event: CdkDragDrop<ICourse[]>) {
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
      // if (event.previousContainer.id === 'available-courses') {
      //   // need inject token for this constant value
      //   this.courseService.addCourseToSemester(
      //     event.container.data[event.currentIndex],
      //     this.semesterList[parseInt(event.container.id)]
      //   );
      // } else {
      //   this.courseService.removeCourseFromSemester(
      //     event.container.data[event.currentIndex],
      //     this.semesterList[parseInt(event.container.id)]
      //   );
      // }
    }
  }

  addNewSemester(): void {
    this.courseService.addSemester();
  }

  removeSemester(semester: ISemester): void {
    this.courseService.deleteSemester(semester);
  }
}

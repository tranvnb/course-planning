import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICourse } from '../../interfaces/ICourse';

@Component({
  selector: 'cp-semester-courses',
  templateUrl: './semester-courses.component.html',
  styleUrls: ['./semester-courses.component.scss'],
})
export class SemesterCoursesComponent implements OnInit {
  @Input()
  courses: ICourse[] = [];

  @Output()
  onItemDrop: EventEmitter<CdkDragDrop<ICourse[]>> = new EventEmitter<
    CdkDragDrop<ICourse[]>
  >();

  constructor() {}

  ngOnInit(): void {
    console.log("Semester init")
  }

  drop(event: CdkDragDrop<ICourse[]>): void {
    this.onItemDrop.emit(event);
  }

  delete($event: Number) {
    console.log($event);
  }
}

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ICourse } from '../../interfaces/ICourse';

@Component({
  selector: 'cp-available-courses',
  templateUrl: './available-courses.component.html',
  styleUrls: ['./available-courses.component.scss'],
})
export class AvailableCoursesComponent implements OnInit {
  @Input("availableCourses")
  courses: ICourse[] = [];

  @Output()
  onItemDrop: EventEmitter<CdkDragDrop<ICourse[]>> = new EventEmitter<
    CdkDragDrop<ICourse[]>
  >();

  constructor() {}

  ngOnInit(): void {
    console.debug('Available courses init');
  }

  drop(event: CdkDragDrop<ICourse[]>) {
    this.onItemDrop.emit(event);
  }
}

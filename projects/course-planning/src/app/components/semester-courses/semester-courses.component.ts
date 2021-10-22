import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ICourse } from '../../interfaces/ICourse';
import { ISemester } from '../../interfaces/ISemester';

@Component({
  selector: 'cp-semester-courses',
  templateUrl: './semester-courses.component.html',
  styleUrls: ['./semester-courses.component.scss'],
})
export class SemesterCoursesComponent implements OnInit {

  @Input()
  index: number = -1

  @Input() 
  semester: ISemester =  {
    id: -1,
    title:"",
    courses: []
  };

  @Output()
  itemDrop: EventEmitter<CdkDragDrop<ICourse[]>> = new EventEmitter<
    CdkDragDrop<ICourse[]>
  >();

  @Output()
  removeSemester: EventEmitter<ISemester> = new EventEmitter<ISemester>()

  constructor() {
  }

  ngOnInit(): void {
    console.log('Semester init');
  }

  drop($event: CdkDragDrop<ICourse[]>): void {
    this.itemDrop.emit($event);
  }

  delete($event: ISemester) {
    console.log($event)
    this.removeSemester.emit($event)
  }
}

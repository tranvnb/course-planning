import { Component, Input, OnInit } from '@angular/core';
import { ICourse } from '../../interfaces/ICourse';
import { StreamEnum } from '../../interfaces/IStream';

@Component({
  selector: 'cp-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  @Input()
  course!: ICourse;

  isTechStream: boolean = false;
  isDataStream: boolean = false;

  isSecurityStream: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.isTechStream =
      this.course.streams?.filter((s) => s === StreamEnum.TECH).length !== 0;

    this.isDataStream =
      this.course.streams?.filter((s) => s === StreamEnum.DATA).length !== 0;

    this.isSecurityStream =
      this.course.streams?.filter((s) => s === StreamEnum.SECURITY).length !==
      0;
  }
}

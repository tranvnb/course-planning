import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IProgress } from '../../interfaces/IProgress';
import { StreamEnum } from '../../interfaces/IStream';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'cp-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit, OnChanges {
  constructor(private courseService: CourseService) {}

  @Input()
  progress!: IProgress;

  percentCompleted: number[] = [];
  percentTechCompleted: number = 0;
  percentDataCompleted: number = 0;
  percentSecurityCompleted: number = 0;

  ngOnInit(): void {
    this.courseService.getProgramProgress().subscribe((p) => {
      Object.keys(p).forEach((k) => {
        switch (k) {
          case StreamEnum.TECH:
            this.percentTechCompleted =
              (p[StreamEnum.TECH].completedCredit * 100) /
              p[StreamEnum.TECH].totalCredit;
            break;
          case StreamEnum.DATA:
            this.percentDataCompleted =
              (p[StreamEnum.DATA].completedCredit * 100) /
              p[StreamEnum.DATA].totalCredit;
            break;
          case StreamEnum.SECURITY:
            this.percentSecurityCompleted =
              (p[StreamEnum.SECURITY].completedCredit * 100) /
              p[StreamEnum.SECURITY].totalCredit;
            break;
        }
        console.log();
      });
    });
  }

  ngOnChanges(changes: any) {
    console.log(
      'this.progress progress component - ngOnChange',
      changes.progress
    );
  }
}

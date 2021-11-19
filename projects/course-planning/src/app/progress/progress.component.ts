import { Component, Input, OnInit } from '@angular/core';
import { IProgress } from '../interfaces/IProgress';

@Component({
  selector: 'cp-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit {
  constructor() {}

  @Input()
  progress?: IProgress;

  ngOnInit(): void {}
}

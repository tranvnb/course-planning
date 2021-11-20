import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { AvailableCoursesComponent } from './components/available-courses/available-courses.component';
import { PlanningBoardComponent } from './components/planning-board/planning-board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SemesterCoursesComponent } from './components/semester-courses/semester-courses.component';
import { CourseComponent } from './components/course/course.component';
import { HttpClientModule } from '@angular/common/http';
import { ProgressComponent } from './components/progress/progress.component';

@NgModule({
  declarations: [
    AppComponent,
    AvailableCoursesComponent,
    PlanningBoardComponent,
    SemesterCoursesComponent,
    CourseComponent,
    ProgressComponent,
  ],
  imports: [
    HttpClientModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatProgressBarModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
  ],
  providers: [Title],
  bootstrap: [AppComponent],
})
export class AppModule {}

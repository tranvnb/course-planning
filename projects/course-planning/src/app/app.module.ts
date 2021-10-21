import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { AvailableCoursesComponent } from './components/available-courses/available-courses.component';
import { PlanningBoardComponent } from './components/planning-board/planning-board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SemesterCoursesComponent } from './components/semester-courses/semester-courses.component';
import { CourseComponent } from './components/course/course.component';

@NgModule({
  declarations: [
    AppComponent,
    AvailableCoursesComponent,
    PlanningBoardComponent,
    SemesterCoursesComponent,
    CourseComponent,
  ],
  imports: [
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

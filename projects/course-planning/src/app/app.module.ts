import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { AvailableCoursesComponent } from './available-courses/available-courses.component';
import { PlanningBoardComponent } from './planning-board/planning-board.component';

@NgModule({
  declarations: [
    AppComponent,
    AvailableCoursesComponent,
    PlanningBoardComponent,
  ],
  imports: [
    MatCardModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

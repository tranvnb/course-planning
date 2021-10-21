import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanningBoardComponent } from './planning-board/planning-board.component';

const routes: Routes = [
  { path: 'dashboard', component: PlanningBoardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

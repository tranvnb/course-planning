import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ICourse } from '../interfaces/ICourse';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor() {}

  getAvailableCourses(): Observable<ICourse[]> {
    const availabeCourses = of([
      { title: 'get to work' },
      { title: 'picup groceries' },
      { title: 'run earrand' },
    ]);
    return availabeCourses;
  }

  getTodoCourses(): Observable<ICourse[]> {
    const todoCourses = of([
      { title: 'To do 1' },
      { title: 'to do 2' },
      { title: 'To do 3' },
    ]);
    return todoCourses;
  }

  getDoneCourses(): Observable<ICourse[]> {
    const doneCourses = of([{ title: 'get up' }, { title: 'take a shower' }]);
    return doneCourses;
  }
}

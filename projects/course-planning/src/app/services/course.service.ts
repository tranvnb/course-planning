import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ICourse } from '../interfaces/ICourse';
import { ISemester } from '../interfaces/ISemester';
import { CoursePrerequisite } from '../interfaces/CoursePrerequisites';
import { DEFAULT_COURSES, COURSE_PREREQUISITES } from './program-courses';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private semesterCount: number = 1;

  // private semesterList1: ISemester[] = [
  //   {title: "Semester 1", courses: [{ title: 'CSIS 1175' },]}
  // ]

  private semesterList = new BehaviorSubject<ISemester[]>([
    // {id: 0, title: "Semester 1", courses: [{ title: 'CSIS 1175' }]}
  ]);

  private program = {};

  private availableCourses = new BehaviorSubject<ICourse[]>(DEFAULT_COURSES);
  private coursePrerequisite: CoursePrerequisite[] = COURSE_PREREQUISITES;

  constructor() {}

  getAvailableCourses(): Observable<ICourse[]> {
    return this.availableCourses.asObservable();
  }

  getTodoCourses(): Observable<ICourse[]> {
    const todoCourses = of([]);
    return todoCourses;
  }

  getDoneCourses(): Observable<ICourse[]> {
    const doneCourses = of([]);
    return doneCourses;
  }

  getSemesters(): Observable<ISemester[]> {
    return this.semesterList;
  }

  deleteSemester(semester: ISemester): void {
    // return courses to the available list
    this.availableCourses.next([
      ...this.availableCourses.getValue(),
      ...semester.courses,
    ]);
    this.semesterList.next(
      this.semesterList.value.filter((s) => s.id !== semester.id)
    );
    this.updateAvailableCourses();
  }

  addSemester(): void {
    this.semesterCount++;
    this.semesterList.next([
      ...this.semesterList.getValue(),
      {
        id: this.semesterCount,
        title: 'Semester ' + (this.semesterList.getValue().length + 1),
        courses: [],
      },
    ]);
    this.updateAvailableCourses();
  }

  addCourseToSemester(course: ICourse, semester: ISemester): void {
    console.log('Added course ', course, 'to semester ', semester);
  }

  removeCourseFromSemester(course: ICourse, semester: ISemester): void {
    // if (semester.courses.length === 0 && )
    console.log('Remove course ', course, 'to semester ', semester);
  }

  private updateAvailableCourses() {
    const values: ISemester[] = this.semesterList.getValue();
    const tookCourse = values
      .slice(0, values.length - 1)
      .flatMap((sem) => sem.courses);

    // get all available courses base on took courses
    const allAvailableCourse = this.coursePrerequisite
      .filter(
        (reqCourse) =>
          reqCourse.prerequisites?.length === 0 ||
          reqCourse.prerequisites?.some((set) =>
            set.every((courseId) =>
              tookCourse.find((took) => took.courseId === courseId)
            )
          )
      )
      .map(
        (result) =>
          <ICourse>{
            courseId: result.courseId,
            title: result.title,
            credit: result.credit,
          }
      );
    // then filter with current took course and current working semester
    const workingSemester = values[values.length - 1]?.courses;
    this.availableCourses.next(
      allAvailableCourse.filter(
        (c) =>
          !tookCourse.find((t) => t.courseId === c.courseId) &&
          !workingSemester.find((w) => w.courseId === c.courseId)
      )
    );
  }
}

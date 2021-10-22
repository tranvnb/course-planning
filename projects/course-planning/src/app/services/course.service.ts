import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ICourse } from '../interfaces/ICourse';
import { ISemester } from '../interfaces/ISemester'

type CoursePrerequisite = {
  courseId: string,
  // sastified: Boolean
  // required: {
  //   [key: string]: String[]
  // }[]
  required: String[][]
};

@Injectable({
  providedIn: 'root',
})
export class CourseService {


  private semesterCount: number = 1

  // private semesterList1: ISemester[] = [
  //   {title: "Semester 1", courses: [{ title: 'CSIS 1175' },]}
  // ]

  private semesterList = new BehaviorSubject<ISemester[]>(
    [
      // {id: 0, title: "Semester 1", courses: [{ title: 'CSIS 1175' }]}
    ]
  )

  private availableCourses = new BehaviorSubject<ICourse[]>([
    { courseId: "CSIS 1175", title: 'CSIS 1175' },
    { courseId: "CSIS 1275", title: 'CSIS 1275' },
    { courseId: "CSIS 2200", title: 'CSIS 2200' },
    { courseId: "CSIS 2260", title: 'CSIS 2260' },
    { courseId: "CSIS 2270", title: 'CSIS 2270' },
  ])
  private coursePrerequisite: CoursePrerequisite[] = [
    {courseId: "CSIS 1175", required: []},
    {courseId: "CSIS 1275", required: []},
    {courseId: "CSIS 2200", required: []},
    {courseId: "CSIS 2260", required: []},
    {courseId: "CSIS 2270", required: []},
    {courseId: "CSIS 2300", required: [["CSIS 2200"]]},
    {courseId: "CSIS 3155", required: [["CSIS 2260"],["CSIS 2270"]]},
    {courseId: "CSIS 3175", required: [["CSIS 1275"], ["CSIS 2175"]]},
    {courseId: "CSIS 3275", required: [["CSIS 2200", "CSIS 1275"], ["CSIS 2200", "CSIS 2175"]]},
  ]

  constructor() {}

  getAvailableCourses(): Observable<ICourse[]> {
    return this.availableCourses.asObservable();
  }

  getTodoCourses(): Observable<ICourse[]> {
    const todoCourses = of([
    ]);
    return todoCourses;
  }

  getDoneCourses(): Observable<ICourse[]> {
    const doneCourses = of([]);
    return doneCourses;
  }

  getSemesters(): Observable<ISemester[]> {
    return this.semesterList
  }

  deleteSemester(semester: ISemester): void {
    // return courses to the available list
    this.availableCourses.next([...this.availableCourses.getValue(), ...semester.courses])
    this.semesterList.next(this.semesterList.value.filter(s => s.id !== semester.id))
    this.updateAvailableCourses()
  }

  addSemester(): void {
    this.semesterCount++;
    this.semesterList.next([
      ...this.semesterList.getValue(),
      {id: this.semesterCount ,title: "Semester " + (this.semesterList.getValue().length + 1), courses:[]}])
    this.updateAvailableCourses()
  }

  addCourseToSemester(course: ICourse, semester: ISemester): void {
    console.log("Added course ", course, "to semester ", semester);
  }

  removeCourseFromSemester(course: ICourse, semester: ISemester): void {
    // if (semester.courses.length === 0 && )
    console.log("Remove course ", course, "to semester ", semester);
  }

  private updateAvailableCourses() {
    const values: ISemester[] = this.semesterList.getValue()
    const tookCourse = values.slice(0, values.length - 1).flatMap(sem => sem.courses)

    // get all available courses base on took courses
    const allAvailableCourse = this.coursePrerequisite.filter(reqCourse => 
      reqCourse.required?.length === 0 
      || reqCourse.required?.some(set => set.every(courseId => tookCourse.find(took => took.courseId === courseId))))
      .map(result => <ICourse>{courseId: result.courseId, title: result.courseId})
    // then filter with current took course
    this.availableCourses.next(allAvailableCourse.filter(c => !tookCourse.find(t => t.courseId === c.courseId)))
  }

}

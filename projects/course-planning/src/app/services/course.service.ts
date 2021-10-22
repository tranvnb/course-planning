import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ICourse } from '../interfaces/ICourse';
import { ISemester } from '../interfaces/ISemester'

type CoursePrerequisite = {
  courseId: string;
  title: string;
  credit: number;
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
    { courseId: "CSIS 1175", title: 'Introduction to Programming I', credit: 3 },
    { courseId: "CSIS 1275", title: 'Introduction to Programming II', credit: 3 },
    { courseId: "CSIS 2175", title: 'Adv Integrated Software Dev', credit: 3 },
    { courseId: "CSIS 2200", title: 'Systems Analysis and Design', credit: 3 },
    { courseId: "CSIS 2260", title: 'Operating Systems', credit: 3 },
    { courseId: "CSIS 2270", title: 'Virtualization and Computer Networking', credit: 3 },
  ])
  private coursePrerequisite: CoursePrerequisite[] = [
    {courseId: "CSIS 1175", title: 'Introduction to Programming I', credit: 3, required: []},
    {courseId: "CSIS 1275", title: 'Introduction to Programming II',credit: 3, required: []},
    {courseId: "CSIS 2175", title: 'Adv Integrated Software Dev', credit: 3, required: []},
    {courseId: "CSIS 2200", title: 'Systems Analysis and Design',credit: 3,required: []},
    {courseId: "CSIS 2260", title: 'Operating Systems',credit: 3,required: []},
    {courseId: "CSIS 2270", title: 'Virtualization and Computer Networking',credit: 3,required: []},
    {courseId: "CSIS 2300", title: 'Database I',credit: 3,required: [["CSIS 2200"]]},
    {courseId: "CSIS 3155", title: 'Computer Network Security',credit: 3,required: [["CSIS 2260"],["CSIS 2270"]]},
    {courseId: "CSIS 3175", title: 'Mobile Application Development I',credit: 3,required: [["CSIS 1275"], ["CSIS 2175"]]},
    {courseId: "CSIS 3160", title: 'Evidence Imaging',credit: 3,required: [["CSIS 2260"]]},
    {courseId: "CSIS 3275",title: 'Software Engineering',credit: 3, required: [["CSIS 2200", "CSIS 1275"], ["CSIS 2200", "CSIS 2175"]]},
    {courseId: "CSIS 3270", title: 'Advanced Networking',credit: 3,required: [["CSIS 2270"]]},
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
      .map(result => <ICourse>{courseId: result.courseId, title: result.title, credit: result.credit})
    // then filter with current took course and current working semester
    const workingSemester = values[values.length - 1]?.courses
    this.availableCourses.next(allAvailableCourse.filter(c => !tookCourse.find(t => t.courseId === c.courseId) && !workingSemester.find(w => w.courseId === c.courseId)))
  }

}

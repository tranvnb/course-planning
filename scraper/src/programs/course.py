import json
from json import JSONEncoder

class Course:
  title = ""
  credit = 3
  url = ""
  prerequisites = [[]]
  prerequisitesStr = ""
  course_code = "CSIS"

  def __init__(self):
    self.title = ""
    self.credit = 3
    self.url = ""
    self.prerequisites = [[]]
    self.prerequisitesStr = ""
    self.course_code = "CSIS"

  @classmethod
  def withParameters(self, url, code, title, credit, prerequisitesStr):
      course = Course()
      course.url = url
      course.course_code = code
      course.title = title
      course.credit = credit
      course.prerequisites = [[]]
      course.prerequisitesStr = prerequisitesStr.replace('\u00a0'," ").replace('\u201c', "").replace('\u201d', "").replace('\n', "")
      return course

  def __str__(self):
    return self.title + " = " + self.url + " = " + self.credit

  def toString(self):
    return self.title + " = " + self.url + " = " + self.credit
  
  # def __repr__(self):
  #       return json.dumps(self.__dict__)

class CourseEncoder(JSONEncoder):
      def default(self, o):
          return o.__dict__
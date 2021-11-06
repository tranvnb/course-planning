class Course:
  title = ""
  credit = 3
  url = ""
  prerequisites = []
  prerequisitesStr = ""

  def __init__(self):
    pass

  @classmethod
  def withParameters(self, url, title, credit):
      course = Course()
      course.url = url
      course.title = title
      course.credit = credit
      return course

  def __str__(self):
    return self.title + " = " + self.url + " = " + self.credit

  def toString(self):
    return self.title + " = " + self.url + " = " + self.credit
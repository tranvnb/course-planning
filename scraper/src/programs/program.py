import unicodedata
from bs4 import BeautifulSoup
import requests
import re
import sys
import os.path
import json

from course import Course
from course import CourseEncoder
# sys.path.append(
#     os.path.abspath(os.path.join(os.path.dirname(__file__), "../authen")))
# from authentication import Authentication
class Program:

    # PBDCIS: https://www.douglascollege.ca/programs-courses/catalogue/programs/PBDCIS
    supported_program = ["PBDCIS"]

    current_path = os.path.dirname(os.path.realpath(__file__))

    domain_name = "https://www.douglascollege.ca"

    def __init__(self, program_id = ""):
        self.program_id = program_id

    def get_file_content(self, filename):
        file = open(filename, 'r')
        result = file.read()
        file.close()
        return result

    def save_file_content(self, filename, file_content):
        file = open(filename, 'w')
        file.write(file_content)
        file.close()

    def requestHeaders(self):
        headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
		'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
		'Accept-Encoding': 'none',
		'Accept-Language': 'en-US,en;q=0.8',
		'Connection': 'keep-alive'}
        return headers

    def extract_course_detail(self, tag, stream = 0, opt_num = 0):
        cols = tag.find_all("td")
        course = Course()
        detail = []
        #exit if the col (td tag) does not have any data
        if len(cols) <= 1:
            return None

        if (len(cols[0].find_all("a")) > 1):
            atags = cols[0].find_all("a")
            return [
                Course.withParameters(
                    atags[0]["href"], 
                    atags[0].get_text().strip(),
                    cols[1].get_text().strip().split("\nOR\n")[0], 
                    cols[2].get_text().strip(), 
                    unicodedata.normalize("NFKD",self.extract_course_prerequisites(atags[0]["href"]))
                ),
                Course.withParameters(
                    atags[1]["href"], 
                    atags[1].text,
                    cols[1].get_text().strip().split("\nOR\n")[1], 
                    cols[2].get_text().strip(),
                    unicodedata.normalize("NFKD",self.extract_course_prerequisites(atags[1]["href"]))
                )
            ]
        else: 
            if cols[0] is not None and cols[0].find("a") is not None:
                detail.append(cols[0].find("a")["href"])
                course.url = cols[0].find("a")["href"]
                course.course_code = cols[0].find("a").text
                course.prerequisitesStr = unicodedata.normalize("NFKD",self.extract_course_prerequisites(cols[0].find("a")["href"]))
            else: 
                return None

            if cols[1] is not None and cols[1].get_text() is not None:
                detail.append(cols[1].get_text().strip())            
                course.title = cols[1].get_text().strip()
            else:
                return None

            if cols[2] is not None and cols[2].get_text() is not None:
                detail.append(cols[2].get_text().strip())            
                course.credit = cols[2].get_text().strip()
            else:
                return None

        if len(detail) > 0:
            detail.append(stream)
            detail.append(opt_num)

        return course

    def PBDCIS_program(self):
        stream1 = []
        stream2 = []
        stream3 = []
        first_year = []
        secondYear = []

        # get html content from douglas website
        url = self.domain_name + "/course/csis-4495"
        
        # result = requests.get(url, headers=self.requestHeaders())		
        # self.save_file_content(self.current_path + "/4495-prerequisites.txt", result.text)
        
        # url = self.domain_name + "/program/pbdcis"
        # result = requests.get(url, headers=self.requestHeaders())		
        # self.save_file_content(self.current_path + "/data.txt", result.text)
        # soup = BeautifulSoup(result.text, "html.parser")

        result = self.get_file_content(self.current_path + "/data.txt")
        soup = BeautifulSoup(result, "html.parser")
        
        course_table = soup.find(id='block-views-block-program-guidelines-block-4').find("table")
        year1 = "Year I Coursework" 
        year2 = "Year II Coursework"
        sel_option_1 = "Select one of the following 2 options"
        sel_option_2 = "Select one of the following two options:"
        require_courses = "Required courses" 
        total_year1 = "Total Year I Credits"
        year2_op1 = "Option 1 - Emerging Technology Stream"
        year2_op2 = "Option 2 - Data Analytics Stream" 
        year2_op3 = "Option 3 - CyberSecurity Stream" 
        mini_stream = "Choose one of the following mini-streams" 
        mini1 = "Business" 
        mini2 = "CSIS " 
        mini3 = "Marketing"
        total_year2 = "Total Year II Credits"

        index = 0
        options = []

        row_tags = course_table.find_all("tr")

        # ========== "Year I Coursework" ========== 

        while (index < len(row_tags) and not re.search(sel_option_1, str(row_tags[index]))):
            index += 1				

        index += 1

        # ========== "Select one of the following 2 options: ========== 

        while (index < len(row_tags) and not re.search(sel_option_1, str(row_tags[index]))):
            course_detail = self.extract_course_detail(row_tags[index], 0, 1)
            if course_detail != None: options.append(course_detail)
            index += 1

        first_year.append(options.copy())
        options.clear()

        index += 1

        # ==========  "Select one of the following 2 options:" ========== 

        while (index < len(row_tags) and not re.search(require_courses, str(row_tags[index]))):
            course_detail = self.extract_course_detail(row_tags[index], 0, 2)
            if course_detail != None: options.append(course_detail)
            index += 1

        first_year.append(options.copy())
        options.clear()

        index += 1

        # ========== "Required courses"  ========== 

        while (index < len(row_tags) and not re.search(sel_option_2, str(row_tags[index]))):
            course_detail = self.extract_course_detail(row_tags[index], 0, 0)
            if course_detail != None: first_year.append(course_detail)			            
            index += 1

        index += 1		
        
        # ========== "Select one of the following two options" ========== 

        #third option of year 1, this will end at "Total Year I Credits"
        while (index < len(row_tags) and not re.search(total_year1, str(row_tags[index]))):
            course_detail = self.extract_course_detail(row_tags[index], 0, 3)
            if course_detail != None: options.append(course_detail)
            index += 1
        
        first_year.append(options.copy())
        options.clear()

        # ========== "Total Year I Credits" ========== 
        # Year II Coursework
        # Option 1 - Emerging Technology Stream

        while (index < len(row_tags) and not re.search(sel_option_1, str(row_tags[index]))):
            index += 1				

        index += 1

        #==========  Select one of the following 2 options: ========== 

        while (index < len(row_tags) and not re.search(require_courses, str(row_tags[index]))):			
            course_detail = self.extract_course_detail(row_tags[index], 1, 1)
            if course_detail != None: options.append(course_detail)
            index += 1

        stream1.append(options.copy())
        options.clear()

        index += 1

        #==========  Required courses ========== 
        
        while (index < len(row_tags) and not re.search(year2_op2, str(row_tags[index]))):			            
            course_detail = self.extract_course_detail(row_tags[index], 1, 0)
            if course_detail != None: stream1.append(course_detail)
            index += 1

        #==========  Option 2 - Data Analytics Stream ========== 

        #move to 1st option of year 2, stream 2
        while (index < len(row_tags) and not re.search(sel_option_1, str(row_tags[index]))):						
            index += 1

        index += 1

        #==========  Select one of the following 2 options ========== 

        while (index < len(row_tags) and not re.search(require_courses, str(row_tags[index]))):			
            course_detail = self.extract_course_detail(row_tags[index], 2, 1)
            if course_detail != None: options.append(course_detail)
            index += 1

        stream2.append(options.copy())
        options.clear()

        index += 1

        #==========  Required courses ========== 

        while (index < len(row_tags) and not re.search(mini_stream, str(row_tags[index]))):			
            course_detail = self.extract_course_detail(row_tags[index], 2, 0)
            if course_detail != None: stream2.append(course_detail)
            index += 1

        index += 1

        # ==========  Choose one of the following mini-streams ========== 

        while (index < len(row_tags) and not re.search(mini1, str(row_tags[index]))):						
            index += 1


        ministream = []
        # ==========  Business ========== 

        while (index < len(row_tags) and not re.search(mini2, str(row_tags[index]))):			
            course_detail = self.extract_course_detail(row_tags[index], 2, 11)
            if course_detail != None: 
                options.append(course_detail)
            index += 1

        ministream.append(options.copy())
        options.clear()

        #==========  CSIS ========== 
        while (index < len(row_tags) and not re.search(mini3, str(row_tags[index]))):			
            course_detail = self.extract_course_detail(row_tags[index], 2, 12)
            if course_detail != None: 
                options.append(course_detail)
            index += 1

        ministream.append(options.copy())
        options.clear()

        # ==========  Marketing ========== - THIS IS SPECIAL COL, NEED MANUALEDITING <a href="/course/mark-4360">MARK 4360</a> Customer Relationship Management

        while (index < len(row_tags) and not re.search(year2_op3, str(row_tags[index]))):			
            course_detail = self.extract_course_detail(row_tags[index], 2, 13)
            if course_detail != None:
                if (isinstance(course_detail, list)):
                    options = list(map(lambda item : [item, *options], course_detail))
                else: 
                    options.append(course_detail)
            index += 1

        ministream = [*ministream, *options]
        options.clear()

        # print(ministream)

        index += 1

        stream2.append(ministream.copy())

        # ========== Option 3 - CyberSecurity Stream ========== 

        while (index < len(row_tags) and not re.search(total_year2, str(row_tags[index]))):	            
            course_detail = self.extract_course_detail(row_tags[index], 3, 0)
            if course_detail != None: stream3.append(course_detail)
            index += 1

        # Total Year II Credits

        dictionary = {
            "first_year" : first_year,
            "second_year": {
                "emmerge-tech" : stream1, 
                "data-analysis": stream2, 
                "security": stream3
            }
        }
        
        json_object = json.dumps(dictionary, indent=2, cls=CourseEncoder)
        #remove special & unseen characters \u00a0 \u201c \u201d \n

        self.save_file_content(self.current_path + "/program-pathway.json", json_object)

    def extract_all_courses_of_program(self, program_id):
        if program_id in self.supported_program:
            # self.PBDCIS_program()
            print("Scraping program: " + sys.argv[1])
            func = getattr(self, program_id + "_program")
            func()
        else:
            print("The program " + program_id + " has not been supported yet")

    def export_json_file(self, filename, dictionary):
        with open(filename, "w") as outfile:
            json.dump(dictionary, outfile)

    def extract_course_prerequisites(self, course_url):
        result = ""
        # self.domain_name = "https://www.douglascollege.ca"
        # course_url = "/course/csis-4495" 
        # course_url = "/course/csis-4050"

        url = self.domain_name + course_url
        html_result = requests.get(url, headers=self.requestHeaders())
        soup = BeautifulSoup(html_result.text, "html.parser")
        
        # self.save_file_content(self.current_path + "/4050-prerequisites.txt", html_result.text)

        # html_result = self.get_file_content(self.current_path + "/4050-prerequisites.txt")
        # html_result = self.get_file_content(self.current_path + "/4495-prerequisites.txt")
        # soup = BeautifulSoup(html_result, "html.parser")
        prerequisites = soup.find(id='block-views-block-course-guidlines-block-3').find('div',{"class":'field--name-field-prerequisites'})
        # all_p_tags = prerequisites.findAll('p')
        
        # 4495
        # print(prerequisites.text) # ul > li
        
        # 4050
        # print(all_p_tags[0].text)
        # print(all_p_tags[1].text)
        # print(all_p_tags[2].text)
        
        result = prerequisites.text

        return result

    @staticmethod
    def run():             
        if len(sys.argv) == 1:
            print("You have to specify the program Id.")
        else:        
            pg = Program()
            pg.extract_all_courses_of_program(sys.argv[1])
            # pg.extract_course_prerequisites("","")

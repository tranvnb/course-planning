## Setup Virtual Environment

Install and update python library, make sure `venv` was installed on the system

```bash
  $ sudo apt update && sudo apt install python
  $ sudo apt install python3-venv
```

Run `python3 -m venv .` to init virtual development environment

Run `source bin/activate` to activate the virtual environment

Run `python -m pip install --upgrade pip` to update latest pip

Run `deactivate` to deactivate environment.

## Dependencies

Run `pip list` to list all installed packages

Run `pip uninstall -r requirements.txt -y` to remove all dependencies

Run `pip install beautifulsoup4 && pip install requests` to install required packges

Run `pip freeze > requirements.txt` to save all install packages

## Running application

Run `python3 src/program PBDCIS` to fetch data.

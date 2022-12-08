# TALES

Co-authors: [Alexis Gueguen](https://github.com/awgueguen) | [Théo Sanchez](https://github.com/Theo-Sanchez) | [Anicet Célérier](https://github.com/AnicetCelerier)

This project was made using:

[![python max version](https://img.shields.io/badge/Python-3.10.8-green.svg)](https://shields.io/)
[![npm version](https://img.shields.io/badge/npm-8.19.2-blue.svg)](https://shields.io/)
[![postgres version](https://img.shields.io/badge/PostgreSQL-14.2-yellow.svg)](https://shields.io/)
[![sass version](https://img.shields.io/badge/sass-1.52-pink.svg)](https://shields.io/)

It supports up to Python 3.10.8.

#

[Getting started](#getting-started) | [Run the application](#run-the-application) | [Project Description](#) | [Roadmap](#)

## Getting started

### WINDOWS

To install our app on Windows, the easiest way is to use the `install.bat` file. Please be sure to have already Python, Node (npm) and PostgreSQL installed.

```powershell
# you must execute the file while being the main folder.
$ usr/tales> install.bat
```

If you want to install every components one by one, please follow the Linux installation process while adapting some of the cmd line.
They are exactly the same process inclueded in the `install.bat` script file.

### Linux

To install **Tales** on Linux, please follow the next steps:

#

**Step 1: Database**

```bash
# start by creating the database
$ > psql -U username
> postgres= DROP DATABASE dcdb; # only if you already have a db with the same name
> postgres= CREATE DATABASE dcdb;
> postgres= \q
```

#

**Step 2: Backend**

```bash
# venv installation process
$ usr/tales> cd backend
$ tales/backend> python -m venv env

# venv activation & packages installation
$ tales/backend> source env/bin/activate
$ (env) tales/backend> pip install -r requirements.txt
```

While staying in the virtual environnement, you then need to create an `.env` file at the root of the project, if you don't know what process to follow, you can do the following:

-   create an empty file
-   write on the first line: `DJANGO_SECRET_KEY = ""`
-   in your terminal, use the following cmd:

```bash
$ (env) usr/tales> python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

-   copy and paste the result between the two double quotes.

```bash
# djangorest installation
$ (env) tales/backend> python manage.py makemigrations tales
$ (env) tales/backend> python manage.py migrate
```

Before installing the Frontend part of the application, let's take advantage of the fact that our virtual environnement is still up.

We'll now create some data to populate our database and the entire app. Those will help you have a bette idea of the general mood. It will also give you some credentials giving you access to fake accounts. The file is stored in: `../tales/backend/tales/password.txt`

```bash
# populate database
$ (env) tales/backend> python manage.py createdata
```

You can adjust the requested input in order to experience different usage scenarios.

#

**Step 3: Frontend**

The simpliest part left! You are one cmd line away from having everything setup and run both front & back servers.

```bash
$ usr/tales> cd frontend
$ tales/frontend> npm i
```

#

## Run the application

### Windows

Again, you have nothing to do, just execute the `runserver.bat` batch file.

```powershell
$ usr/tales> runserver.bat
# please note that it will open a new terminal window in order to support the two servers running.
```

### Linux

On Linux, you'll have to open to different shell window, each will be use to host respectively the front and back end.

You'll just need to execute the two following cmd in each:

```bash
# backend | don't forget to activate your venv
$ (env) tales/backend> python manage.py runserver
```

```bash
# frontend
$ tales/frontend> npm start
```

### Optional

If you want to make some edit to the different SASS files, and have already pre-installed the tool, you'll need to use the following command in another shell window:

```bash
$ tales/frontend/src> sass --watch styles/main.scss App.css
```

If you want to reset the creation of fake data, you can always execute the following command, it will flush the previous database in order to reset it:

```bash
$ tales/backend> python manage.py createdata
```

#

## Project Description

#

## Roadmap

#

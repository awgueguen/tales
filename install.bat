:: WINDOWS SCRIPT USED TO INSTALL DJANGO & NPM
@ECHO OFF
setlocal EnableDelayedExpansion

ECHO.
ECHO -----------------------------------------------------------------
ECHO [92mTALES V0.1-a[0m 
ECHO -----------------------------------------------------------------
ECHO.

ECHO Informations ----------------------------------------------------
ECHO.
ECHO Before installing our app, make sure that Postgres is correctly
ECHO added to the PATH.
ECHO [93mIf any issues are encountered, please terminate the script by 
ECHO either using the CTRL-C shortcut or \q in postgres.[0m 
ECHO No informations are stored whithin this script.
ECHO.
ECHO Requirements^: 
ECHO Python^<3.11, Node^/NPM, Postgres, SASS ^(only for edit^)
ECHO.
ECHO -----------------------------------------------------------------
ECHO.
set /p py=Python usual terminal cmd (e.g. py, python310, python): 
ECHO.
ECHO -----------------------------------------------------------------
ECHO [92mPostgreSQL Installation...[0m 
ECHO.
ECHO After connecting to postgres shell use the following cmd:
ECHO [93m$ postgres=# ^DROP DATABASE dcdb; ^(Optional^)[0m ^> reset dcdb database
ECHO [93m$ postgres=# ^CREATE DATABASE dcdb; [0m ^> create the app db.
ECHO [93m$ postgres=# ^\q [0m                    ^> resume the rest of the script.
ECHO.

:: Avoid to have the user having to start postgres
set /p input=postgres username: 
cmd /c "psql -U %input%"

ECHO.
ECHO -----------------------------------------------------------------
ECHO [92mVENV ^& PIP Installation...[0m 
ECHO.

CD /D backend

:: Using start, we can have another shell dealing with all the installation process
start cmd.exe /c "echo [92mMr.Anderson, welcome back... & %py% -m venv env & env\Scripts\activate & pip install -r requirements.txt & echo hello"
for /F %%a in ('copy /Z "%~F0" NUL') do set "CR=%%a"

set /a step=1

:: Loop to give some feedback to the user
:monitoring
if %step% == 1 set er=-ENV installation
if %step% == 2 set er=-PIP installation
timeout /t 1 >nul

FOR /L %%a IN (1,1,3) DO ( 

    call :animation
    set /P "=!er!!CR!" < NUL
    timeout /t 1 >nul
)

call :state

if %step% equ 1 set /P "=-ENV installation                !CR!" < NUL

if %step% equ 2 set /P "=-PIP installation                !CR!" < NUL

goto :monitoring

:end
:: Buffer to let the process finish completely.

ECHO.
ECHO -----------------------------------------------------------------
ECHO [92mDJANGOrest Installation...[0m 
timeout /t 10 >nul
ECHO.

CD /D ../../..
cmd /c "env\Scripts\activate & %py% tales\management\getrandomskey.py"
ECHO [93mDjango secret key generated in ^.env[0m 
cmd /c "env\Scripts\activate & %py% manage.py makemigrations tales & %py% manage.py migrate"

:: setup everything in Django
ECHO.
ECHO -----------------------------------------------------------------
ECHO [92mTales database population...[0m 
ECHO.

cmd /c "env\Scripts\activate & %py% manage.py createdata"
ECHO [93mDB population done using faker[0m 

:: add env creation & createdata
ECHO.
ECHO -----------------------------------------------------------------
ECHO [92mNPM Installation...[0m 
ECHO.

CD /D ../frontend
cmd /c "npm i"

ECHO.
ECHO -----------------------------------------------------------------
ECHO [93mEverything is now installed, to continue, please start runserver.bat[0m 
ECHO.

exit 

REM subroutine ----------------------------------------------------------------

:: Create the animation by adding .
:animation
set er=%er%.
goto :eof

:: Check at which step the installation of venv & pip is.
:state
if %step% equ 1 (
    CD /D env/Scripts
    for %%a in (*) do (
        if %%a equ python.exe (
            set /a step=2
            set /P "= [92m-ENV installation COMPLETE                [00m" < NUL
            ECHO.
        )
    )
    CD /D ../..
) else (
    CD /D env/Lib/site-packages
    for %%a in (*) do ( 
        if %%a equ autopep8.py (
            set /a step=2
            set /P "= [92m-PIP installation COMPLETE                [00m" < NUL
            ECHO.
            goto :end
        )
    )
    CD /D ../../..
)
goto :eof

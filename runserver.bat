:: WINDOWS SCRIPT USED TO RUN DJANGO & REACT
@ECHO OFF

ECHO[
ECHO -----------------------------------------------------------------
ECHO [92mTALES V0.1-a[0m 
ECHO -----------------------------------------------------------------
ECHO[
ECHO[

set /A success=0

for /d %%d in (*.*) do (   
    set "TRUE="
    if %%d equ backend set TRUE=1
    if %%d equ frontend set TRUE=1

    if defined TRUE (
        set /a "success=success+1"
    )
)

if %success% == 2 (
    start cmd.exe /C "echo [92m.....REACT starting.....[0m & cd frontend/src & npm start"
    cmd /c "echo [92m.....DJANGO starting..... & echo env activated...[0m & cd backend\env\Scripts & activate & cd ..\..\ & python manage.py runserver"
) else (
    ECHO Missing backend or frontend folder, check if at the root of the project.
)

PAUSE
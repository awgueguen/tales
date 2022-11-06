BACKEND :
WINDOWS :
cd backend
python -m venv env
./env/Scripts/activate
pip install -r requirements.txt
vérifier que l'intérpréteur est le bon -> sinon sélectionner dans Scripts/python.exe

python manage.py makemigration tales
-> créer une base de donnée VIERGE via psql nommée dcdb
python manage.py migrate
python manage.py runserver

---P

FRONTEND

npm i
npm start

nouveau terminal :

pour gérer des modifications sur le sass, ne pas le faire dans le fichier app.css sans :
sass --watch styles/main.scss App.css

---

DB
WINDOWS :
ouvrir via powershell : alt + shift + D
vision sur plusieurs aperçu : gestion de la db, sass si besoin, django, react
-> un pour le serveur django
-> un pour le serveur react
-> un pour sass

SCRIPTS

echo "-- début du script --"

cd backend/

echo -e "\n-- check venv installation --\n"
sudo pip3 install virtualenv

# vérifie que le module est bien installé

echo -e "\n# création de l'environnement virtuel\n"
python3 -m venv env

# installation de l'environnement dans le dossier

./env/Scripts/activate

# active temporairement le venv

echo -e "\n# installation via le fichier requirements.txt\n"
pip3 install --upgrade pip
pip3 install -r backend/requirements.txt

# installe les modules depuis le fichier requirements.txt

# définit un ensemble de variables, afin d'arrêter le développement et passer

# en production changer la ligne 20.

echo -e "\n-- fin du script --\n"

echo "pour lancer l'environnement :"
echo "./env/Scripts/activate"

echo -e "\n-- informations --\n"
echo "# la mention (env) doit être toujours visible dans le terminal lorsque vous travaillez sur ce projet"
echo "# il suffit de lancer flask via 'flask run' l'ENV de dev étant déjà défini dans le fichier .flaskenv"

---

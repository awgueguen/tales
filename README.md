# TALES

Co-authors: [Alexis Gueguen](https://link-url-here.org) | [Théo Sanchez](https://link-url-here.org) | [Anicet Célérier](https://link-url-here.org)

This project was made using:

[![python max version](https://img.shields.io/badge/Python-3.10.8-green.svg)](https://shields.io/)
[![npm version](https://img.shields.io/badge/npm-8.19.2-blue.svg)](https://shields.io/)
[![postgres version](https://img.shields.io/badge/PostgreSQL-14.2-yellow.svg)](https://shields.io/)
[![sass version](https://img.shields.io/badge/sass-1.52-pink.svg)](https://shields.io/)

It supports up to Python 3.10.8.

---

[Getting started](https://link-url-here.org) | [Run the application](https://link-url-here.org) | [Link text Here](https://link-url-here.org) | [Link text Here](https://link-url-here.org)

## Getting started

---

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

---

**Step 1: Database**

```bash
# start by creating the database
$ > psql -U username
> postgres= DROP DATABASE dcdb; # only if you already have a db with the same name
> postgres= CREATE DATABASE dcdb;
> postgres= \q
```

---

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

---

**Step 3: Frontend**

The simpliest part left! You are one cmd line away from having everything setup and run both front & back servers.

```bash
$ usr/tales> cd frontend
$ tales/frontend> npm i
```

---

## Run the application

---

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

```powershell
$ tales/frontend/src> sass --watch styles/main.scss App.css
```

---

### Contrat d'équipe :

<ins>Outils collab</ins>:
Git géré par Théo supervisé par Alexis, backlog géré par Alexis

<ins>Orga scrum</ins> :
Gros brief Lundi-Vendredi et petites entrevue quotidiennes si besoin
Sprint si possible + tenue du backlog pendant le projet
Le test des features est fait par un autre membre

On fixe à dessein des objectifs élevés qui ne seront pas vecteur de pression pendant le projet :
la période fait que d'autres enjeux peuvent être prioritaires (recherche de stage, entretiens ..)

<ins>Distanciel</ins>:
sans problème pendant toute la durée du projet du moment qu'on est capable de communiquer, notamment si on travaille à plusieurs sur une même feature.

##### Répartition des rôles :

_Alexis_ : Scrum Master
_Anicet_ : Product Owner
_Théo_ : Responsable Opérations

##### Objectifs

<ins>Objectifs (et enjeux) individuels :</ins>

Anicet:

-   Utiliser le projet pour apprendre de nouvelles choses
-   Avoir une compréhension de la globalité du projet et être à l'aise pour en parler
-   MVP propre, projet à ajouter au portfolio
-   utiliser Git

Théo:

-   Git
-   Code propre et commenté
-   decouverte Django webSocket
-   design sympa!
-   pas de pression

Alexis:

-   A l'aise pour dire si quelque chose ne va pas (transparence)
-   réussir à organiser les tests en cercle vertueux
-   Se mettre en situation de difficulté pour être contraint à demander de l'aide
-   tenir 5 semaines (endurance sociale)

<ins>Objectif commun: <ins/>

MVP (Login / Contacts / Salons / Chat) propre et s'amuser sur des features sympas (Gameplay/Histoire avec notre thème)

---

### Exercice:

Création d'une application de chat utilisant à minima React et le protocole WebSocket.
création de rooms pour discuter à deux+ personnes
Choix libre de personalisation et features additionelles

### Présentation du Projet:

Nous avons choisi de réaliser une application de jeu de rôle centrée autour de l'histoire: les joueurs devront collaborer et discuter entre eux et autour des intérractions du joueur qui aura pour rôle Maître du Jeu (MJ) pour finir la partie.
Il y aura initialement une histoire préconstruite que les joueurs pourront adapter pour écrire leur histoires mais l'enjeu est qu'à partir d'un tronc commun, chaque groupe pourra créer une histoire complètement différente.

##### Fonctionnalités:

-   Ajouter des contacts
-   Créer une room en invitant des contacts
-   Une room est composée d'un chat, de l'affichage des participants, de l'affichage de l'event en cours, de l'historique des events
-   Envoyer des messages dans la room
-   utiliser des 'triggers' pour déclencher des actions dans la room
-   le MJ peut déclencher des events avec ses triggers et faire avancer l'histoire et modifier l'affichage de la room

---

### Choix des technologies:

##### Back

-   **API : Django Rest Framework**
    On a choisi d'utiliser Django pour l'API sans justification particulière, juste pour essayer

-   **DB : PostgreSQL (contrainte liée au projet), Django et Faker**
    On utilise l'ORM intégré à Django parce qu'il est puissant, Faker pour remplir la dB pour les tests

-   **Protocole de com (chat) : socketIO (et python-socket-io côté serveur qui leur appartient)**
    Nous avons choisi ces technos pour le protocole de communication puisqu'elles ont tout les avantages de webSocket en moins lourd (on transmet moins d'infos) et un peu simplifié

-   **Authentication : JWT + Django**
    JWT pour génerer le token parce que deja utilisé et le rapport simplicité/sécurité est très correct, module intégré à Django pour les comptes parce qu'utiliser des trucs deja faits permet de bosser sur d'autres choses plus intéressantes

##### Front

-   **UI : React et Sass**
    React imposé, Sass parce que ça permet de ne pas réécrire certains bouts de code et curieux de voir comment ça fonctionne.

-   _Routage -> React-Router_
    Permet de changer de page sans la charger complètement (notamment les élements qui ne changent pas, layout, header etc..)

-   _Requete API : axios_
    On utilise axios plutôt que fetch parce qu'il supporte une plus grand variété de Browser

---

### Roadmap

Il est prévu de continuer à bosser sur le projet parce qu'on s'est bien amusés, et surtout on a encore pas mal d'idées de choses sympa à mettre en place qu'on aura pas eu le temps de faire sur le temps imparti.

#### Moyen terme :

-   **Ajouter une histoire accessible à tous**
    Il faudra au moins une histoire crédible qu'il faudra faire tester aurpès de publics susceptibles d'être intéressés. Cette histoire sera le noyau à partir desquels les joueurs pourront créer, donc elle doit être assez vague pour laisser libre cours à l'imagination, mais doit quand même recourir à des codes permettant aux joueurs débutants (on rapelle l'enjeu du sujet) d'avoir des indications sur les chemins qu'ils peuvent prendre

-   **Faire fonctionner les interractions du DM et des joueurs dans le salon (triggers):**
    On a un système qui est prévu pour que le DM puisse diriger l'histoire en amenant certains evenement à se produire et en proposant aux joueurs d'y réagir
    Les joueurs auront alors une palette d'actions à réaliser à travers le chat (/fuir, /attaquer etc..), ceci afin de rendre l'histoire plus vivante.

-   **Ajouter la suppression de la plupart des élements:**
    Pour l'instant on ne peut supprimer qu'un compte, il faudrait pouvoir supprimer tout les élements qui ne sont plus utiles

-   **Rendre la plupart des icones cliquables pour afficher du détail (notamment les amis / team mates)**

-   **Choix et personnalisation des classes et personnages**
    Quand les triggers seront fonctionnels, on voudra qu'il soit possible d'avoir des intérractions différentes pour la même péripétie selon le joueur, et ceci sera fait en ajoutant des personalités / des capacités etc aux joueurs en leur permettant de modifier leur personnage et sa classe.

#### Long terme :

-   **Ajouter la création, l'édition des histoires, des assets, des classes etc..**
    Ouvrir la créativité à d'autres pans du jeu que l'histoire en elle même en faisant en sorte que les joueurs puisse créer leur prôpres élements de jeu.

-   **Créer une sorte de marketplace des élements de jeu**
    Une fois qu'on aura implémenté la personalisation des élements de jeu, on pourra créer une page sur lesquelles les joueurs pourront aller piocher dans les inspirations des autres afin de faire un meltingpot de différents bouts d'histoire pour créer celle qui leur conviendra.

-   **Renforcer la sécurité des différents élements, notamment les comptes**
    En vue du déploiement (cf juste après), il faudra être sûr qu'on met à disposition des joueurs un site sécurisé et que même si juridiquement tout ce qui est sur le site nous appartiendrait (?), nous devons leur garantir un accès pérenne aux différents élements qu'ils créeront sur l'appli.

-   **Déployer le site**
    Pour l'instant c'est dans long terme mais ça peut évoluer et passer en moyen terme selon les envies de chacun. A priori ce ne serait pas dans un but commercial.

-   **Trouver un moyen de faire vivre le site (serveur et autres frais)**

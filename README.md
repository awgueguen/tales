# Dungeons & Cuyons
___

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
*Alexis* : Scrum Master
*Anicet* : Product Owner
*Théo* : Responsable Opérations

##### Objectifs
<ins>Objectifs (et enjeux) individuels :</ins>

Anicet:
- Utiliser le projet pour apprendre de nouvelles choses
- Avoir une compréhension de la globalité du projet et être à l'aise pour en parler
- MVP propre, projet à ajouter au portfolio
- utiliser Git

Théo:
- Git
- Code propre et commenté
- decouverte Django webSocket
- design sympa!
- pas de pression

Alexis:
- A l'aise pour dire si quelque chose ne va pas (transparence)
- réussir à organiser les tests en cercle vertueux
- Se mettre en situation de difficulté pour être contraint à demander de l'aide
- tenir 5 semaines (endurance sociale)

<ins>Objectif commun: <ins/>

MVP (Login / Contacts / Salons / Chat) propre et s'amuser sur des features sympas (Gameplay/Histoire avec notre thème)

### Exercice:

Création d'une application de chat utilisant à minima React et le protocole WebSocket.
création de rooms pour discuter à deux+ personnes
Choix libre de personalisation et features additionelles

### Présentation du Projet:

Nous avons choisi de réaliser une application de jeu de rôle centrée autour de l'histoire: les joueurs devront collaborer et discuter entre eux et autour des intérractions du joueur qui aura pour rôle Maître du Jeu (MJ) pour finir la partie.
Il y aura initialement une histoire préconstruite que les joueurs pourront adapter pour écrire leur histoires mais l'enjeu est qu'à partir d'un tronc commun, chaque groupe pourra créer une histoire complètement différente.

##### Fonctionnalités:

- Ajouter des contacts
- Créer une room en invitant des contacts
- Une room est composée d'un chat, de l'affichage des participants, de l'affichage de l'event en cours, de l'historique des events
- Envoyer des messages dans la room
- utiliser des 'triggers' pour déclencher des actions dans la room
- le MJ peut déclencher des events avec ses triggers et faire avancer l'histoire et modifier l'affichage de la room

### Choix des technologies:

##### Back
API -> nous avons choisi d'utiliser Django Rest Framework pour faire la passerelle entre l'UI et la dB.
DB -> nous utilisons postgreSQL pour la dB
Socket -> nous utilisons socketIO et sa version python côté Serveur pour le protocole websocket simplifié
Populate db -> On utilise faker pour remplir la base de donnée
Authentication -> On utilise
##### Front
UI -> React imposé
Routage -> On utilise react-router pour le routage des différentes pages
Style -> On utilise Sass (on compile les différents fichier sass en un gros fichier css qui est celui utilisé par toutes les pages, on n'utilise pas sass-react)
fetch -> on utilise axios pour les requetes au back parce qu'il supporte plus de versions de browser


### Roadmap
##### moyen terme :
##### long terme :

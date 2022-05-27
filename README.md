# Tale It ©
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

___


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

___


### Choix des technologies:

##### Back

 - **API : Django Rest Framework**
    On a choisi d'utiliser Django pour l'API sans justification particulière, juste pour essayer

 - **DB : PostgreSQL (contrainte liée au projet), Django et Faker**
On utilise l'ORM intégré à Django parce qu'il est puissant, Faker pour remplir la dB pour les tests

 - **Protocole de com (chat) : socketIO (et python-socket-io côté serveur qui leur appartient)**
Nous avons choisi ces technos pour le protocole de communication puisqu'elles ont tout les avantages de webSocket en moins lourd (on transmet moins d'infos) et un peu simplifié

 - **Authentication : JWT + Django**
JWT pour génerer le token parce que deja utilisé et le rapport simplicité/sécurité est très correct, module intégré à Django pour les comptes parce qu'utiliser des trucs deja faits permet de bosser sur d'autres choses plus intéressantes


##### Front

 - **UI : React et Sass**
React imposé, Sass parce que ça permet de ne pas réécrire certains bouts de code et curieux de voir comment ça fonctionne.

 - *Routage -> React-Router*
Permet de changer de page sans la charger complètement (notamment les élements qui ne changent pas, layout, header etc..)

 - *Requete API : axios*
On utilise axios plutôt que fetch parce qu'il supporte une plus grand variété de Browser

___


### Roadmap

Il est prévu de continuer à bosser sur le projet parce qu'on s'est bien amusés, et surtout on a encore pas mal d'idées de choses sympa à mettre en place qu'on aura pas eu le temps de faire sur le temps imparti.


#### Moyen terme : 


- **Ajouter une histoire accessible à tous**
Il faudra au moins une histoire crédible qu'il faudra faire tester aurpès de publics susceptibles d'être intéressés. Cette histoire sera le noyau à partir desquels les joueurs pourront créer, donc elle doit être assez vague pour laisser libre cours à l'imagination, mais doit quand même recourir à des codes permettant aux joueurs débutants (on rapelle l'enjeu du sujet) d'avoir des indications sur les chemins qu'ils peuvent prendre

- **Faire fonctionner les interractions du DM et des joueurs dans le salon (triggers):**
On a un système qui est prévu pour que le DM puisse diriger l'histoire en amenant certains evenement à se produire et en proposant aux joueurs d'y réagir
Les joueurs auront alors une palette d'actions à réaliser à travers le chat (/fuir, /attaquer etc..), ceci afin de rendre l'histoire plus vivante.

- **Ajouter la suppression de la plupart des élements:**
Pour l'instant on ne peut supprimer qu'un compte, il faudrait pouvoir supprimer tout les élements qui ne sont plus utiles

- **Rendre la plupart des icones cliquables pour afficher du détail (notamment les amis / team mates)**

- **Choix et personnalisation des classes et personnages**
Quand les triggers seront fonctionnels, on voudra qu'il soit possible d'avoir des intérractions différentes pour la même péripétie selon le joueur, et ceci sera fait en ajoutant des personalités / des capacités etc aux joueurs en leur permettant de modifier leur personnage et sa classe.


#### Long terme :


- **Ajouter la création, l'édition des histoires, des assets, des classes etc..**
Ouvrir la créativité à d'autres pans du jeu que l'histoire en elle même en faisant en sorte que les joueurs puisse créer leur prôpres élements de jeu.

- **Créer une sorte de marketplace des élements de jeu**
Une fois qu'on aura implémenté la personalisation des élements de jeu, on pourra créer une page sur lesquelles les joueurs pourront aller piocher dans les inspirations des autres afin de faire un meltingpot de différents bouts d'histoire pour créer celle qui leur conviendra.

- **Renforcer la sécurité des différents élements, notamment les comptes**
En vue du déploiement (cf juste après), il faudra être sûr qu'on met à disposition des joueurs un site sécurisé et que même si juridiquement tout ce qui est sur le site nous appartiendrait (?), nous devons leur garantir un accès pérenne aux différents élements qu'ils créeront sur l'appli.

- **Déployer le site**
Pour l'instant c'est dans long terme mais ça peut évoluer et passer en moyen terme selon les envies de chacun. A priori ce ne serait pas dans un but commercial.

- **Trouver un moyen de faire vivre le site (serveur et autres frais)**


# (in install.bat) removed `CD /D ../../..` [l.82] && changed timeout [l.75]

*ajouter des services qui vont effectuer les requetes api pour GET / PUT (tous les trucs souvent utilisés qui nécessitent peu de validation / variations)

exemple:

export const instance (
	needAuth:boolean,
	contentType='application/json
 ) = axios.create({
   baseURL: API_URL,
   headers: {
      'Content-type': contentType,
   },
   withCredentials: needAuth
})

export const changePassword = async(newPassword: string, newConfirmPassword: string, token: string) => {
   const response = await instance.post('auth/pwd/change', {newPassword, newConfirmPassword}, { params: {token}})
   return response.data
}

___

* passage sur typescript ? Vite?
* Weapon dans la dB (juste ajouter un hasRange dans character me parait être le plus simple, une dague pourrait avoir de la range mais osef si on check bien ça devrait lfaire)


Fonctionalités :

* Mise en place des actions à partir des triggers
-> basiques : 

player
	/start_fight (trigger roll dice pour l'initiative)
	/attack (trigger roll dice)
	/flee (trigger roll dice)
	/pick_item (soit on part dans le truc et on ajoute des items en db avec les actions qu'ils peuvent déclencher .. soit on indique aux joueurs
de noter les éléments au fûr et à mesure pour pas s'en préocupper tout de suite, soit on ajoute un champ sur l'instance message à l'image de isAdmin (isItem?)
et on met ces messages dans une liste spéciale accessible depuis l'interface)
	/use_item (pareil)
	/change_weapon (OU cf remove_hp)

admin
	/special_action (inserer un texte decoré dans le chat qui permet au MJ de mettre en place une animation spontanée/improvisée)
	/start_event (modal)
	/end_event
	/start_story ( ++ afficherait un message are you ready et on a besoin que tlm dise oui pour déclencher le jeu)
	/end_story
	/throw_dice
	/remove_hp(entity, hp) OU -> modal affichant un formulaire avec les entités ciblables et la quantité d'hp à enlever
	/add_hp(entity, hp) OU PAREIL

Features
* Gestion des Assets (sorte de backoffice permettant de gerer les entity, les triggers, les actions, les histoires etc)
* Système de combat (Lancé de dé, calculs des effets, interaction avec le chat, mort d'un personnage, qu'est ce qu'on fait dans ce cas là? retour au choix du personnage ? ajouter un check des hps restants)



transformer les id en slug ? (dans les url, dans la base ??)


ajouter une page particulière quand un utilisateur se connecte pour la première fois (suggerer une room, un personnage, voire faire une démo)

est-ce que ça a un sens de mettre la tickbox dans une autre table ?
-> transformer la table tickbox en un champ dans User (à quel point c'est chiant? ) 

Voir avec Alex s'il utilise un linter/formatter, si oui lequel pour se mettre au diapason.


Mise en place des test unitaires : 
(recheck si l'app a été faite avec create-react-app - à priori oui vu la présence de react-scripts dans package.json)

build et mettre l'app en ligne


Instaurer une norme pour les commits / plus globalement pour le repo, tu voulais utiliser les merge request, ça peut être intéressant de s'y pencher et de se forcer à adapter cette methodo

continuous integration ->
 - porter le script windows et l'intégrer dans un script bash (ajouter la version unix)
 - ajouter un check à chaque push ()
 - passer en environment prod / local 
 - docker ?

 * isolate functional/UI by pulling logic out of components to hooks.
 * validation with joi



 Resume :

 **refacto** :
  * isolate functional/UI by pulling logic out of components to hooks.
  * validation with joi
  * move Tickbox within User table / Add weapon to Character table
  * commit norm
  * linter
  * variabilize settings with env.dev & env.prod
  * deploy :)

 **features** :
  * Roll a Dice animation
  * system to add images / upload them and retrieve them
  * actions / triggers
  * backoffice asset management (stories / characters / triggers?)
  * whisper system (chat alternative)
  * friend system with validation (notification and only add contact when accepted)
  * look for spam and kick/mute
  * Room: show people/characters and allow MJ to interract (kick/mute/whisp)
  * Login status : Offline, Online, Busy, Private (only receive msgs within the room (s)he might be in)

 **features story_related**:
  * write a story for players to try
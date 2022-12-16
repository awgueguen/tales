# REFACTO
 - extract functional handling from components / pages
 - TS
 - Reddux ?
 - Unit Test for existing components
 - handle regression test not to add issues that we've already corrected
___

# FEATURES

 - (STORY) **roll a dice for room creation** (prio zero mais céfun)
*use random parameters to settle a room*

 - (STORY) **spam watcher** (prio zero)
*watch for spams and add a mute effect, mute button for MJs*

 - (STORY) **usage watcher** (prio high)
*watch for user activity to change login status*

 - (STORY) **login status** (prio high) (weight: fucking casskouy)
*add a visual indicator to show user activity*
[online, busy(handled by user), offline, away(handle by usage watcher)] 
 - 15/12 : En faisant quelques recherches, il semble plus compliqué que prévu d'avoir un statut précis d'un utilisateur autre que nous même. Soit on recrée une table qui track les users et qui va à chaque requête envoyée par celui-ci (autre que le refresh token par exemple) mettre à jour l'état de connexion. Alors on suivrait l'activité d'un utilisateur puisque les fetchs ne sont à priori refait qu'en changeant de page et donc en étant actif. Solution un peu alambiquée mais qui serait plutôt précise.
 Soit on ajoute 'juste' un last_logout field qu'on devrait alimenter nous même à la cession du token, et on compare last_logout last_login pour savoir si l'utilisateur est à priori connecté. Beaucoup plus simple mais moins précis, on n'aurait d'ailleurs pas de distinction entre le away et le online. On peut décider de partir là dessus et ajouter la possibilité de mettre en statut busy, tant qu'un user est busy on ne fait pas les checks précédents, sinon on met juste 
 `is_active = last_logout > last_login`

  ### 
 Je récupère last_refresh (quand le token est refresh) que je mets dans authTokens.access (on pourra dans le context le mettre dans le localstorage mais pas sûr que ce soit pertinent) et last_login quand le token est généré. 
 On pourra estimer que l'utilisateur n'est plus connecté si last_refresh a plus de 10 minutes (deux cycles sans refresh ..)

 - (STORY) **kick/mute/whisp within rooms** (prio medium)
*allow a user (only MJ in a first step) to kick/mute/whisp a user in its room

 - (STORY) **remove a friend** (prio medium)
*allow a user to remove a contact from its friend list*
___
 - (EPIC) **contacts / rooms acceptance** : (prio medium)
*add notification system and UI to allow players to accept or decline invivtations*
  if accept, keep the current workaround and add entitites to table
  if decline, resend a notif 'DECLINE' to emitter and add in table but with decline, that would work as a BLACK LIST
    If a user has declined an invitation (room or contact), he can't be re-invited, but he can join by himself the room, or try to add contact.

 - (EPIC) **triggers** (prio high)
	(see [side note]() on features for a detailed list of ideas)
*review trigger system and allow interracting with the chat using assets*

 - (EPIC) **ASSETS MGMT** (prio medium) (high imo but UI might be really heavy..)
*backoffice with proper UIthat will allow players to manage assets*
  back routes to create stories, characters, entities from models
  back routes to create models that will be available for the user
    add possibility for a player that has created a model to share it with the user he wants

  - (EPIC) **IMAGE BANK** (prio hiher than ASSET MGMT)
*allow users to post images to be used within models*
  Need to check images integrity, and make them persist somewhere (comment/est-ce que tu gères ça pour l'instant?)

  - (EPIC) **WHISPER SYSTEM** (prio very low)
*allow users to interract outside of our rooms*
  Need to do an other UI, little box, sms like and be able to send messages from contacts list
    It can be really easy, or a little bit more tricky if we decide to handle notifications
  Add possibility to create a room within a private messages
  (future) Add possibility to configure a room directly within
```
Limite jme dis que refaire un picshare ultra simplifié, et le faire interagir avec l'app ça peut être
presque plus simple même si ça va être un bordel de configuration
ça permet de vraiment structurer notre projet
Pas une fouttue idée de ce qui est faisable/opti, mais dans l'idée on aurait
notre app qui gère le chat/jeu et une app (picshare disons) qui gère tous les assets et dans laquelle on va aller chercher pour tout ce qui est
assets, on peut même imaginer que l'ui du backoffice est sur blablapp mais que ça récupère et utilise le back
de l'api picshare.
Est-ce que c'est une fausse bonne idée je sais pas mais ça vaut le coup de se poser la question
```

  - (EPIC) **FIGHT SYSTEM** (prio medium)
*lezgong*
  back routes to PUT characters and entities HPs
    (how to handle a dead character ?) 
  back routes to be able to modifiy other elements if needed (not that urgent)
  dice roll system with UI, animation seems pointless (imo the game must be playable on poor machines)
    really challenging UI side if we decide not to go for animation since we have to make players feels
    an action whereas it would be kinda static. I think if we manage to do something cool it might be really nice !

 - (EPIC) **INTRODCUTION** (prio very low)
*little introduction to the app, with a tutorial, some entities proposed to start with and so on*
  here we can just hard code a template that we would use for everyone
  OR if we are a little bit crazy, we can start with a form to require people play style and adapt according to it

 - (EPIC) **PROFILE MANAGEMENT** (prio medium high)
*allow user to handle its profile and see friends profiles*
  little ui to show profiles : 
  - for self, show and edit
  - for friends, show and access status ()
  might be included in / same UI as Asset management

 - (EPIC) **ROOMS DETAILS** (prio high : only for users detail part)
*allow users within rooms to see details on the room*
 [users -> points to their publicProfile, their characters, their weapons]
 [event -> point to the event occuring]
 [entities -> point to the "biome"]
 [room history -> point to the events that have occured, the entities met]


___

# ISSUES
 * A user is not logged out after a long disconnexion of the service.
___

# FUNCTIONAL CHANGES

### Load every usefull information on a user connexion ?

 - get contacts on connexion, refetch if add friend or accept friends invite
 - get privateRooms on connexion, refetch if add room or accept room invite
 - get assets on connexion, refetch if add asset or edit assets
 - get list(contact where receiver=user && approved=false) and put a notif
 - get list(room where roompart in (list(roompart where roompart=user && aproved=false)) and put a notif
 - whisper system should be handle appart with socket as for the msg and be fetched on every socketIO msg that are from 'whisper' strategy for instance


___

# STRUCTURAL CHANGES
 * Add weapon table : [
	name: string NOT NULL,
	bonus: integer NOT NULL,
	malus?: integer,
	description: string,
	image: string NOT NULL,
	trigger: FK -> trigger (si on veut déclencher des effets)
	hasRange: boolean NOT NULL default False,
]
___

# STORY


___

# TO SEE FURTHER
 * add weakness and resistance
 * add elements (even a basic system would add depth to fights part if we see that it is important)

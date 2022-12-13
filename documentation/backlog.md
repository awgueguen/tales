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
*watch for spams and add a mute effect, mute button for MJs

 - (STORY) **usage watcher** (prio high)
*watch for user activity to change login status*

 - (STORY) **login status** (prio high)
*add a visual indicator to show user activity
[online, busy(handled by user), offline, away(handle by usage watcher)] 

 - (STORY) **kick/mute/whisp within rooms** (prio medium)
*allow a user (only MJ in a first step) to kick/mute/whisp a user in its room

___
 - (EPIC) **contacts / rooms acceptance** : (prio medium)
*add notification system and UI to allow players to accept or decline invivtations*
  if accept, keep the current workaround and add entitites to table
  if decline, resend a notif 'DECLINE' to emitter and add in table but with decline, that would work as a BLACK LIST
    If a user has declined an invitation (room or contact), he can't be re-invited, but he can join by himself the room, or try to add contact.

 - (EPIC) **triggers** (prio high)
	(see [side note]() on features for a detailed list of ideas)
*review trigger system and allow interracting with the chat using assets*

 - (EPIC) **ASSETS MGMT** (prio medium) (high imo but UI is really heavy..)
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

 - (EPIC) **PROFILE MANAGEMENT (prio medium high)
*allow user to handle its profile*
  little ui to edit personal details
  might be included in / same UI as Asset management

 - (EPIC) **ROOMS DETAILS** (prio high : only for users detail part)
*allow users within rooms to see details on the room*
 [users -> points to their publicProfile, their characters, their weapons]
 [event -> point to the event occuring]
 [entities -> point to the "biome"]
 [room history -> point to the events that have occured, the entities met]


___

# ISSUES
 * 
___

# FUNCTIONAL CHANGES
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

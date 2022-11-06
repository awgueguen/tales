"""WIP"""
from django.urls import path
from tales import views

urlpatterns = [
    # room ------------------------------------------------------------------ #

    # edit messages --------------------------------------------------------- #
    # agir sur un message en particulier, l'éditer, le supprimer
    # path('messages/<str:action>/', views.edit_messages),

    # gameplay -------------------------------------------------------------- #
    path('triggers/', views.triggers),
    path('triggers/submit/', views.submit_trigger),
    # rechercher un trigger existant dans une table
    # path('gameplay/instances_ingame/<int:instance_id>&hit=<int:hit>',
    #  views.instances_ingame),
    # système de HP pour les instances

    # assets ---------------------------------------------------------------- #
    # path('assets/', views.display_assets),
    # naviguer dans les assets
    # path('assets/create/', views.create_assets),
    # création d'assets
    # path('assets/story=<int:story_id>/', views.stories_api),
    # détails d'une histoire
    # path('assets/event=<int:event_id>/', views.events_api),
    # détails d'un event
    # path('assets/entity=<int:entity_id>/', views.entities_api),
    # détails d'une entité
    # path('assets/classes/', views.classes_api),
    # naviguer dans les classes existantes

    # * CLEAN
    path('assets/stories/', views.stories_api),

    # ----------------------------------------------------------------------- #
    # ROOM                                                                    #
    # ----------------------------------------------------------------------- #
    # création d'une room
    # path('room/list/<int:user_id>', views.get_user_rooms),

    # path('room-<int:room_id>/', views.get_room),
    # # afficher une room & tout ce qui en découle

    # path('room/create/id=<int:room_id>/entities/', views.create_instances),
    # associer des instances à une room & les personaliser
    # path('room-<int:room_id>/characters/', views.characters_ingame),
    # accèder aux personnages de la room
    # récupérer les messages associées à une room
    # path('room-<int:room_id>/post/', views.post_message),
    # envoyer un message depuis / vers la room

    # theo ------------------------------------------------------------------ #
    path('room/create/', views.create_room),
    path('room-<int:room_id>/messages/', views.messages_api),


    # * CLEAN
    path('room/homepage', views.homepage_rooms),
    path('roompart/list/<int:room_id>', views.roomparticipants_api),
    path('roompart/create/', views.roomparticipants_api),
    # connectAPI
    path('room-<int:room_id>/', views.get_a_room),
    # fetchQuickRooms
    path('room/quick_access', views.quick_access),
    # fetchPublicRooom
    # path('room/public_list/', views.get_public_rooms),
    # fetchRoomParticipants
    # path('room/inroom_list/', views.get_user_rooms_list),

    # ----------------------------------------------------------------------- #
    # USER                                                                    #
    # ----------------------------------------------------------------------- #
    # path('user/<int:user_id>/', views.users_api),
    # path('user/<int:user_id>/tickbox/', views.tick_api),
    path('register/', views.register_user),
    path('background-check/', views.background_check),
    # * CLEAN
    # getCharacters
    path('characters/', views.characters_api),

    # ----------------------------------------------------------------------- #
    # CONTACTS                                                                #
    # ----------------------------------------------------------------------- #
    # * CLEAN
    # Contacts
    path('contacts/', views.contacts_api),
    # checkContactExistance, addFriendToContact
    path('contacts/add/', views.add_contact),

    # __________merge depuis theo _________________
    # user related ---------------------------------------------------------- #
    # path('user/<str:username>/add', views.add_user_api),
    # profil utilisateur -> just myprofile
    # path('user/<int:user_id>/contacts/', views.contacts_api),
    # gestion des contacts utilisateurs -> just contacts/
    # gestion des contacts utilisateurs -> contacts d'un user spécifique
    # à terme à fusionner avec le path d'Anicet

]

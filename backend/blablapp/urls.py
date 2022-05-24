"""WIP"""
from django.urls import path
from blablapp import views

urlpatterns = [
    # room ------------------------------------------------------------------ #


    # edit messages --------------------------------------------------------- #
    # path('messages/<str:action>/', views.edit_messages),
    # agir sur un message en particulier, l'éditer, le supprimer

    # gameplay -------------------------------------------------------------- #
    path('triggers/', views.trigger),
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

    # ----------------------------------------------------------------------- #
    # ROOM                                                                    #
    # ----------------------------------------------------------------------- #
    path('room/create/', views.create_room),
    # création d'une room
    # path('room/list/<int:user_id>', views.get_user_rooms),

    # path('room-<int:room_id>/', views.get_room),
    # # afficher une room & tout ce qui en découle

    # path('room/create/id=<int:room_id>/entities/', views.create_instances),
    # associer des instances à une room & les personaliser
    # path('room-<int:room_id>/characters/', views.characters_ingame),
    # accèder aux personnages de la room
    # path('room-<int:room_id>/messages/', views.messages_api),
    # récupérer les messages associées à une room
    # path('room-<int:room_id>/post/', views.post_message),
    # envoyer un message depuis / vers la room

    # * CLEAN

    #
    path('room/quick_access', views.quick_access),
    # fetchPublicRooom
    path('room/public_list/', views.get_public_rooms),
    # fetchRoomParticipants
    path('room/inroom_list/', views.get_user_rooms_list),


    # ----------------------------------------------------------------------- #
    # USER                                                                    #
    # ----------------------------------------------------------------------- #
    # path('user/<int:user_id>/', views.users_api),
    # path('characters/', views.characters_api),
    # path('user/<int:user_id>/tickbox/', views.tick_api),
    # path('register/', views.register_user),
    # * CLEAN

    # ----------------------------------------------------------------------- #
    # CONTACTS                                                                #
    # ----------------------------------------------------------------------- #
    # * CLEAN
    # Contacts
    path('contacts/', views.contacts),
    # checkContactExistance, addFriendToContact
    path('contacts/add/', views.add_contact),


]

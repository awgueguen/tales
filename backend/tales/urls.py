"""WIP"""
from django.urls import path
from tales import views

urlpatterns = [
    # gameplay -------------------------------------------------------------- #
    path('triggers/', views.triggers),
    path('triggers/submit/', views.submit_trigger),
    # rechercher un trigger existant dans une table
    # path('gameplay/instances_ingame/<int:instance_id>&hit=<int:hit>',
    #  views.instances_ingame),
    # système de HP pour les instances
    path('assets/stories/', views.stories_api),
    path('characters/', views.characters_api),

    # ----------------------------------------------------------------------- #
    # ROOM                                                                    #
    # ----------------------------------------------------------------------- #
    path('room/create/', views.create_room),
    path('room-<int:room_id>/', views.get_a_room),
    path('room-<int:room_id>/messages/', views.get_messages),
    path('roompart/list/<int:room_id>', views.api_roomparticipants),

    # ----------------------------------------------------------------------- #
    # HOMEPAGE                                                                #
    # ----------------------------------------------------------------------- #
    path('room/homepage', views.homepage_rooms),
    path('room/quick_access', views.quick_access),

    # ----------------------------------------------------------------------- #
    # USER                                                                    #
    # ----------------------------------------------------------------------- #
    path('register/', views.register_user),
    path('background-check/', views.background_check),

    # ----------------------------------------------------------------------- #
    # CONTACTS                                                                #
    # ----------------------------------------------------------------------- #
    path('contacts/', views.get_contacts),
    path('contacts/add/', views.add_contact),

]

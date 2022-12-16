"""WIP"""
from django.urls import path
from tales import views

urlpatterns = [
    # gameplay -------------------------------------------------------------- #
    path('triggers/', views.triggers),
    path('triggers/submit/', views.submit_trigger),
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
    path('profile/edit/', views.edit_profile),
    path('profile/', views.get_profile),
    # path('profile/friends/', views.get_contacts_profiles),
    # ----------------------------------------------------------------------- #
    # CONTACTS                                                                #
    # ----------------------------------------------------------------------- #
    path('contacts/', views.get_contacts),
    path('contacts/add/', views.add_contact),
    path('contacts/remove/', views.remove_contact),
]

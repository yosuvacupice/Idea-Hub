from django.urls import path
from .views import (
    IdeaListCreateView,
    IdeaDetailView,
    RegisterView,
    CommentListCreateView,
    VoteCreateUpdateView,
    RatingCreateUpdateView,
    MessageListCreateView,
    CurrentUserView
)

urlpatterns = [
    path('', IdeaListCreateView.as_view(), name='ideas'),
    path('<int:pk>/', IdeaDetailView.as_view(), name='idea-detail'),

    path('register/', RegisterView.as_view(), name='register'),
    path('<int:idea_id>/comments/', CommentListCreateView.as_view(), name='comments'),
    path('<int:idea_id>/vote/', VoteCreateUpdateView.as_view(), name='vote'),
    path('<int:idea_id>/rate/', RatingCreateUpdateView.as_view(), name='rate'),

    path('messages/', MessageListCreateView.as_view(), name='messages'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
]

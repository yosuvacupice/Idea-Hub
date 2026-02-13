from rest_framework import generics, permissions, serializers, filters
from .models import Idea, Comment, BadWord, Vote, Rating, Message
from django.contrib.auth.models import User
from .serializers import (
    IdeaSerializer,
    RegisterSerializer,
    CommentSerializer,
    VoteSerializer,
    RatingSerializer,
    MessageSerializer
)
from django.db.models import Sum, Avg, Count
from rest_framework.views import APIView
from rest_framework.response import Response


# ================= IDEA LIST + CREATE =================

class IdeaListCreateView(generics.ListCreateAPIView):
    serializer_class = IdeaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title']

    def get_queryset(self):
        return Idea.objects.annotate(
            vote_sum=Sum('votes__value'),
            avg_rating=Avg('ratings__value'),
            comment_count=Count('comments')
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ================= SINGLE IDEA DETAIL =================

class IdeaDetailView(generics.RetrieveAPIView):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# ================= REGISTER =================

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


# ================= COMMENTS =================

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        idea_id = self.kwargs['idea_id']
        return Comment.objects.filter(idea_id=idea_id).order_by('-created_at')

    def perform_create(self, serializer):
        idea_id = self.kwargs['idea_id']
        content = serializer.validated_data['content']

        bad_words = BadWord.objects.values_list('word', flat=True)

        for word in bad_words:
            if word.lower() in content.lower():
                raise serializers.ValidationError(
                    "Your comment contains inappropriate language."
                )

        serializer.save(user=self.request.user, idea_id=idea_id)


# ================= VOTE =================

class VoteCreateUpdateView(generics.CreateAPIView):
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        idea_id = self.kwargs['idea_id']
        value = serializer.validated_data['value']

        vote, created = Vote.objects.update_or_create(
            user=self.request.user,
            idea_id=idea_id,
            defaults={'value': value}
        )

        serializer.instance = vote


# ================= RATING =================
class RatingCreateUpdateView(generics.CreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        idea_id = self.kwargs['idea_id']
        value = serializer.validated_data['value']

        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")

        rating, created = Rating.objects.update_or_create(
            user=self.request.user,
            idea_id=idea_id,
            defaults={'value': value}
        )

        serializer.instance = rating

# ================= MESSAGES =================

from django.db.models import Q

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


# ================= CURRENT USER =================

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email
        })
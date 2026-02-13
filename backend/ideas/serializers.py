from rest_framework import serializers
from .models import Idea, Comment, Vote, Rating, Message
from django.contrib.auth.models import User
from django.db.models import Sum, Avg

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user', 'idea']


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'
        read_only_fields = ['user', 'idea']

class IdeaSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    total_votes = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    user_name = serializers.CharField(source='user.username', read_only=True)
    like_count = serializers.SerializerMethodField()
    dislike_count = serializers.SerializerMethodField()

    class Meta:
        model = Idea
        fields = [
            'id',
            'title',
            'description',
            'created_at',
            'user',
            'user_name',
            'comments',
            'total_votes',
            'average_rating',
            'like_count',
            'dislike_count'
        ]
        read_only_fields = ['user']

    def get_total_votes(self, obj):
        result = obj.votes.aggregate(total=Sum('value'))
        return result['total'] or 0

    def get_like_count(self, obj):
        return obj.votes.filter(value=1).count()

    def get_dislike_count(self, obj):
        return obj.votes.filter(value=-1).count()

    def get_average_rating(self, obj):
        result = obj.ratings.aggregate(avg=Avg('value'))
        return round(result['avg'], 2) if result['avg'] else 0
    
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'
        read_only_fields = ['user', 'idea']

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    receiver_name = serializers.CharField(source='receiver.username', read_only=True)
    receiver_username = serializers.CharField(write_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'sender_name', 'receiver_name', 'receiver_username', 'content', 'created_at']
        read_only_fields = ['sender', 'receiver']

    def create(self, validated_data):
        receiver_username = validated_data.pop('receiver_username')
        try:
            receiver = User.objects.get(username=receiver_username)
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")

        validated_data['receiver'] = receiver
        return super().create(validated_data)


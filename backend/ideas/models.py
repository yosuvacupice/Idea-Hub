from django.db import models
from django.contrib.auth.models import User


class Idea(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.idea.title}"

class BadWord(models.Model):
    word = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.word

class Vote(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    value = models.IntegerField()

    class Meta:
        unique_together = ('idea', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.value}"

class Rating(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    value = models.IntegerField()

    class Meta:
        unique_together = ('idea', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.value}"

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username}"

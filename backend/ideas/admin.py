from django.contrib import admin
from .models import Idea, Comment, BadWord, Vote, Rating


admin.site.register(Idea)
admin.site.register(Comment)
admin.site.register(BadWord)
admin.site.register(Vote)
admin.site.register(Rating)
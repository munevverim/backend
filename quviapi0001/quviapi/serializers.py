from rest_framework import serializers
from .models import CustomUser

class GoogleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email')
        read_only_fields = ('id',)

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
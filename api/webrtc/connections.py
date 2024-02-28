from channels import consumer

from users import models


class ConnectionHandler:
    """
    ConnectionHandler class for handling WebRTC connections

    Attributes:
        _room_group_name (str): The name of the group
        _channel_layer (consumer.AsyncConsumer): The channel layer instance

    Methods:
        add_peoples_to_connect: Adds people to connect
        _send_request: Sends a request to the group
    """

    def __init__(self, channel_layer, room_group_name):
        self._room_group_name: str = room_group_name
        self._channel_layer: consumer.AsyncConsumer = channel_layer

    async def add_peoples_to_connect(self, user: models.CustomUser):
        await self._send_request(user.pk)

    async def _send_request(self, user_pk: str):
        await self._channel_layer.group_send(
            self._room_group_name,
            {
                'type': 'event_create',
                'for_user': user_pk,
            },
        )

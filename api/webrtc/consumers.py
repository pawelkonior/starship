import json
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework import status

from webrtc.connections import ConnectionHandler


class WebRtcConsumer(AsyncWebsocketConsumer):
    """
    Websocket consumer for WebRTC connection
    This consumer is responsible for handling WebRTC connections between users.

    Attributes:
        - ConnectionHandler (ConnectionHandler): ConnectionHandler instance for handling WebRTC connections

    Methods:
        - connect: Connects the user to the Websocket consumer
        - disconnect: Disconnects the user from the Websocket consumer
        - receive: Receives data from the user and sends it to the group
        - event_create: Sends an event to the user
        - massage_to_user: Sends a message to the user

    """
    def __init__(self):
        super().__init__()
        self.ConnectionHandler = None

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['course_pk']
        self.room_group_name = f'course_{self.room_name}'

        if self.scope['user'].is_anonymous:
            await self.close(code=status.HTTP_401_UNAUTHORIZED)
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        self.ConnectionHandler = ConnectionHandler(self.channel_layer, self.room_group_name)
        await self.ConnectionHandler.add_peoples_to_connect(self.scope['user'])

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data_from_client = json.loads(text_data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'massage_to_user',
                'data': data_from_client,
            }
        )

    async def event_create(self, event):
        user_pk = event.get('for_user')

        if user_pk and user_pk == self.scope['user'].pk:
            return

        event_data = json.dumps({
            'type': 'CREATE',
            "for_user": user_pk,
            "kind": "offer",
        })
        await self.send(event_data)

    async def massage_to_user(self, event, ):
        user_pk = event['data'].get('to_user')

        if user_pk and not user_pk == self.scope['user'].pk:
            return

        message_data = json.dumps({
            'to_user': user_pk,
            "from_user": event['data']['from_user'],
            "type": event['data']['type'],
            "content": event['data']['content'],
        })

        await self.send(message_data)

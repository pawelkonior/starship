from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework import status

from chat.messages import Message
from chat.events import EventHandler


class ChatBotConsumer(AsyncWebsocketConsumer):
    """
    ChatBotConsumer class is a subclass of AsyncWebsocketConsumer. It handles WebSocket connections for chat bot functionality.

    Attributes:
        - event_handler (EventHandler): An instance of the EventHandler class used for handling chat bot events.

    Methods:
        - connect(): Called when a WebSocket connection is established. Checks if the user is authenticated, and if not, closes the connection with a 401 UNAUTHORIZED status code. Otherwise, accepts the connection.
        - disconnect(close_code): Called when a WebSocket connection is closed.
        - receive(text_data): Called when a message is received from the WebSocket connection. Parses the received message as a Message object and passes it to the event_handler for processing. Sends back the outgoing message, if any, in JSON format.
    """

    def __init__(self):
        super().__init__()
        self.event_handler = EventHandler()

    async def connect(self):
        if self.scope["user"].is_anonymous:
            await self.close(code=status.HTTP_401_UNAUTHORIZED)
            return
        await self.accept()

    async def disconnect(self, close_code):
        ...

    async def receive(self, text_data):
        user_message = Message.from_json(text_data)
        outgoing_message = self.event_handler.handle_event(user_message)

        if outgoing_message:
            await self.send(outgoing_message.to_json())

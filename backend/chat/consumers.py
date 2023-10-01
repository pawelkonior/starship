import json

from channels.generic.websocket import WebsocketConsumer

from chat.helpers import ask_openai


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        chat_response = ask_openai(text_data)
        self.send(chat_response)
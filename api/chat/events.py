import json
from abc import ABC
from typing import List, Union

from chat.helpers import OpenAIBot
from chat.messages import AbstractMessage, Message, SenderTypes


class Event(ABC):
    """
    Class representing an event in a chatbot system.

    Attributes:
        - message (AbstractMessage): The message associated with the event.
        - chatbot_instance (OpenAIBot): The instance of the chatbot that generated the event.

    """
    message: AbstractMessage
    chatbot_instance: OpenAIBot


class MessageEvent(Event):
    """
    Class: MessageEvent

    This class represents an event that handles a message received from a user and processes it using a chatbot instance.

    Attributes:
        - _incoming_message (Message): The incoming message object.
        - _outgoing_message_text (str): The outgoing message text.
        - _open_ai_instance (OpenAIBot): The chatbot instance.

    Methods:
        - __init__(self, message: Message, chatbot_instance: OpenAIBot): Initializes a new instance of the MessageEvent class.
        - process(self) -> Message: Processes the incoming message using the chatbot instance and returns the response message.

    """
    def __init__(self, message: Message, chatbot_instance: OpenAIBot):
        self._incoming_message = message
        self._outgoing_message_text = None
        self._open_ai_instance = chatbot_instance

    def process(self) -> Message:
        chat_message = self._open_ai_instance.ask(self._incoming_message.message_text)
        return Message(chat_message, SenderTypes.BOT)


class HistoryEvent(Event):
    """
    A class representing a history event in a chatbot conversation.

    This class inherits from the Event class and is used to update the conversation history in the chatbot's OpenAIBot instance.

    Attributes:
        - _user_message (List[Message]): A list of Message objects representing the user's messages.
        - _open_ai_instance (OpenAIBot): An instance of the OpenAIBot class representing the chatbot.

    Methods:
        - process: Process the history event by updating the conversation history in the OpenAIBot instance.

    """
    def __init__(self, message: List[Message], chatbot_instance: OpenAIBot):
        self._user_message = message
        self._open_ai_instance = chatbot_instance

    def process(self) -> None:
        for message in self._user_message:
            self._open_ai_instance.update_conversation_history(message.message_text)


class EventHandler:
    """

    EventHandler

    Class responsible for handling events by processing messages.

    Methods:
        - __init__(self): Initializes the EventHandler object.
        - handle_event(self, message) -> Union[Message, None]: Handles the given message by processing it and returning the result.

    """
    def __init__(self):
        self._open_ai_instance = OpenAIBot()

    def handle_event(self, message: Union[Message, List[Message]]) -> Union[Message, None]:
        if isinstance(message, Message):
            event = MessageEvent(message, self._open_ai_instance)
            return event.process()
        elif isinstance(message, list):
            event = HistoryEvent(message, self._open_ai_instance)
            return event.process()
        else:
            raise ValueError("Invalid message type")

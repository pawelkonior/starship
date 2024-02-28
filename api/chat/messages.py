import json
from abc import ABC
from enum import StrEnum


class AbstractMessage(ABC):
    """
    AbstractMessage class is an abstract base class that represents a generic message.

    Attributes:
        - message_text (str): The content of the message.
        - sender (str): The sender of the message.
        - message_type (str): The type/category of the message.

    """
    message_text: str
    sender: str
    message_type: str


class SenderTypes(StrEnum):
    """
    Enum class to represent different types of message senders.

    Attributes:
        - USER (str): Represents a message sender as a user.
        - BOT (str): Represents a message sender as a bot.
    """
    USER = "USER"
    BOT = "BOT"


class MessageType(StrEnum):
    """
    Class representing a type of message.

    Attributes:
        TEXT (str): Represents a text message type.
        HISTORY (str): Represents a history message type.
    """
    TEXT = "TEXT"
    HISTORY = "HISTORY"


class Message(AbstractMessage):
    """
    Message class represents a message object with text and sender information.

    Attributes:
        - message_text (str): The text of the message.
        - sender (str): The sender of the message.

    Methods:
        - to_json() -> str:
            Converts the message object to a JSON string.

        - from_json(json_data):
            Converts a JSON string to a Message object.

    """
    def __init__(self, message_text: str, sender: str):
        self.message_text = message_text
        self.sender = sender

    def to_json(self) -> str:
        return json.dumps(
            {
                "message_text": self.message_text,
                "sender": self.sender
            },
            ensure_ascii=False,
        )

    @classmethod
    def from_json(cls, json_data):
        data = json.loads(json_data)

        if not isinstance(data['message_text'], list):
            return cls(
                message_text=data["message_text"],
                sender=data["sender"]
            )

        return [cls(
            message_text=message["message_text"],
            sender=message["sender"]
        ) for message in data["message_text"]]

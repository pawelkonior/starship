class InvalidUserID(Exception):
    pass


class InvalidActivationToken(Exception):
    """
    A custom exception class for managing invalid activation tokens.

    Attributes:
        - message (str): A string containing the error message associated with the exception.

    Methods:
        - __init__(self, message="Invalid activation token"): Initializes the InvalidActivationToken object with an optional error message.

    """
    def __init__(self, message="Invalid activation token"):
        self.message = message
        super().__init__(self.message)


class AlreadyActive(Exception):
    """
    Exception raised when an account is already active.

    Attributes:
        - message (str): The error message associated with the exception.

    Methods:
        - __init__(message="Account is already active"): Initializes the exception with an optional error message.
    """
    def __init__(self, message="Account is already active"):
        self.message = message
        super().__init__(self.message)

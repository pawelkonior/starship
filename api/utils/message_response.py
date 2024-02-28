from rest_framework.response import Response


class MessageResponse(Response):

    def __init__(
            self,
            message: str = None,
            status=None,
            template_name=None,
            headers=None,
            exception=False,
            content_type=None
    ):
        data = message and {"message": message}
        super().__init__(data, status, template_name, headers, exception, content_type)

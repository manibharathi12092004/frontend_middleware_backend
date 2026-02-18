import logging
from datetime import datetime


logger = logging.getLogger(__name__)


class RequestLoggingMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        if request.path == "/api/summarize/" and request.method == "POST":
            client_ip = request.META.get("REMOTE_ADDR")
            logger.info(
                f"[{datetime.now()}] IP: {client_ip} | Body: {request.body}"
            )

        response = self.get_response(request)
        return response

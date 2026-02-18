import logging

logger = logging.getLogger("django")


class RequestLoggingMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        if request.path == "/api/summarize/" and request.method == "POST":
            client_ip = request.META.get("REMOTE_ADDR")
            logger.info(
                f"Summarize API | IP: {client_ip}"
            )

        return self.get_response(request)

import time
from django.http import JsonResponse


class RateLimitMiddleware:

    RATE_LIMIT = 10  # 10 requests
    TIME_WINDOW = 120  # per 120 seconds

    request_logs = {}

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        if request.path == "/api/summarize/" and request.method == "POST":

            ip = request.META.get("REMOTE_ADDR")
            current_time = time.time()

            logs = self.request_logs.get(ip, [])

            logs = [t for t in logs if current_time - t < self.TIME_WINDOW]

            if len(logs) >= self.RATE_LIMIT:
                return JsonResponse(
                    {
                        "status": "error",
                        "message": "Rate limit exceeded. Try again later."
                    },
                    status=429
                )

            logs.append(current_time)
            self.request_logs[ip] = logs

        return self.get_response(request)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SummarizeSerializer
from services.ollama_service import generate_summary, OllamaAPIException


class SummarizeView(APIView):

    def post(self, request):
        serializer = SummarizeSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "status": "error",
                    "errors": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        text = serializer.validated_data["text"]

        try:
            summary = generate_summary(text)

            return Response(
                {
                    "status": "success",
                    "summary": summary
                },
                status=status.HTTP_200_OK
            )

        except OllamaAPIException as e:
            return Response(
                {
                    "status": "error",
                    "message": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

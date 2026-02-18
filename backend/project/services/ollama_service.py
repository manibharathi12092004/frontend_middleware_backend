from django.conf import settings
from ollama import Client


class OllamaAPIException(Exception):
    pass


def generate_summary(text: str) -> str:
    try:
        client = Client(
            host=settings.OLLAMA_HOST,
            headers={
                "Authorization": f"Bearer {settings.OLLAMA_API_KEY}"
            }
        )

        response = client.chat(
            model=settings.OLLAMA_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": f"Summarize the following text clearly and concisely and the generated summary should by 2-3 lines:\n\n{text}"
                }
            ]
        )

        summary = response.get("message", {}).get("content", "")

        if not summary:
            raise OllamaAPIException("Empty response from Ollama Cloud.")

        return summary.strip()

    except Exception as e:
        raise OllamaAPIException(f"Ollama Cloud error: {str(e)}")

import requests
import os
from django.conf import settings


class OllamaAPIException(Exception):
    pass


def generate_summary(text: str) -> str:
    """
    Calls Ollama (phi3) model to generate summary.
    """

    url = settings.OLLAMA_URL

    payload = {
            "model": "phi3",
            "prompt": f"""You are a professional AI assistant specialized in text summarization.
                          Instructions:
                        - Provide a concise summary.
                        - Preserve key facts and important details.
                        - Do not add new information.
                        - Keep the tone neutral and professional.
                        - The generating content should be half the length of the original text or less.
                        - Try to give smaller content but with full information covered.\n{text}""",
            "stream": False
    }

    try:
        response = requests.post(url, json=payload, timeout=300)

        if response.status_code != 200:
            raise OllamaAPIException(
                f"Ollama API failed with status {response.status_code}"
            )

        data = response.json()

        return data.get("response", "").strip()

    except requests.exceptions.RequestException as e:
        raise OllamaAPIException(f"Ollama request failed: {str(e)}")

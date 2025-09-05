# i18n.py - Simple i18n utility for the ML app, inspired by your Next.js i18n config
import json
import os
from typing import Dict

# Supported locales (same as your frontend)
LOCALES = [
    "en",    # English
    "zh",    # Chinese
    "es",    # Spanish
    "ar",    # Arabic
    "hi",    # Hindi
    "fr",    # French
    "tr",    # Turkish
    "fa",    # Farsi/Persian
    "de",    # German
    "ja",    # Japanese
    "it",    # Italian
    "ru"     # Russian
]

DEFAULT_LOCALE = "en"

# Directory for translation files (JSON, one per locale)
TRANSLATION_DIR = os.path.join(os.path.dirname(__file__), "messages")

class I18n:
    def __init__(self, locale=DEFAULT_LOCALE):
        self.locale = locale if locale in LOCALES else DEFAULT_LOCALE
        self.messages = self._load_messages(self.locale)

    def _load_messages(self, locale: str) -> Dict[str, str]:
        path = os.path.join(TRANSLATION_DIR, f"{locale}.json")
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def t(self, key: str, default: str = "") -> str:
        return self.messages.get(key, default or key)

# Example usage:
# i18n = I18n("tr")
# print(i18n.t("upload_photo", "Upload Photo"))

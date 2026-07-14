import re
from rules.base import BaseRule

class WeatherRule(BaseRule):
    intent = "Weather"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Exact keyword matches
        exact_keywords = ["weather", "forecast", "climate"]
        if cleaned_text in exact_keywords:
            return 1.0, "I cannot retrieve real-time weather details right now, but you can always check your local forecast. Make sure to carry an umbrella if it rains!"

        # Regex checks
        if re.search(r"\b(weather|rain|temperature|forecast|sunny|cloudy|windy|storm|snow)\b", cleaned_text):
            return 0.8, "I am a simulated assistant and can't check the sky directly. However, it's always 72 degrees and sunny inside my servers!"

        return 0.0, ""

import re
from rules.base import BaseRule

class GreetingsRule(BaseRule):
    intent = "Greetings"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Exact keyword checks (Priority 1)
        exact_keywords = ["hi", "hello", "hey", "hola", "greetings", "wasup"]
        if cleaned_text in exact_keywords:
            return 1.0, "Hello! I am RuleBot, your intelligent assistant. How can I help you today?"

        # Regex checks (Priority 2)
        if re.search(r"\b(hello|greetings|hey there|good morning|good afternoon|good evening)\b", cleaned_text):
            return 0.8, "Hello! Hope you are having a wonderful day. How can I assist you today?"

        return 0.0, ""

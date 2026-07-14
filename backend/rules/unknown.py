from rules.base import BaseRule

class UnknownRule(BaseRule):
    intent = "Unknown"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Always returns a baseline low confidence (e.g. 0.1) and the fallback text
        return 0.1, "I'm still a rule-based chatbot and don't understand that question."

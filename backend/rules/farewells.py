import re
from rules.base import BaseRule

class FarewellsRule(BaseRule):
    intent = "Bye"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Exact keyword matches
        exact_keywords = ["bye", "goodbye", "exit", "quit", "see you"]
        if cleaned_text in exact_keywords:
            return 1.0, "Goodbye! Feel free to chat with me anytime you have questions."

        # Regex checks
        if re.search(r"\b(bye|goodbye|farewell|see\s+ya|talk\s+later|quit|exit)\b", cleaned_text):
            return 0.8, "Take care! Have a great day ahead, and see you soon."

        return 0.0, ""

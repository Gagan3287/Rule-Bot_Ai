import re
from rules.base import BaseRule

class HelpRule(BaseRule):
    intent = "Help"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Exact keyword matches
        exact_keywords = ["help", "commands", "info", "support", "menu"]
        if cleaned_text in exact_keywords:
            return 1.0, "I can assist you with various topics! Try asking about Programming, Python, Java, AI, Machine Learning, Web Development, Weather, College, or ask for the current Time/Date."

        # Regex checks
        if re.search(r"\b(help|commands|instructions|what\s+can\s+you\s+do|how\s+to\s+use|support)\b", cleaned_text):
            return 0.8, "I am a Rule-Based Chatbot built to demonstrate NLP using matching patterns. I can give answers regarding Python, Java, AI, ML, Web Dev, Weather, College details, or FAQs. Ask me anything!"

        return 0.0, ""

import re
from datetime import datetime
from rules.base import BaseRule

class DateRule(BaseRule):
    intent = "Date"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Exact keyword matches
        exact_keywords = ["date", "today", "current date"]
        current_date = datetime.now().strftime("%A, %B %d, %Y")
        if cleaned_text in exact_keywords:
            return 1.0, f"Today's system date is: {current_date}."

        # Regex checks
        if re.search(r"\b(date|today|day|current\s+date|what\s+day\s+is\s+today|what\s+is\s+today\s*s\s+date)\b", cleaned_text):
            return 0.8, f"The current system date is: {current_date}."

        return 0.0, ""

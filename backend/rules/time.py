import re
from datetime import datetime
from rules.base import BaseRule

class TimeRule(BaseRule):
    intent = "Time"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Exact keyword matches
        exact_keywords = ["time", "clock", "current time"]
        current_time = datetime.now().strftime("%H:%M:%S")
        if cleaned_text in exact_keywords:
            return 1.0, f"The current system time is: {current_time}."

        # Regex checks
        if re.search(r"\b(time|clock|what\s+time\s+is\s+it|get\s+time)\b", cleaned_text):
            return 0.8, f"The current system time is: {current_time}."

        return 0.0, ""

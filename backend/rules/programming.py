import re
from rules.base import BaseRule

class ProgrammingRule(BaseRule):
    intent = "Programming"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Exact keyword matches
        exact_keywords = ["programming", "coding", "software engineering", "develop"]
        if cleaned_text in exact_keywords:
            return 1.0, "Programming is the process of translating logic into instructions that computers can execute. It involves software design, debugging, and maintaining code."

        # Regex checks
        if re.search(r"\b(programming|coding|coder|software\s+development|compiling|syntax|algorithms|source\s+code)\b", cleaned_text):
            return 0.8, "Coding allows us to communicate with machines. Writing clean, efficient, and readable code is a core skill in software development. Try asking me about Python or Java!"

        return 0.0, ""

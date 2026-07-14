import re
from rules.base import BaseRule

class CollegeRule(BaseRule):
    intent = "College"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Exact keyword matches
        exact_keywords = ["college", "university", "academic", "admission"]
        if cleaned_text in exact_keywords:
            return 1.0, "Colleges and universities offer various undergraduate and postgraduate programs. Admission typically requires transcripts and standardized tests. Is there a specific subject or course you're interested in?"

        # Regex / Structural Pattern checks
        if re.search(r"\b(college|university|campus|admission|courses|degree|major|syllabus|graduation|tuition)\b", cleaned_text):
            return 0.8, "Higher education institutions offer academic credits leading to degrees (Associates, Bachelors, Masters, PhDs) in various majors like Computer Science, Business, and Arts."

        # General keyword occurrences
        if "school" in cleaned_text or "professor" in cleaned_text or "education" in cleaned_text:
            return 0.6, "Academics involve structure, student classes, faculty professors, campus laboratories, and research papers."

        return 0.0, ""

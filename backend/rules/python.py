import re
from rules.base import BaseRule

class PythonRule(BaseRule):
    intent = "Python"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Exact keyword matches
        exact_keywords = ["python", "py", "cpython"]
        if cleaned_text in exact_keywords:
            return 1.0, "Python is a high-level, interpreted programming language known for its readability and simplicity. It is widely used in Web Development, Data Science, automation, and Artificial Intelligence."

        # Regex / Structural Pattern checks
        if re.search(r"(what\s+is\s+python|tell\s+me\s+about\s+python|define\s+python|how\s+does\s+python\s+work)", cleaned_text):
            return 0.8, "Python was created by Guido van Rossum and released in 1991. It emphasizes code readability, letting developers express concepts in fewer lines of code compared to C++ or Java."

        # General keyword occurrences
        if "python" in cleaned_text or "pip" in cleaned_text.split() or "venv" in cleaned_text.split():
            return 0.6, "Python features a large standard library and standard packaging tools like pip. It supports multiple paradigms (OOP, functional, procedural)."

        return 0.0, ""

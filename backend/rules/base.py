import re

class BaseRule:
    intent: str = "Base"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        """
        Evaluate input text and return a confidence score and response text.
        
        Confidence Scores:
        - 1.0: Exact keyword/phrase match (highest priority)
        - 0.8: Regular expression (regex) matches
        - 0.6: General keyword occurrences or fuzzy pattern structures
        - 0.0: No match
        """
        raise NotImplementedError("Subclasses must implement match()")

import re
from rules.base import BaseRule

class MachineLearningRule(BaseRule):
    intent = "Machine Learning"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Exact keyword matches
        exact_keywords = ["ml", "machine learning", "supervised learning"]
        if cleaned_text in exact_keywords:
            return 1.0, "Machine Learning (ML) is a subset of AI that allows systems to learn from data, identify patterns, and make decisions with minimal human intervention."

        # Regex / Structural Pattern checks
        if re.search(r"(what\s+is\s+ml|tell\s+me\s+about\s+ml|define\s+machine\s+learning|unsupervised\s+learning)", cleaned_text):
            return 0.8, "ML algorithms construct statistical models using training data. Common fields include neural networks, linear regression, clustering, and deep learning algorithms."

        # General keyword occurrences
        if "machine learning" in cleaned_text or "training data" in cleaned_text or "deep learning" in cleaned_text:
            return 0.6, "In ML, models are trained on datasets rather than using static hard-coded rule tables. This distinguishes them from simple rule-based agents!"

        return 0.0, ""

import re
from rules.base import BaseRule

class AIRule(BaseRule):
    intent = "AI"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Exact keyword matches
        exact_keywords = ["ai", "artificial intelligence", "singularity"]
        if cleaned_text in exact_keywords:
            return 1.0, "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines. These systems are programmed to think, learn, and perform tasks that typically require human reasoning."

        # Regex / Structural Pattern checks
        if re.search(r"(what\s+is\s+ai|tell\s+me\s+about\s+ai|define\s+artificial\s+intelligence)", cleaned_text):
            return 0.8, "AI is a broad field of computer science encompassing robotics, natural language processing, expert systems, and machine learning. Its goal is to build agents that solve complex challenges."

        # General keyword occurrences
        if "artificial" in cleaned_text or "intelligence" in cleaned_text or "chatbot" in cleaned_text:
            return 0.6, "Chatbots, neural networks, computer vision, and expert decision trees are all subsets of AI technology."

        return 0.0, ""

import re
from rules.base import BaseRule

class FAQsRule(BaseRule):
    intent = "General FAQs"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Bot Name FAQs
        if re.search(r"\b(name|who\s+are\s+you|your\s+identity)\b", cleaned_text):
            return 1.0, "I am RuleBot, an intelligent chatbot that runs entirely on deterministic pre-programmed rules."

        # Creator FAQs
        if re.search(r"\b(creator|built\s+you|created\s+you|who\s+made\s+you|developer)\b", cleaned_text):
            return 1.0, "I was created as part of the CodSoft Artificial Intelligence Internship Task 1 project."

        # Real/AI FAQs
        if re.search(r"\b(real|human|person|robot|ai|are\s+you\s+real)\b", cleaned_text):
            return 0.8, "I am an artificial agent. I do not have consciousness, but I simulate conversation using regex and keyword matches."

        # Rule Bot explanation FAQs
        if "rule-based" in cleaned_text or "how do you think" in cleaned_text or "rule engine" in cleaned_text:
            return 0.8, "As a rule-based bot, I process text by stripping punctuation, matching exact keywords, checking regex, and picking the highest confidence match."

        # Location FAQ
        if re.search(r"\b(where\s+do\s+you\s+live|location|where\s+are\s+you)\b", cleaned_text):
            return 0.8, "I live inside a virtual server environment on your machine or inside Docker containers."

        return 0.0, ""

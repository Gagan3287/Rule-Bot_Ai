import re
from rules.base import BaseRule

class WebDevelopmentRule(BaseRule):
    intent = "Web Development"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Exact keyword matches
        exact_keywords = ["web development", "web dev", "frontend", "backend", "fullstack"]
        if cleaned_text in exact_keywords:
            return 1.0, "Web Development involves building and maintaining web applications. It includes front-end technologies (like HTML, CSS, JavaScript, and React) and back-end architectures with servers and databases."

        # Regex / Structural Pattern checks
        if re.search(r"(what\s+is\s+web\s+development|tell\s+me\s+about\s+web\s+development|how\s+to\s+build\s+a\s+website)", cleaned_text):
            return 0.8, "Modern web dev spans client interfaces (HTML/CSS/JS, React, Next.js), backend gateways (Python FastAPI, Node Express, Go), database persistence layers, and server deployment architectures."

        # General keyword occurrences
        web_terms = ["html", "css", "javascript", "react", "nextjs", "website", "http", "api"]
        if any(term in cleaned_text for term in web_terms):
            return 0.6, "Frontend developer tracks center on browser runtime engines (HTML, CSS, JS/TS, DOM APIs) while backends manipulate server operations and database states."

        return 0.0, ""

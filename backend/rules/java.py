import re
from rules.base import BaseRule

class JavaRule(BaseRule):
    intent = "Java"

    def match(self, cleaned_text: str, raw_text: str) -> tuple[float, str]:
        # Exact keyword matches
        exact_keywords = ["java", "jvm", "jdk"]
        if cleaned_text in exact_keywords:
            return 1.0, "Java is a popular, class-based, object-oriented programming language. It is designed to run on any machine containing a Java Virtual Machine (JVM), enabling 'write once, run anywhere' capabilities."

        # Regex / Structural Pattern checks
        if re.search(r"(what\s+is\s+java|tell\s+me\s+about\s+java|define\s+java|jvm\s+architecture)", cleaned_text):
            return 0.8, "Java was released by Sun Microsystems in 1995. It is strongly-typed, memory-safe (via garbage collection), and highly popular for enterprise server backends and Android development."

        # General keyword occurrences
        if "java" in cleaned_text or "maven" in cleaned_text or "springboot" in cleaned_text:
            return 0.6, "Java projects typically use package tools like Maven or Gradle. Web APIs are frequently built on Spring Boot."

        return 0.0, ""

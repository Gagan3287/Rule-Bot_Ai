import re
import logging

from rules.greetings import GreetingsRule
from rules.farewells import FarewellsRule
from rules.help import HelpRule
from rules.date import DateRule
from rules.time import TimeRule
from rules.weather import WeatherRule
from rules.programming import ProgrammingRule
from rules.python import PythonRule
from rules.java import JavaRule
from rules.ai import AIRule
from rules.ml import MachineLearningRule
from rules.web_dev import WebDevelopmentRule
from rules.college import CollegeRule
from rules.faqs import FAQsRule
from rules.unknown import UnknownRule

# ── Logging Configuration ─────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("RuleBot.Engine")

# ── Confidence Levels ─────────────────────────────────────────────────────────
#  1.0  →  Exact keyword / phrase match       (highest priority)
#  0.8  →  Regex / structural pattern match
#  0.6  →  General keyword occurrence
#  0.0  →  No match (Unknown fallback triggered when best < 0.3)

class RuleEngine:
    """
    Confidence-based intent-matching engine.
    All rules are evaluated; the rule with the highest confidence wins.
    Exact keyword matches (1.0) beat regex matches (0.8) and fuzzy checks (0.6).
    """

    _rules = [
        GreetingsRule(),
        FarewellsRule(),
        HelpRule(),
        DateRule(),
        TimeRule(),
        WeatherRule(),
        ProgrammingRule(),
        PythonRule(),
        JavaRule(),
        AIRule(),
        MachineLearningRule(),
        WebDevelopmentRule(),
        CollegeRule(),
        FAQsRule(),
        # UnknownRule is always the last-resort fallback
    ]
    _fallback = UnknownRule()

    @classmethod
    def match_intent(cls, text: str) -> tuple[str, str]:
        """
        Steps:
          1. Strip & lowercase input.
          2. Remove trailing punctuation for robust exact matching.
          3. Evaluate every rule and collect confidence scores.
          4. Select highest-confidence winner.
          5. Fall back to Unknown when best confidence < 0.3.
          6. Log the result.
        Returns: (intent_name, response_text)
        """
        raw_text = text.strip()
        text_lower = raw_text.lower()
        # Remove trailing punctuation so "Hello!" == "hello"
        cleaned = re.sub(r'[!?,.:;]+$', '', text_lower).strip()

        best_confidence: float = 0.0
        best_intent: str = "Unknown"
        best_response: str = ""

        # ── Evaluate every rule ────────────────────────────────────────────
        for rule in cls._rules:
            try:
                confidence, response = rule.match(cleaned, raw_text)
            except Exception as exc:
                logger.error("Rule '%s' raised an error: %s", rule.intent, exc)
                continue

            if confidence > best_confidence:
                best_confidence = confidence
                best_intent = rule.intent
                best_response = response

        # ── Threshold check ────────────────────────────────────────────────
        if best_confidence < 0.3:
            _, best_response = cls._fallback.match(cleaned, raw_text)
            best_intent = cls._fallback.intent

        # ── Structured log ─────────────────────────────────────────────────
        logger.info(
            "[RuleEngine] Query: %r | Intent: %r | Confidence: %.2f",
            raw_text, best_intent, best_confidence
        )

        return best_intent, best_response

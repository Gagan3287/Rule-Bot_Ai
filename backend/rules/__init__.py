# Rules package – absolute imports (backend/ is the working directory)
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

__all__ = [
    "GreetingsRule", "FarewellsRule", "HelpRule", "DateRule",
    "TimeRule", "WeatherRule", "ProgrammingRule", "PythonRule",
    "JavaRule", "AIRule", "MachineLearningRule", "WebDevelopmentRule",
    "CollegeRule", "FAQsRule", "UnknownRule"
]

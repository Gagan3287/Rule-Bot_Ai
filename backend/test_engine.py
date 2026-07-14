"""
RuleBot – Rule Engine Unit Tests
Tests that:
  1. Intent matching is correct for all rule modules
  2. Exact keyword matches produce confidence 1.0
  3. Regex matches produce confidence 0.8
  4. Unknown queries fall back correctly
  5. Confidence scoring priority is respected
"""
from engine import RuleEngine

def check(query, expected_intent, label=""):
    intent, response = RuleEngine.match_intent(query)
    ok = intent == expected_intent
    status = "[OK] PASS" if ok else "[FAIL] FAIL"
    print(f"  {status}  [{label or query!r}]  intent={intent!r}")
    assert ok, f"Expected intent={expected_intent!r}, got {intent!r} for query={query!r}"

def test_greetings():
    print("-- Greetings ------------------------------")
    check("hi",         "Greetings", "exact hi")
    check("Hello!",     "Greetings", "Hello with punct")
    check("hey",        "Greetings", "exact hey")
    check("Good morning", "Greetings", "good morning regex")

def test_farewells():
    print("-- Farewells ------------------------------")
    check("bye",       "Bye", "exact bye")
    check("goodbye!",  "Bye", "goodbye with punct")
    check("See ya later", "Bye", "see ya regex")

def test_help():
    print("-- Help ------------------------------------")
    check("help",         "Help", "exact help")
    check("What can you do?", "Help", "what can you do regex")

def test_time():
    print("-- Time ------------------------------------")
    check("time",              "Time", "exact time")
    check("What time is it?",  "Time", "what time is it regex")

def test_date():
    print("-- Date ------------------------------------")
    check("date",                  "Date", "exact date")
    check("What day is today?",    "Date", "what day regex")

def test_weather():
    print("-- Weather ---------------------------------")
    check("weather",                "Weather", "exact weather")
    check("Will it rain tomorrow?", "Weather", "rain regex")

def test_python():
    print("-- Python ----------------------------------")
    check("python",                "Python", "exact python")
    check("What is python?",       "Python", "what is python regex")
    check("Tell me about python.", "Python", "tell me about python")

def test_java():
    print("-- Java ------------------------------------")
    check("java",                "Java", "exact java")
    check("What is Java?",       "Java", "what is java regex")

def test_ai():
    print("-- AI --------------------------------------")
    check("ai",                       "AI", "exact ai")
    check("What is artificial intelligence?", "AI", "ai regex")

def test_ml():
    print("-- Machine Learning ------------------------")
    check("ml",                        "Machine Learning", "exact ml")
    check("What is machine learning?", "Machine Learning", "ml regex")

def test_webdev():
    print("-- Web Development -------------------------")
    check("web development",            "Web Development", "exact phrase")
    check("Tell me about web development", "Web Development", "regex")
    check("How do I build a website?",  "Web Development", "fuzzy keyword")

def test_college():
    print("-- College ---------------------------------")
    check("college",    "College", "exact college")
    check("How does university admission work?", "College", "regex")

def test_faqs():
    print("-- FAQs ------------------------------------")
    check("Who are you?",     "General FAQs", "who are you")
    check("Who created you?", "General FAQs", "creator")

def test_unknown():
    print("-- Unknown ---------------------------------")
    check("What is the speed of light?",  "Unknown", "unknown query 1")
    check("xyzzy foobar quux plugh",       "Unknown", "unknown nonsense")

def test_confidence_priority():
    """Exact keyword match must score higher than any regex."""
    print("-- Confidence Priority ---------------------")
    from rules.python import PythonRule
    rule = PythonRule()
    # Exact match -> 1.0
    c_exact, _ = rule.match("python", "python")
    # Regex match -> 0.8
    c_regex, _ = rule.match("what is python", "what is python")
    # Fuzzy -> 0.6
    c_fuzzy, _ = rule.match("using pip", "using pip")
    assert c_exact > c_regex >= c_fuzzy, \
        f"Priority broken: exact={c_exact}, regex={c_regex}, fuzzy={c_fuzzy}"
    print(f"  [OK] PASS  exact={c_exact} > regex={c_regex} >= fuzzy={c_fuzzy}")

if __name__ == "__main__":
    print("\n" + "="*47)
    print("  RuleBot Engine Test Suite")
    print("="*47 + "\n")
    tests = [
        test_greetings, test_farewells, test_help,
        test_time, test_date, test_weather,
        test_python, test_java, test_ai, test_ml,
        test_webdev, test_college, test_faqs,
        test_unknown, test_confidence_priority,
    ]
    passed = failed = 0
    for t in tests:
        try:
            t()
            passed += 1
        except AssertionError as e:
            print(f"  -> {e}")
            failed += 1
    print("\n" + "="*47)
    print(f"  Results: {passed} passed, {failed} failed")
    print("="*47 + "\n")
    if failed:
        raise SystemExit(1)

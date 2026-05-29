"""
description_diagnostic_service.py

Free lead-gen tool for analyzing MLS listing descriptions.
Pre-processes deterministic signals (clichés, AI tells, length) before
the LLM call so the chain has concrete data to ground its output.
"""

import logging
import re

logger = logging.getLogger(__name__)

MAX_INPUT_LENGTH = 2000
TOOL_RUN_LIMIT = 3
TOOL_TTL = 604800  # 7 days

REAL_ESTATE_CLICHES = [
    "stunning", "must-see", "dream home", "meticulously maintained",
    "meticulous", "boasts", "showcases", "pristine", "immaculate",
    "exquisite", "tranquil oasis", "perfect blend of", "in the heart of",
    "nestled",
]

AI_TELL_WORDS = [
    "delve", "tapestry", "embark", "elevate", "captivating", "elegant",
    "moreover", "furthermore", "additionally",
]

AI_TELL_PHRASES = [
    "more than just",
    "in today's market",
    "the perfect blend of",
    "whether you're",
    "welcome to your new home",
    "don't miss this opportunity",
    "it's not just",
]

GENERIC_OPENINGS = [
    "welcome to", "discover", "nestled", "introducing",
]

GENERIC_CLOSINGS = [
    "don't miss this", "schedule your showing", "welcome home",
    "this one won't last", "experience",
]


def _tool_diagnostic_key(ip: str) -> str:
    return f"tool:diagnostic:{ip}"


def _tool_email_key(ip: str) -> str:
    return f"tool:email:{ip}"


def check_ip_gate(ip: str, email: str | None, redis_client) -> dict:
    key = _tool_diagnostic_key(ip)
    email_key = _tool_email_key(ip)

    raw_count = redis_client.get(key)
    runs_used = int(raw_count) if raw_count else 0
    email_on_file = redis_client.get(email_key) is not None

    if email and not email_on_file:
        redis_client.setex(email_key, TOOL_TTL, email.encode())
        email_on_file = True

    allowed = runs_used < TOOL_RUN_LIMIT or email_on_file

    return {
        "allowed": allowed,
        "runs_used": runs_used,
        "email_on_file": email_on_file,
    }


def increment_run_count(ip: str, redis_client) -> None:
    key = _tool_diagnostic_key(ip)
    pipe = redis_client.pipeline()
    pipe.incr(key)
    pipe.expire(key, TOOL_TTL)
    pipe.execute()


def compute_deterministic_signals(description: str) -> str:
    text_lower = description.lower()

    cliches_found = [c for c in REAL_ESTATE_CLICHES if c in text_lower]
    ai_words_found = [w for w in AI_TELL_WORDS if w in text_lower]
    ai_phrases_found = [p for p in AI_TELL_PHRASES if p in text_lower]
    em_dash_count = description.count("—")

    first_30 = text_lower[:30].strip()
    generic_opening_match = next(
        (g for g in GENERIC_OPENINGS if first_30.startswith(g)), None
    )

    last_60 = text_lower[-60:].strip()
    generic_closing_match = next(
        (g for g in GENERIC_CLOSINGS if g in last_60), None
    )

    char_count = len(description)
    if char_count < 600:
        length_signal = f"{char_count} chars (CRITICAL: under 600)"
    elif char_count < 800:
        length_signal = f"{char_count} chars (NEEDS WORK: under sweet spot of 800-950)"
    elif char_count <= 950:
        length_signal = f"{char_count} chars (STRONG: within 800-950 sweet spot)"
    elif char_count <= 1000:
        length_signal = f"{char_count} chars (NEEDS WORK: over MLS sweet spot)"
    else:
        length_signal = f"{char_count} chars (CRITICAL: over 1000, MLS rejection risk)"

    sentence_count = len(re.findall(r"[.!?]+", description))

    lines = [
        f"- Length: {length_signal}",
        f"- Sentences detected: {sentence_count}",
        f"- Em-dashes: {em_dash_count} {'(2+ pairs is an AI pattern)' if em_dash_count >= 4 else ''}",
    ]

    if generic_opening_match:
        lines.append(f"- Generic opening detected: starts with '{generic_opening_match}'")
    if generic_closing_match:
        lines.append(f"- Generic closing detected: '{generic_closing_match}'")
    if cliches_found:
        lines.append(f"- Real estate clichés found: {', '.join(cliches_found)}")
    if ai_words_found:
        lines.append(f"- AI-tell words found: {', '.join(ai_words_found)}")
    if ai_phrases_found:
        lines.append(f"- AI-tell phrases found: {', '.join(ai_phrases_found)}")

    if not (cliches_found or ai_words_found or ai_phrases_found or generic_opening_match or generic_closing_match):
        lines.append("- No deterministic red flags detected — evaluate qualitative criteria carefully")

    return "\n".join(lines)
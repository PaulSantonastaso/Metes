"""
description_diagnostic_chain.py

Analyzes an MLS listing description against 7 craft criteria and returns
a structured diagnostic report.

Uses Gemini Flash Lite for cost efficiency (~$0.002/call).
Hybrid evaluation — deterministic signals pre-computed in Python and
passed to the LLM, which generates the structured report.

The 7 criteria:
  1. opening_hook
  2. specific_language
  3. ai_tells
  4. sensory_lifestyle
  5. neighborhood_context
  6. length_structure
  7. closing

Each criterion returns a state (strong / needs_work / critical) and detailed
feedback for the expand-on-click view.
"""

from typing import Literal

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field


CriterionState = Literal["strong", "needs_work", "critical"]


class CriterionReport(BaseModel):
    state: CriterionState = Field(
        description="One of: 'strong', 'needs_work', 'critical'."
    )
    summary: str = Field(
        description="One-line summary of what this criterion found (12-20 words)."
    )
    issues: list[str] = Field(
        default_factory=list,
        description=(
            "Specific issues found, each as a short sentence. "
            "Empty list if state is 'strong'. "
            "Reference exact phrases from the description when possible."
        ),
    )
    suggestion: str = Field(
        description=(
            "One actionable suggestion for improvement (1-2 sentences). "
            "If state is 'strong', briefly explain what's working well."
        )
    )


class DescriptionDiagnostic(BaseModel):
    opening_hook: CriterionReport
    specific_language: CriterionReport
    ai_tells: CriterionReport
    sensory_lifestyle: CriterionReport
    neighborhood_context: CriterionReport
    length_structure: CriterionReport
    closing: CriterionReport


DIAGNOSTIC_PROMPT = """You are an expert real estate copy editor evaluating an MLS listing description against seven craft criteria.

DESCRIPTION TO EVALUATE:
{description}

CHARACTER COUNT: {char_count}

PRE-COMPUTED SIGNALS (deterministic checks already run):
{deterministic_signals}

═══════════════════════════════════════════════════════════════
YOUR TASK — produce a structured diagnostic report
═══════════════════════════════════════════════════════════════

For each of the seven criteria below, return:
  - state: "strong" | "needs_work" | "critical"
  - summary: one-line finding (12-20 words)
  - issues: list of specific problems (empty if strong)
  - suggestion: actionable advice or affirmation

═══════════════════════════════════════════════════════════════
THE SEVEN CRITERIA
═══════════════════════════════════════════════════════════════

1. OPENING HOOK
   Does the first sentence pull the reader in with movement or sensory detail?
   - STRONG: Opens with action, sensory verb, or specific lifestyle moment
   - NEEDS WORK: Opens with a feature list or weak descriptor
   - CRITICAL: Opens with generic greeting ("Welcome to", "Discover", "Nestled in")

2. SPECIFIC VS GENERIC LANGUAGE
   Does the copy use concrete details or rely on real estate clichés?
   Clichés to flag: "stunning", "must-see", "dream home", "meticulously maintained",
   "boasts", "showcases", "pristine", "immaculate", "exquisite", "tranquil oasis",
   "perfect blend of", "in the heart of"
   - STRONG: Specific features named, no clichés
   - NEEDS WORK: 1-2 clichés present
   - CRITICAL: 3+ clichés or descriptor-heavy with no specifics

3. AI / CHATGPT TELLS
   Does the copy contain modern LLM stylistic patterns that signal AI authorship?
   AI tells to flag:
   - Words: "delve", "tapestry", "embark", "elevate", "captivating", "elegant"
   - Phrases: "it's not just X — it's Y", "more than just", "whether you're X or Y",
     "in today's market", "the perfect blend of"
   - Formal transitions: "moreover", "furthermore", "additionally", "in conclusion"
   - Em-dash pairs (— X — Y —) used decoratively
   - Generic openings: "Welcome to your new home", "Don't miss this opportunity"
   - STRONG: Reads human, no LLM patterns
   - NEEDS WORK: 1-2 AI tells
   - CRITICAL: 3+ AI tells or unmistakably AI-generated feel

4. SENSORY AND LIFESTYLE LANGUAGE
   Does the copy paint a lifestyle, or read like a spec sheet?
   Look for sensory verbs (slide, pour, retreat, gather, prep, unwind) and
   lifestyle moments (morning, weekend, dinner party, after work).
   - STRONG: Multiple sensory or lifestyle moments
   - NEEDS WORK: One sensory moment, otherwise feature-list
   - CRITICAL: Pure spec-sheet with no sensory or lifestyle language

5. NEIGHBORHOOD CONTEXT
   Does the description mention specific nearby places, landmarks, or amenities by name?
   Generic claims ("great location", "close to everything") do not count.
   - STRONG: Specific named places (coffee shops, parks, landmarks)
   - NEEDS WORK: Mentions location generically without specifics
   - CRITICAL: No neighborhood context at all

6. LENGTH AND STRUCTURE
   Is the description within the MLS sweet spot of 800-950 characters?
   The character count is provided above.
   - STRONG: 800-950 characters
   - NEEDS WORK: 600-799 (too short) or 951-1000 (over MLS cap risk)
   - CRITICAL: Under 600 or over 1000

7. CLOSING
   Does the last sentence reinforce the strongest selling point or create urgency?
   Generic closes to flag: "Don't miss this", "Schedule your showing today",
   "Welcome home", "This one won't last", "Experience X living"
   - STRONG: Concrete urgency tied to the property's distinctive feature
   - NEEDS WORK: Soft close, no clear reinforcement
   - CRITICAL: Generic closing phrase or no real close

═══════════════════════════════════════════════════════════════
RULES
═══════════════════════════════════════════════════════════════

- Reference exact phrases from the description when flagging issues.
- Be specific and actionable in suggestions.
- If a criterion is strong, briefly explain what's working.
- Use the pre-computed signals where provided — don't re-do work that's already done.
- Be honest. A mediocre description should get mostly "needs_work" states, not all "strong".
"""


def build_description_diagnostic_chain(api_key: str):
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.1-flash-lite",
        google_api_key=api_key,
        temperature=0.3,
    )
    structured_llm = llm.with_structured_output(DescriptionDiagnostic)
    prompt = ChatPromptTemplate.from_messages([("user", DIAGNOSTIC_PROMPT)])
    return prompt | structured_llm


async def generate_diagnostic(
    description: str,
    deterministic_signals: str,
    api_key: str,
) -> DescriptionDiagnostic | None:
    if not description or not description.strip():
        return None

    try:
        chain = build_description_diagnostic_chain(api_key).with_config(
            run_name="Description Diagnostic"
        )
        result = await chain.ainvoke({
            "description": description,
            "char_count": len(description),
            "deterministic_signals": deterministic_signals,
        })
        return result if isinstance(result, DescriptionDiagnostic) else None
    except Exception as e:
        import logging
        logging.getLogger(__name__).info(f"Description diagnostic failed: {e}")
        print(f"[DIAGNOSTIC CHAIN ERROR] {e}")
        return None
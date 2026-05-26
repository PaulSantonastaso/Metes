"""
neighborhood_chain.py

Generates a structured multi-section neighborhood guide from Places API data.
The LLM handles all curation — no blocklist.

Single Flash Lite call does four things:
  1. Selects places across four sections from up to 33 candidates
  2. Writes mls_insert — 1-2 sentences for weaving into MLS description
  3. Writes lifestyle_paragraph — ~400 char paragraph for the ZIP file
  4. Distributes selected places into everyday / outdoor / dining / wellness sections

Uses Gemini Flash Lite for cost efficiency (~$0.002/call).
Grounded strictly in Places API data — no invented details.
Fair Housing compliant — lifestyle and amenity focus only.
"""

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field


class CategoryPlace(BaseModel):
    name: str = Field(
        description="Exact place name as it appeared in the candidate list. Never invent names."
    )
    description: str = Field(
        description=(
            "One short line (8-15 words) describing what makes this place worth mentioning. "
            "Lifestyle-forward, specific. No distances, no drive times, no superlatives."
        )
    )


class NeighborhoodOutput(BaseModel):
    selected_places: list[str] = Field(
        description=(
            "Names of every place chosen across all four sections. "
            "Used for debugging and future transparency features."
        )
    )
    mls_insert: str = Field(
        description=(
            "1-2 sentences describing nearby neighborhood highlights. "
            "Specific place names only. Lifestyle-forward, not a list. "
            "Suitable for weaving naturally into an MLS description. "
            "Empty string if no compelling places available."
        )
    )
    lifestyle_paragraph: str = Field(
        description=(
            "Prose paragraph capturing neighborhood character. "
            "Target ~400 characters / ~70 words — must fit MLS community field. "
            "Lifestyle-forward, conversational, specific to the actual places nearby. "
            "Not a bulleted list. Empty string if no compelling places available."
        )
    )
    everyday: list[CategoryPlace] = Field(
        default_factory=list,
        description=(
            "0-5 places for daily life: groceries, coffee, bakery, pharmacy, bank, farmers market. "
            "Leave empty if no quality options exist — do not fill with weak entries."
        ),
    )
    outdoor: list[CategoryPlace] = Field(
        default_factory=list,
        description=(
            "0-5 outdoor & recreation places: parks, trails, recreation areas. "
            "Leave empty if none nearby — do not fill with weak entries."
        ),
    )
    dining: list[CategoryPlace] = Field(
        default_factory=list,
        description=(
            "0-5 dining-out places: restaurants. Mix of casual, upscale, local favorites. "
            "Leave empty if no notable options — do not fill with weak entries."
        ),
    )
    wellness: list[CategoryPlace] = Field(
        default_factory=list,
        description=(
            "0-5 wellness & fitness places: yoga, pilates, notable gyms. "
            "Leave empty if no notable options — do not fill with generic chains."
        ),
    )


NEIGHBORHOOD_PROMPT = """You are a real estate copywriter who knows what makes a neighborhood feel premium and desirable.

PROPERTY ADDRESS:
{address}

NEARBY PLACES (from live Google Places data — name, category, rating, review count):
{places_formatted}

YOUR TASK — produce a curated, multi-section neighborhood guide.

═══════════════════════════════════════════════════════════════
BRAND TIER — READ THIS BEFORE CURATING
═══════════════════════════════════════════════════════════════

Brand quality signals neighborhood quality to buyers. A Whole Foods on the corner sells houses. A Walmart does not.

PRIORITIZE (these brands signal premium neighborhoods):
- Grocery: Whole Foods, Trader Joe's, Fresh Market, Sprouts, Publix (in FL), Wegmans, Erewhon
- Coffee: local independents, Blue Bottle, Stumptown, Intelligentsia, La Colombe, Foxtail
- Fitness: Equinox, Lifetime, Orangetheory, F45, SoulCycle, Barry's, [solidcore], Pure Barre
- Restaurants: local independents with strong reputations, James Beard recognition, notable chef-driven concepts

DEPRIORITIZE (these signal value-tier neighborhoods and should be skipped unless nothing else exists):
- Grocery: Walmart, Aldi (in lower-tier contexts), Dollar General, Food Lion
- Coffee: Dunkin' (unless regionally beloved), generic chains
- Fitness: Planet Fitness, Crunch, generic 24-hour gyms
- Restaurants: fast food chains, generic chain casual dining

Rule of thumb: a beloved local institution with strong reviews always beats a chain. A premium chain beats a value chain. If only value-tier options exist for a category, leave that section empty rather than fill it with weak entries.

═══════════════════════════════════════════════════════════════
STEP 1 — DISTRIBUTE PLACES ACROSS FOUR SECTIONS
═══════════════════════════════════════════════════════════════

Bucket eligibility by category:

  EVERYDAY     → supermarket, coffee_shop, bakery, farmers_market, pharmacy, bank
  OUTDOOR      → park
  DINING       → restaurant
  WELLNESS     → yoga_studio, pilates_studio, gym

For each section, select 3-5 of the strongest places. Each place appears in only one section.
Quality over quantity — if a section has fewer than 3 worthwhile places, include only those. If it has none, leave it empty.

For each selected place, write a one-line description (8-15 words) — lifestyle-forward, specific, no distances or drive times.

Example descriptions:
  - "Local roaster pulling some of the city's best espresso since 2014."
  - "Quiet 40-acre park with paved loop trail and shaded picnic pavilions."
  - "Chef-driven Italian, handmade pasta, the kind of place locals book early."

═══════════════════════════════════════════════════════════════
STEP 2 — WRITE mls_insert
═══════════════════════════════════════════════════════════════

1-2 sentences. Specific place names from your selection. Lifestyle-forward, not a list.
Suitable for weaving naturally into an MLS description.

Example: "Steps from Foxtail Coffee and a short walk to Lake Weston Park — the kind of neighborhood that sells itself once buyers arrive."

═══════════════════════════════════════════════════════════════
STEP 3 — WRITE lifestyle_paragraph
═══════════════════════════════════════════════════════════════

A prose paragraph capturing neighborhood character.

LENGTH TARGET: ~400 characters / ~70 words. Hard ceiling 500 characters.
This must fit the MLS community/neighborhood field on most MLS systems.

Reads like a local recommending the area to a friend. Specific, evocative, conversational.
Not a bulleted list. May reference places that also appear in the bulleted sections — that's expected.

Example (398 chars): "Westover Hills sits on Orlando's quiet west side, where tree-lined streets meet genuine neighborhood character. Foxtail Coffee is two blocks north — the kind of place regulars know by name. Lake Weston Park is a five-minute walk for morning runs or weekend afternoons, and Whole Foods anchors the daily routine."

═══════════════════════════════════════════════════════════════
STEP 4 — populate selected_places
═══════════════════════════════════════════════════════════════

List every place name you used across all four sections. Used for debugging.

═══════════════════════════════════════════════════════════════
HARD RULES
═══════════════════════════════════════════════════════════════

- Only mention places from the provided list. Never invent places or features.
- Do not describe demographics, schools, religious institutions, or who lives there.
- Do not use the words "nestled", "charming", "vibrant", "trendy", or "up-and-coming".
- Use proximity language ("nearby", "close by", "a short drive", "a few minutes away") — not specific drive times or distances in miles. Reserve "steps from" and "walking distance" for places that truly are within walking range; the candidate list spans up to 2.5 miles.
- If the list contains nothing worth highlighting, return empty strings for mls_insert and lifestyle_paragraph and empty lists for all four sections.
- Fair Housing: lifestyle and amenity focus only. No demographic implications."""


def build_neighborhood_chain(api_key: str):
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.1-flash-lite",
        google_api_key=api_key,
        temperature=0.5,
    )

    structured_llm = llm.with_structured_output(NeighborhoodOutput)

    prompt = ChatPromptTemplate.from_messages([
        ("user", NEIGHBORHOOD_PROMPT),
    ])

    return prompt | structured_llm


async def generate_neighborhood_copy(
    address: str,
    places_formatted: str,
    api_key: str,
) -> NeighborhoodOutput | None:
    if not places_formatted.strip():
        return None

    try:
        chain = build_neighborhood_chain(api_key).with_config(run_name="Neighborhood Copy")
        result = await chain.ainvoke({
            "address": address,
            "places_formatted": places_formatted,
        })
        return result if isinstance(result, NeighborhoodOutput) else None
    except Exception as e:
        import logging
        logging.getLogger(__name__).info(f"Neighborhood chain failed: {e}")
        print(f"[NEIGHBORHOOD CHAIN ERROR] {e}")
        return None
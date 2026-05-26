"""
package_builder_service.py

Builds a complete marketing package ZIP in memory from a pipeline results dict.
Returns bytes that can be passed directly to the download endpoint.

No file system writes — everything lives in memory and is garbage collected
after the download is served.

ZIP contents:
  00_summary.txt                Agent receipt — metadata, image intel, compliance, manifest
  01_headline.txt
  02_mls_description.txt
  03_social_posts.txt
  04_email_campaign.txt
  05_compliance_audit.txt
  06_neighborhood_insight.txt   (only included when neighborhood_guide is populated)
  07_photo_captions.txt         (only included when rename_result is provided)
  /photos/curated/              Top 25 photos, ranked and renamed
  /photos/additional/           Remaining photos
"""

import io
import zipfile
from datetime import datetime


def _format_header(title: str) -> str:
    border = "=" * 60
    return f"{border}\n{title}\n{border}\n\n"


def _format_section(title: str, content: str) -> str:
    border = "-" * 40
    return f"{border}\n{title}\n{border}\n{content}\n\n"


def _build_headline_file(res: dict) -> str:
    lines = [_format_header("LISTING HEADLINE")]
    lines.append(res.get("headline", "No headline generated."))
    lines.append("\n\nUSAGE:")
    lines.append("- Zillow 'What's Special' section")
    lines.append("- Email subject lines")
    lines.append("- Social media captions")
    lines.append("- Open house signage")
    return "\n".join(lines)


def _build_mls_description_file(res: dict) -> str:
    mls = res.get("mls_summary", "No MLS description generated.")
    char_count = len(mls)
    lines = [_format_header("MLS DESCRIPTION")]
    lines.append(mls)
    lines.append(f"\n\n[{char_count} / 950 characters]")
    return "\n".join(lines)


def _build_social_posts_file(res: dict) -> str:
    lines = [_format_header("SOCIAL MEDIA POSTS")]
    social_posts = res.get("social_posts", [])

    if not social_posts:
        lines.append("No social posts generated.")
        return "\n".join(lines)

    for post in social_posts:
        platform = post.platform or "Social"
        slot = (post.slot_name or "post").replace("_", " ").title()
        label = f"{platform} — {slot}"

        details = []
        if post.recommended_aspect_ratio:
            details.append(f"Aspect ratio: {post.recommended_aspect_ratio}")
        if post.image_filename:
            details.append(f"Image: {post.image_filename}")
        if post.room_type:
            details.append(f"Room: {post.room_type.replace('_', ' ').title()}")
        if post.crop_guidance:
            details.append(f"Crop guidance: {post.crop_guidance}")

        detail_str = "\n".join(details)
        content = f"{detail_str}\n\nCAPTION:\n{post.social_media_post}"
        lines.append(_format_section(label, content))

    return "\n".join(lines)


def _build_email_campaign_file(res: dict, email_tone: str = "Professional") -> str:
    lines = [_format_header(f"EMAIL CAMPAIGN — {email_tone.upper()} TONE")]
    lines.append(
        "Fill in [DAYS ON MARKET] and [SOLD PRICE] in the Just Sold email before sending.\n"
        "Fill in [Day] and [Time] in the Open House email before sending.\n"
    )

    campaign = res.get("email_campaign")
    if not campaign:
        lines.append("No email campaign generated.")
        return "\n".join(lines)

    emails = [
        ("EMAIL 1 — JUST LISTED", campaign.just_listed, "Send day 1 the listing goes live."),
        ("EMAIL 2 — OPEN HOUSE INVITATION", campaign.open_house, "Send day 3-5 before the open house."),
        ("EMAIL 3 — WHY THIS HOME", campaign.why_this_home, "Send day 7-10, mid-campaign."),
        ("EMAIL 4 — JUST SOLD", campaign.just_sold, "Send post-close. Fill in placeholders before sending."),
    ]

    for label, email, timing in emails:
        content = (
            f"TIMING: {timing}\n\n"
            f"SUBJECT: {email.subject}\n"
            f"PREVIEW: {email.preview_text}\n\n"
            f"BODY:\n{email.body}"
        )
        lines.append(_format_section(label, content))

    return "\n".join(lines)


def _compute_compliance_counts(compliance_results) -> dict:
    """
    Tally compliance review statuses. Single source of truth for both the
    summary file and the detailed audit file.

    Returns: {"total": int, "pass": int, "revised": int, "flagged": int}
    """
    counts = {"total": len(compliance_results), "pass": 0, "revised": 0, "flagged": 0}
    for review in compliance_results:
        if review.status in counts:
            counts[review.status] += 1
    return counts


def _build_compliance_audit_file(res: dict) -> str:
    lines = [_format_header("FAIR HOUSING COMPLIANCE AUDIT")]
    lines.append(
        "Every asset in your campaign has been reviewed for fair housing compliance.\n"
        "Review any FLAGGED or REVISED items before publishing.\n"
    )

    compliance_results = res.get("compliance_results", [])
    if not compliance_results:
        lines.append("No compliance results available.")
        return "\n".join(lines)

    counts = _compute_compliance_counts(compliance_results)
    audit_lines = []

    for review in compliance_results:
        status_icon = {"pass": "✓ PASS", "revised": "~ REVISED", "flagged": "! FLAGGED"}.get(
            review.status, "? UNKNOWN"
        )
        if review.asset_type == "neighborhood_lifestyle":
            label = "NEIGHBORHOOD GUIDE"
        else:
            label = review.asset_type.replace("_", " ").upper()
        entry = f"{status_icon} — {label}"

        if review.issues_found:
            entry += "\n  Issues:"
            for issue in review.issues_found:
                entry += f"\n    - {issue}"

        if review.reviewer_notes:
            entry += f"\n  Notes: {review.reviewer_notes}"

        audit_lines.append(entry)

    summary = (
        f"SUMMARY: {counts['total']} assets reviewed — "
        f"{counts['pass']} passed, "
        f"{counts['revised']} revised, "
        f"{counts['flagged']} flagged\n"
    )
    lines.append(summary)
    lines.append("\nDETAILED RESULTS:\n")
    lines.extend(audit_lines)

    return "\n".join(lines)

# Character target for the lifestyle paragraph — sized for the MLS
# community/neighborhood field on most boards.
NEIGHBORHOOD_PARAGRAPH_CHAR_LIMIT = 500


def _neighborhood_has_content(guide) -> bool:
    """True if the structured guide has anything worth rendering."""
    if guide is None:
        return False
    if getattr(guide, "lifestyle_paragraph", "").strip():
        return True
    return any([
        getattr(guide, "everyday", []),
        getattr(guide, "outdoor", []),
        getattr(guide, "dining", []),
        getattr(guide, "wellness", []),
    ])


def _format_neighborhood_section(title: str, items) -> str:
    """Format a single bulleted category section. Returns '' if no items."""
    if not items:
        return ""
    bullets = "\n".join(f"- {item.name} — {item.description}" for item in items)
    border = "-" * 40
    return f"{border}\n{title}\n{border}\n{bullets}\n\n"


def _build_neighborhood_insight_file(res: dict) -> str:
    """
    Multi-section neighborhood guide:
      - Lifestyle paragraph (sized for MLS community field, with char count)
      - The Everyday
      - Outdoor & Recreation
      - Dining Nearby
      - Wellness & Fitness

    Empty sections are omitted entirely. Sparse-data properties get a
    shorter file rather than placeholder text.
    """
    guide = res.get("neighborhood_guide")

    lines = [_format_header("NEIGHBORHOOD INSIGHT")]
    lines.append(
        "AI-generated neighborhood guide based on live local data.\n"
        "Review before sharing — verify place names are current.\n"
    )

    # --- Lifestyle paragraph (with char count footer like MLS file) ---
    paragraph = getattr(guide, "lifestyle_paragraph", "").strip() if guide else ""
    if paragraph:
        char_count = len(paragraph)
        section = (
            f"{'-' * 40}\n"
            f"NEIGHBORHOOD SUMMARY\n"
            f"{'-' * 40}\n"
            f"{paragraph}\n\n"
            f"[{char_count} / {NEIGHBORHOOD_PARAGRAPH_CHAR_LIMIT} characters]\n\n"
        )
        lines.append(section)

    # --- Categorical sections (omit empty ones entirely) ---
    if guide is not None:
        lines.append(_format_neighborhood_section("THE EVERYDAY", guide.everyday))
        lines.append(_format_neighborhood_section("OUTDOOR & RECREATION", guide.outdoor))
        lines.append(_format_neighborhood_section("DINING NEARBY", guide.dining))
        lines.append(_format_neighborhood_section("WELLNESS & FITNESS", guide.wellness))

    # Filter out the empty strings returned by skipped sections
    return "".join(part for part in lines if part)


def _build_summary_file(res: dict, address: str | None, rename_result=None) -> str:
    """
    Agent-facing receipt. First file alphabetically in the ZIP.
    Pulls metadata, image intelligence, and compliance results into a
    single scannable view.
    """
    lines = [_format_header("LISTING PACKAGE SUMMARY")]

    # --- Metadata ---
    listing_details = res.get("listing_details")
    pricing = getattr(listing_details, "pricing", None) if listing_details else None
    list_price_value = getattr(pricing, "list_price", None) if pricing else None
    list_price_str = f"${list_price_value:,}" if list_price_value else "—"

    generated_str = datetime.now().strftime("%B %d, %Y")
    address_str = address if address else "—"

    lines.append(f"Generated:      {generated_str}")
    lines.append(f"Property:       {address_str}")
    lines.append(f"List Price:     {list_price_str}")
    lines.append("")

    # --- Image Intelligence ---
    image_intel = res.get("image_intelligence")
    analyzed_images = res.get("property_images") or []

    photos_analyzed = len(analyzed_images)
    photos_selected = len(rename_result.curated) if rename_result else 0

    intel_lines = [
        f"Photos analyzed:           {photos_analyzed}",
        f"Photos selected for MLS:   {photos_selected}",
        "",
    ]

    if image_intel and getattr(image_intel, "highlights", None):
        intel_lines.append("Top features detected from your photos:")
        for highlight in image_intel.highlights[:5]:
            feature_name = highlight.feature.replace("_", " ").title()
            intel_lines.append(f"  - {feature_name}")
    else:
        intel_lines.append("Top features detected from your photos:")
        intel_lines.append("  (none detected)")

    lines.append(_format_section("IMAGE INTELLIGENCE", "\n".join(intel_lines)))

    # --- Compliance Audit ---
    compliance_results = res.get("compliance_results", [])
    counts = _compute_compliance_counts(compliance_results)

    compliance_lines = [
        f"Assets reviewed:  {counts['total']}",
        f"Passed:           {counts['pass']}",
        f"Revised:          {counts['revised']}",
        f"Flagged:          {counts['flagged']}",
    ]
    lines.append(_format_section("COMPLIANCE AUDIT", "\n".join(compliance_lines)))

    # --- Manifest ---
    manifest_lines = [
        "  00_summary.txt              This file",
        "  01_headline.txt             Listing headline + usage guide",
        "  02_mls_description.txt      MLS public remarks (under 950 chars)",
        "  03_social_posts.txt         Facebook + Instagram captions",
        "  04_email_campaign.txt       4-email drip campaign",
        "  05_compliance_audit.txt     Per-asset compliance review",
    ]
    if _neighborhood_has_content(res.get("neighborhood_guide")):
        manifest_lines.append("  06_neighborhood_insight.txt AI-generated neighborhood guide")
    if rename_result is not None:
        manifest_lines.append("  07_photo_captions.txt       Per-photo captions for MLS/Zillow alt text")
        manifest_lines.append("  /photos/curated/            Top 25 photos, ranked and renamed")
        if getattr(rename_result, "additional", None):
            manifest_lines.append("  /photos/additional/         Remaining photos")
    lines.append(_format_section("WHAT'S IN THIS PACKAGE", "\n".join(manifest_lines)))

    # --- Footer ---
    border = "-" * 60
    lines.append(border)
    lines.append("This package was generated by metes.")
    lines.append("Your download link is valid for 7 days.")
    lines.append("metes.app")
    lines.append(border)

    return "\n".join(lines)


def _build_photo_captions_file(res: dict, rename_result) -> str:
    """
    Per-photo reference for MLS uploads, Zillow alt text, and social media.
    Curated photos only. Filenames match /photos/curated/ in the ZIP.
    Joined by image_id between rename_result.curated and the analyzed
    PropertyImage list so captions and renamed filenames stay aligned.
    """
    lines = [_format_header("PHOTO CAPTIONS")]
    lines.append(
        "Per-photo captions for MLS uploads, Zillow alt text, and\n"
        "social media. Filenames match the photos in /photos/curated/.\n\n"
        "Photos ordered by marketing impact rank (01 = hero).\n"
    )

    if rename_result is None or not getattr(rename_result, "curated", None):
        lines.append("No curated photos available.")
        return "\n".join(lines)

    # Index PropertyImage objects by image_id for caption lookup
    property_images = res.get("property_images") or []
    images_by_id = {img.image_id: img for img in property_images}

    for renamed_img in rename_result.curated:
        source_img = images_by_id.get(renamed_img.image_id)

        if source_img is None:
            block_content = (
                f"Room:     —\n"
                f"Caption:  (not generated)\n"
                f"Features: —"
            )
            lines.append(_format_section(renamed_img.renamed_filename, block_content))
            continue

        room_label = source_img.metadata.room_type.replace("_", " ").title()
        caption = source_img.caption if source_img.caption else "(not generated)"
        features = ", ".join(
            f.name.replace("_", " ").title() for f in source_img.visible_features
        ) if source_img.visible_features else "—"

        block_content = (
            f"Room:     {room_label}\n"
            f"Caption:  {caption}\n"
            f"Features: {features}"
        )
        lines.append(_format_section(renamed_img.renamed_filename, block_content))

    return "\n".join(lines)


def build_marketing_package_zip(
    res: dict,
    address: str | None = None,
    email_tone: str = "Professional",
    rename_result=None,
) -> bytes:
    """
    Build a complete marketing package ZIP in memory.

    Args:
        res:           The marketing results dict from generate_marketing_assets_service
        address:       Property address for the ZIP filename
        email_tone:    The tone used for the email campaign
        rename_result: Optional RenameResult from build_renamed_image_set.
                       When provided, writes photos/curated/ and photos/additional/
                       subfolders into the ZIP.

    Returns:
        ZIP file as bytes, ready for Streamlit download_button
    """
    if address:
        safe_address = address.replace(" ", "_").replace("/", "-")[:40]
        zip_filename_prefix = f"{safe_address}_"
    else:
        zip_filename_prefix = ""

    timestamp = datetime.now().strftime("%Y%m%d")
    buffer = io.BytesIO()

    with zipfile.ZipFile(buffer, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        folder = f"{zip_filename_prefix}listing_package_{timestamp}/"

        # --- Summary (agent receipt, first file alphabetically) ---
        zf.writestr(folder + "00_summary.txt", _build_summary_file(res, address, rename_result))

        # --- Marketing copy files ---
        zf.writestr(folder + "01_headline.txt", _build_headline_file(res))
        zf.writestr(folder + "02_mls_description.txt", _build_mls_description_file(res))
        zf.writestr(folder + "03_social_posts.txt", _build_social_posts_file(res))
        zf.writestr(folder + "04_email_campaign.txt", _build_email_campaign_file(res, email_tone))
        zf.writestr(folder + "05_compliance_audit.txt", _build_compliance_audit_file(res))

        if _neighborhood_has_content(res.get("neighborhood_guide")):
            zf.writestr(folder + "06_neighborhood_insight.txt", _build_neighborhood_insight_file(res))

        # --- Photo captions (only when curated photos exist) ---
        if rename_result is not None:
            zf.writestr(folder + "07_photo_captions.txt", _build_photo_captions_file(res, rename_result))

        # --- Photos subfolders ---
        # photos/curated/   — top CURATED_SET_SIZE images, AI-ranked and renamed
        # photos/additional/ — remaining images outside the curated set
        if rename_result is not None:
            for img in rename_result.curated:
                zf.writestr(
                    folder + f"photos/curated/{img.renamed_filename}",
                    img.image_bytes,
                )
            for img in rename_result.additional:
                zf.writestr(
                    folder + f"photos/additional/{img.renamed_filename}",
                    img.image_bytes,
                )

    buffer.seek(0)
    return buffer.read()
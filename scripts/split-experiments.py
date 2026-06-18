#!/usr/bin/env python3
"""
Split src/lib/test-definitions.ts into self-contained experiment modules.

Each experiment gets its own folder under src/experiments/<class>/<subject>/<chapter>/<exp-id>/
containing an index.ts that exports { manifest, test }.

Mapping (test_id -> chapter folder):
  ALCOHOLS / PHENOLS / ETHERS chapter (class-12/chemistry/alcohols-phenols-and-ethers):
    lucasTest, chromicAcidTest, victorMeyerTest, cericAmmoniumNitrateTest,
    fecl3Test, bromineWaterTest, libermannTest, sodiumMetalTest (alcohol variant)

  ALDEHYDES/KETONES/CARBOHYLIC ACIDS chapter (class-12/chemistry/aldehydes-ketones-and-carboxylic-acids):
    tollensTest, fehlingsTest, schiffTest, dnpTest, iodoformTest,
    nahco3Test, esterTest

  AMINES chapter (class-12/chemistry/amines):
    hinsbergTest, carbylamineTest, nitrousAcidTest, azoDyeTest
"""

import re
import os
import json
from pathlib import Path

ROOT = Path("/home/z/my-project")
SRC_FILE = ROOT / "src/lib/test-definitions.ts"
EXP_ROOT = ROOT / "src/experiments"

# (test_id, experiment_slug, blurb, durationMin, chapter_slug)
MAPPING = [
    # Alcohols, Phenols & Ethers
    ("lucasTest",              "lucas-test",                "Distinguish 1°/2°/3° alcohols with ZnCl₂ + conc. HCl — turbidity speed tells the grade.", 6, "alcohols-phenols-and-ethers"),
    ("chromicAcidTest",        "chromic-acid-test",         "Jones reagent (CrO₃/H₂SO₄) oxidizes 1° & 2° alcohols — green Cr³⁺ appears.",            5, "alcohols-phenols-and-ethers"),
    ("victorMeyerTest",        "victor-meyer-test",         "Classic colour test: 1° red, 2° blue, 3° colourless — distinguishes alcohol classes.",   7, "alcohols-phenols-and-ethers"),
    ("cericAmmoniumNitrateTest","ceric-ammonium-nitrate-test","CAN reagent gives red colour with alcohols & phenols — quick positive test.",          4, "alcohols-phenols-and-ethers"),
    ("fecl3Test",              "ferric-chloride-test",      "Neutral FeCl₃ gives violet/green/blue colour with phenols — characteristic test.",       4, "alcohols-phenols-and-ethers"),
    ("bromineWaterTest",       "bromine-water-test",        "Bromine water decolourises with phenols (white ppt of tribromophenol) & unsaturation.",   5, "alcohols-phenols-and-ethers"),
    ("libermannTest",          "libermann-nitroso-test",    "Phenol + NaNO₂ + H₂SO₄ → blue/red Liebermann colour reaction for phenols.",              5, "alcohols-phenols-and-ethers"),

    # Aldehydes, Ketones & Carboxylic Acids
    ("tollensTest",            "tollens-test",              "Silver mirror test — aldehydes reduce [Ag(NH₃)₂]⁺ to metallic Ag; ketones don't.",      6, "aldehydes-ketones-and-carboxylic-acids"),
    ("fehlingsTest",           "fehlings-test",             "Fehling's solution: aliphatic aldehydes give brick-red Cu₂O ppt; ketones & ArCHO don't.",6, "aldehydes-ketones-and-carboxylic-acids"),
    ("schiffTest",             "schiff-test",               "Schiff's reagent restores pink/magenta colour with aldehydes only.",                     4, "aldehydes-ketones-and-carboxylic-acids"),
    ("dnpTest",                "2-4-dnp-test",              "2,4-DNP (Brady's reagent) gives yellow/orange ppt with aldehydes AND ketones.",         5, "aldehydes-ketones-and-carboxylic-acids"),
    ("iodoformTest",           "iodoform-test",             "Iodoform test: yellow ppt with CH₃CO- group & CH₃CH(OH)- group (NaOH + I₂).",            6, "aldehydes-ketones-and-carboxylic-acids"),
    ("nahco3Test",             "nahco3-test",               "NaHCO₃ brisk effervescence (CO₂) — only with carboxylic acids, not phenols.",            4, "aldehydes-ketones-and-carboxylic-acids"),
    ("esterTest",              "ester-test",                "Carboxylic acid + alcohol + H₂SO₄ → sweet fruity ester smell.",                          5, "aldehydes-ketones-and-carboxylic-acids"),

    # Amines
    ("hinsbergTest",           "hinsberg-test",             "Hinsberg reagent (C₆H₅SO₂Cl) + NaOH distinguishes 1°/2°/3° amines.",                    7, "amines"),
    ("carbylamineTest",        "carbylamine-test",          "CHCl₃ + alc. KOH → offensive isocyanide smell with 1° amines only.",                     5, "amines"),
    ("nitrousAcidTest",        "nitrous-acid-test",         "HNO₂ (NaNO₂ + HCl) — effervescence/oil/dissolution distinguishes amine classes.",       6, "amines"),
    ("azoDyeTest",             "azo-dye-test",              "Diazotization + β-naphthol coupling → vivid orange-red azo dye with 1° aromatic amines.",6, "amines"),
]

# Read the source file
content = SRC_FILE.read_text()

# Split into individual TestDef blocks
# Pattern: export const <name>: TestDef = { ... }
# Use brace counting to extract each block

def extract_blocks(src: str):
    blocks = {}
    # Find all `export const NAME: TestDef = {` starts
    pattern = re.compile(r'^export const (\w+): TestDef = \{', re.MULTILINE)
    for m in pattern.finditer(src):
        name = m.group(1)
        start = m.start()
        # Find the matching closing brace
        i = m.end() - 1  # position of opening {
        depth = 0
        while i < len(src):
            c = src[i]
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        # Block end (after closing brace and semicolon)
        end = i + 1
        # Include trailing semicolon if present
        while end < len(src) and src[end] in ' \t;':
            end += 1
        block_src = src[start:end]
        blocks[name] = block_src
    return blocks

blocks = extract_blocks(content)
print(f"Extracted {len(blocks)} test blocks: {list(blocks.keys())}")

# Also extract the TestDef-related type definitions and helpers needed for compilation
# Each index.ts needs to import TestDef type and ExperimentManifest type
HEADER = '''// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type {{ TestDef, ExperimentManifest }} from "@/lib/lab-types";

{block}

export const manifest: ExperimentManifest = {{
  id: "{id}",
  title: {title},
  emoji: {emoji},
  blurb: {blurb},
  gradient: {gradient},
  durationMin: {duration},
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "{chapter}",
}};

const module = {{ manifest, test: {test_var} }};
export default module;
'''

# We also need to extract the test's metadata fields (id, name, emoji, gradient, desc) for the manifest
def extract_field(block_src: str, field: str):
    """Extract a string field value from a TestDef block."""
    # match `field: 'value'` or `field: "value"`
    m = re.search(rf'\b{field}:\s*[\'"]([^\'"]*)[\'"]', block_src)
    return m.group(1) if m else ""

for test_var, slug, blurb, duration, chapter in MAPPING:
    if test_var not in blocks:
        print(f"WARNING: {test_var} not found in blocks!")
        continue

    block = blocks[test_var].strip()
    # Make sure it ends with a semicolon
    if not block.endswith(';'):
        block += ';'

    # Extract fields
    test_id = extract_field(block, 'id')
    test_name = extract_field(block, 'name')
    test_emoji = extract_field(block, 'emoji')
    test_gradient = extract_field(block, 'gradient')

    # Use the test's name and emoji for the manifest
    folder = EXP_ROOT / "class-12" / "chemistry" / chapter / slug
    folder.mkdir(parents=True, exist_ok=True)

    index_ts = HEADER.format(
        block=block,
        id=slug,
        title=json.dumps(test_name),
        emoji=json.dumps(test_emoji),
        blurb=json.dumps(blurb),
        gradient=json.dumps(test_gradient),
        duration=duration,
        chapter=chapter,
        test_var=test_var,
    )

    (folder / "index.ts").write_text(index_ts)
    print(f"  ✓ {folder.relative_to(ROOT)}/index.ts")

print("\nDone.")

# CATTI Lab V2 Round B.2 — Past Paper Recovery

## Scope

This round adds only public, stable passage bodies that could be recovered from an accessible public compilation page. Registry records remain separate from trainable content. No passage was generated from a title, a summary, a CATTI Lab exercise, or a missing slot. Non-official material keeps its public-compilation label and source URL.

## Current recovery count

| Measure | Count |
|---|---:|
| Registry years | 24 (2003–2026 index) |
| Registry exam sessions | 42 |
| Practical passages with complete public body | 5 |
| English → Chinese | 3 |
| Chinese → English | 2 |
| Complete reference answers | 4 |
| Source text only | 1 |
| Comprehensive objective items with public answer | 1 |
| Full practical sessions | 0 |
| Partial practical sessions | 2 (2018-11 and 2022-11) |

The requested target of 30 passages is not claimed: the current public pages provide many indexed titles, but only five passages have a complete body that can be safely and consistently mapped to one session and direction. The remaining entries stay registry-only until their complete body can be checked.

## Recovered trainable passages

- 2018-11: 中医药与中华文明 (Chinese → English, public government-document extract, reference available)
- 2018-11: 农业合作与粮食安全 (Chinese → English, public government-speech extract, no human reference)
- 2022-11: 美国失业问题 (English → Chinese, public educational compilation, reference available)
- 2022-11: 新冠疫情的影响与合作抗疫 (English → Chinese, public educational compilation, reference available)
- 2022-11: 职业教育改革 (Chinese → English, public educational compilation, reference available)

The stable training object now exposes `paperId`, `year`, `session`, `paperType`, `direction`, `passageIndex`, `sourceText`, `referenceAnswer`, `referenceSource`, `sourceLabel`, `sourceUrls`, `variants`, `textCompleteness`, `trainable`, `wordCount`, `charCount`, `topic`, and `contentVersion`. Existing `referenceTranslation` is retained as a compatibility alias. A source-only passage displays “暂无人工参考译文。” and remains trainable.

## 2016–2025 recovery review

| Year/session | Indexed practical positions | Trainable recovered bodies | Decision |
|---|---:|---:|---|
| 2025-06 | 4 | 0 | Recall page has incomplete/preview material; registry only |
| 2024-10 | 4 | 0 | Public page excerpts are incomplete; registry only |
| 2023-11 | 4 | 0 | Public recall contains partial/obscured text; registry only |
| 2022-11 | 3 | 3 | Three complete bilingual bodies recovered |
| 2022-06 | 2 | 0 | Page exposes an incomplete passage body; registry only |
| 2021-06 | 3 | 0 | Source identified, complete body not recovered |
| 2021-11 | 0 | 0 | Public catalogue index only |
| 2020-11 | 4 | 0 | Source identified, complete body not recovered |
| 2019-11 | 0 | 0 | Page not mapped to a stable material record in this round |
| 2019-06 | 0 | 0 | Page text is explicitly an excerpt; not admitted as complete |
| 2018-11 | 4 | 2 | Two complete public versions/materials recovered |
| 2018-05 | 0 | 0 | Registry index only |
| 2017-05/11 | 0 | 0 | Registry index only |
| 2016-05/11 | 0 | 0 | Registry index only |

## Validation and QA

The recovery validator rejects missing body text, incomplete text, unsupported direction, source/reference identity, summary-style references, language mismatch, missing source labels/URLs, and missing content versions. Exact duplicate reprints continue to merge their source URLs while materially different versions remain visible as variants.

- Recovery schema/unit test: PASS (`tests/publicArchive.recovery.mjs`)
- Existing public archive browser QA: PASS — filters, clear filters, variants, practical submission snapshots, comprehensive objective submission, mobile width, refresh persistence, runtime errors 0
- `npm test`: PASS
- `npm run content:check`: PASS (existing content gates; quantity targets remain documented shortfalls outside this recovery round)
- `npm run build`: PASS

## Public evidence

The recovered 2022 bodies are mapped to the public teaching-resource page [2022 November CATTI Level 2 written translation material](https://demo.ltpower.net/web/hydxswyy/news/show-5603.html). The 2018 Chinese source/reference uses the public government white-paper and speech sources already recorded in the registry. These are public compilations or public documents, not claims of official answer keys.

## Remaining work

The large registry remains useful for discovery, but most entries still need a complete, reviewable public body before they can be made trainable. The next recovery pass should acquire and review those bodies one session at a time, preserving variants and source provenance; it should not fill missing passages with generated or synthetic text.

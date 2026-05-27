# B2B pivot — internal memo

**Audience:** Echo, before the Willoughby meeting
**Not for:** Willoughby, until/unless she pulls on the thread herself
**Written:** 2026-05-27

---

## Why this memo exists

If Willoughby asks "where does this go next?" or pulls on the *Transforming Auslan Education* thread, you need to be able to answer crisply — not improvise a half-formed pivot pitch in the meeting. This memo is the half-formed pivot pitch, written down, so the meeting version is clean.

The current product (the ASL Context Learning app) is a **consumer-facing learning tool for deaf adults**. The B2B pivot is **a Deaf-awareness + scenario-vocab training tool for hearing service staff** at institutions that interact with deaf customers. Different product. Shared data layer. Different UX premise. Different buyer.

Decide before you walk in: do you describe these as one product with two faces, or two products with shared infrastructure? My read: the second framing is more honest and harder to misread. Pretending it's one product invites scope confusion in the conversation.

## What the B2B product is

An admin-deployed app — likely a web app reached via the institution's intranet, or a mobile companion. It does three things:

1. **Awareness module.** Short interactive scenarios — the same first-person narrations from the consumer app, but viewed from the *staff side*. "A deaf passenger approaches your counter. They cannot hear the boarding call. What changes?" Staff click through and see the friction points the deaf customer experiences, derived from your authored scenarios.
2. **Scenario vocabulary.** Per-workplace word lists curated by domain (airport gate staff, hospital triage nurses, bank tellers, school admin). Each word with the sign video (so staff can recognise the sign if a customer makes it) and the fingerspelling animation. This is the "what does it look like when a deaf person signs *boarding pass* to me" answer.
3. **Quick-reference cards.** A printable / mobile-shortcut card of the 20-30 most-likely phrases for that workplace ("Can I see your ticket?", "Your gate has changed", "Please wait one moment, I'll get the interpreter"). Bilingual: written English + sign video.

What it is *not*: a sign-language fluency course. Three hours of training is not going to make an airport agent fluent. The goal is **awareness + recognition + minimum-viable interaction**, not fluency.

## Who the buyer is

In Australia, the buyer is some combination of:

- Workplace compliance + accessibility teams at large employers (airport operators, public hospitals, transit agencies, retail chains).
- Public-sector accessibility programs — the NDIS adjacent ones, state-level disability action plans.
- Existing Deaf-services organisations who'd white-label or partner — Deaf Connect (formerly Auslan Education Australia), Expression Australia, Vicdeaf. These orgs deliver awareness training today; they do it as in-person workshops + video + PDF, not interactive software. There is a real tooling gap.
- DDA compliance pressure — the Disability Discrimination Act doesn't mandate sign-language training, but it does mandate "reasonable adjustments." Once a competitor airport demonstrates this kind of training, the rest follow.

Willoughby's own network is directly inside this buyer set. Her consultancy track record (Vic Deaf Society, Vic Deaf Education Institute, Australian Federation of Deaf Societies, DHS, Attorney-General's Department) is exactly the introduction-graph you'd need. The *Auslan Workforce Mental Health Capacity* project she's a CI on (2024–2026) is *literally* a workforce-training initiative — adjacent enough that she'd recognise the shape of what you're describing.

## The ASL → Auslan problem

This is the single largest obstacle to the B2B pivot in Australia.

- Your consumer app uses ASL because WLASL is the only freely-available scaled video dataset you found. That choice is fine for a portfolio/demo and fine for an academic conversation about pedagogy.
- For an Australian B2B product, **you cannot ship ASL**. Australian deaf signers use Auslan. ASL ≠ Auslan: different lexicon, different grammar, different fingerspelling alphabet (Auslan uses a two-handed alphabet, ASL uses one-handed). An Australian gate agent trained on ASL signs would be confused, not helpful, when meeting an Auslan-using passenger.
- The data switch isn't trivial. WLASL is gone; you'd build from **Auslan Signbank** and possibly the **Auslan Corpus** (Adam Schembri — Willoughby's collaborator on her 2015–21 ARC). License terms matter for a commercial product; Signbank is generally permissive for educational use but a commercial deployment needs explicit clearance.
- The vocabulary curation question becomes more urgent. Auslan Signbank has ~10,000 entries; you'd need to identify the ~200–500 words actually used in each workplace context. ASL-LEX exists as a frequency/AoA scaffold for ASL but I don't know of an equivalent for Auslan. This may itself be a question for Willoughby's circle.
- One option: keep the consumer ASL app as your portfolio/personal-learning project (it's *your* tool — you're learning ASL personally) and pitch the Auslan B2B product as a *separate* initiative that would require funding/partnership to build. Don't conflate them.

## Whose interface is the B2B?

Trap to avoid: building the B2B as a thin re-skin of the consumer app. They're fundamentally different.

| Dimension | Consumer (deaf learner) | B2B (hearing staff) |
|---|---|---|
| Who clicks | A deaf person learning sign | A hearing person being trained |
| Primary modality | Reading English + watching signs to acquire signs | Watching signs + practising recognition |
| Success metric | Long-term retention of vocabulary | Pass a workplace-compliance quiz; remember the 10 most-common signs |
| Length of engagement | Daily, over months | One-off training session (1–3 hours), occasional refresher |
| Voice | First-person ("I keep my eyes on the door because…") | Second-person ("Your customer is signalling — what do they need?") |
| Vocabulary scope | Open-ended (Echo decides what to learn) | Closed (the institution's 30–80 most-likely words) |

What stays shared between products: the **sign-video data layer**, the **fingerspelling strip module**, the **scenario narrations** (with the perspective flipped from first-person-deaf to second-person-staff). Roughly 60% of the engineering is shared. Roughly 100% of the UX is different.

## If she pulls on this thread, what do you say?

A two-sentence answer is enough in the meeting. Don't over-pitch. Something like:

> "The same scenarios I'm using as learning material have a B2B mirror — staff-training for institutions where deaf customers experience the most friction. I haven't started building that, and if I did the data layer would need to be Auslan, not ASL. I'd value your read on whether that's the kind of thing your *Auslan Workforce Mental Health Capacity* project — or the orgs you've worked with — would have appetite for."

Then *stop talking*. Let her respond. If she says "yes, talk to X at Deaf Connect" — that's your warm intro. If she says "no, that market is saturated by Y" — that's market intel you need. Either is useful; over-pitching makes both less likely.

## What this memo is NOT

- Not a business plan. The market sizing, pricing model, go-to-market — all undone. This memo is for "have you thought about this?" not "would you invest?"
- Not a roadmap. Don't try to build the B2B product before the consumer app reaches the GitHub Pages deployment milestone. The consumer app is your portfolio artifact; ship that, *then* explore the pivot.
- Not a decision. You don't owe Willoughby a decision on which path you're committing to. Stay open. Two-track plans are normal at your stage.

---

## TL;DR for the meeting

1. Don't *lead* with the B2B angle. Let it emerge if she pulls on it.
2. If you describe it, name two products, not one — different UX, shared data.
3. Acknowledge the ASL→Auslan blocker before she has to point it out.
4. Frame the ask as "is there appetite," not "would you build this with me."

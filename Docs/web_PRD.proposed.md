# Web PRD - Morpiks Solutions (Proposed)

> Proposed revision of `web_PRD.md`. The original file is unchanged.
> Decisions marked **[Q#]** come from the design grilling session. Open items are listed in section 12.

---

## 1. Overview

Apple-inspired, flat, clean marketing site for Morpiks Solutions. Single-page experience with a horizontal portfolio slider and a vertical company/contact section, navigated by a centered floating bar. Tagline: *Evolve Beyond Limits*.

---

## 2. Tech Stack

- **Framework:** Next.js (App Router) **[assumed, see 12]**
- **Styling:** Tailwind CSS
- **Motion:** Framer Motion
- **Email:** Resend, called from a Next.js API route **[Q13]**
- **Hosting:** Vercel **[Q14]**

---

## 3. Brand and Assets

### 3.1 Logo
- Source: `Assets/chameleon-low-poly.svg` (6 groups: crest, head, body, front-leg, back-leg, tail; 24 shards; eye = sclera + pupil).
- Palette remap: base fill `#111111` (was `#111827`). Hover fill `#777777` (was `#059669`). **[Q2]**
- Hover drop-shadow filter removed. **[Q3]**

### 3.2 Shard interaction **[Q16]**
- **Hover:** shard translates about 4px along its outward direction (from logo centre through the shard's `data-cx`/`data-cy`), and fill shifts `#111111` -> `#777777`.
- **Click:** short 3D flip on that shard.
- No shadows, glow, or borders.

### 3.3 Favicon **[Q7]**
- Built from the head group only: `head-face`, `head-temple`, `head-snout`, `head-jaw`, and the eye.
- Export at 32px and 512px.

### 3.4 Wordmark
- **MORPIKS**: Montserrat ExtraBold (800).
- **SOLUTIONS**: Montserrat Light (300).
- Tagline *Evolve Beyond Limits*: Montserrat Regular (400).

---

## 4. Colour Palette

| Token | Hex | Use |
|---|---|---|
| Obsidian Black | `#111111` | Primary text, logo base |
| Graphite | `#333333` | Secondary text |
| Steel Gray | `#777777` | Hover state, muted text |
| Mist Gray | `#D9D9D9` | Dividers-as-fills, subtle backgrounds |
| Off-White | `#FAFAFA` | Page background |

No gradients, shadows, or borders anywhere in the UI.

---

## 5. Typography

- **Brand:** Montserrat (see 3.4).
- **Content (headings, body, UI labels, buttons):** `-apple-system, "SF Pro Display", "Inter", system-ui, sans-serif`. SF Pro is used on Apple devices; Inter is the fallback elsewhere. **[Q5]**

---

## 6. Entry Experience

### 6.1 Intro (plays on every page load) **[Q12]**
- Full-viewport blocking overlay, logo centred.
- The logo's shards are scrambled with a 3D cube-style transform and then return to their original positions.
- Scramble pattern is **randomised on each load**, always settling into the same final arrangement. **[Q18]**
- Total duration: **3 seconds**.
- Loading bar directly below the logo, filling over the same 3 seconds.
- No `sessionStorage`; the intro replays on every load and every visitor visit. **[Q12]**

### 6.2 Transition to hero
- When the intro completes, the shards move to the top-left corner as the logo hero.
- The wordmark (MORPIKS SOLUTIONS) transitions to the top-left alongside the logo.

### 6.3 Navigation reveal **[Q-PRD]**
- Navigation block expands after **500ms** on page load, animating its content in with it. **[Q4]**

---

## 7. Navigation

### 7.1 Style
- Centred, bottom-positioned, semi-floating bar on desktop **and** mobile (same design). **[PRD]**
- Flat: no shadows, gradients, borders, or icons. Text and background colour only.
- Whole block and its content animate together, including during content transitions.

### 7.2 Items **[Q9]**
Four items, in this order:
1. **Portfolio** -> horizontal slider
2. **Services** -> horizontal slider (service slides)
3. **About** -> vertical section
4. **Contact** -> vertical section

Portfolio and Services jump to their slide. About and Contact jump to their vertical section.

---

## 8. Content Views

### 8.1 Horizontal section: Portfolio slider
- Shown first on page load.
- Auto-advances every **5 seconds**. **[PRD]**
- **Pause** on hover and on focus. **[Q11]**
- Visible pause/play control. **[Q11]**
- `prefers-reduced-motion`: auto-advance disabled entirely. **[Q11]**

#### Slides (9) **[Q19, Q15]**

| # | Slide | Image | Source |
|---|---|---|---|
| 1 | End-to-End Business Solution | `services-hero-overview.jpg` | Context.md |
| 2 | WebApp Development | `service-webapp-dev.jpg` | Context.md |
| 3 | Rapid Prototyping | `service-rapid-prototyping.jpg` | Context.md |
| 4 | WMS / IMS / ERP Development | `service-enterprise-erp.jpg` | Context.md |
| 5 | IoT Development | `service-iot-solutions.jpg` | Context.md |
| 6 | Automation (incl. System Integration) | `service-automation.jpg` | Context.md |
| 7 | Industrial Equipment Design | `service-industrial-equipment.jpg` | Context.md |
| 8 | Furniture Design & Fabrication | `service-furniture-design.jpg` | Context.md |
| 9 | Industrial & Office Procurement | `service-procurement.jpg` | Context.md |

- There is no separate hero slide; slide 1 is the End-to-End image. **[Q19]**
- System Integration has no image and is combined into slide 6. **[Q15]**
- Every slide has descriptive alt text.

### 8.2 Vertical section: About and Contact
- Smooth vertical scroll with snap between the About and Contact panels.
- Shows company info (About) and contact info (Contact).

### 8.3 Connection between sections **[Q10]**
- Scroll down or swipe up on the slider moves to the vertical section.
- Scroll up on the vertical section returns to the slider.
- Nav items jump directly to their target.
- Both directions use scroll-snap, so the scroll lock still applies.

---

## 9. Scroll Lock

- CSS Scroll Snapping on both axes: horizontal for the slider, vertical for About/Contact.
- The page has no free scroll; each step lands on a snap point.

---

## 10. Contact

### 10.1 Form
- Fields: name, email, message (plus any other required fields agreed later).
- Client-side validation of required fields.
- Visible CTA in hero and footer. **[PRD]**
- Primary CTA: **Book a consultation**, matching the Portfolio document. **[Context/Portfolio]**

### 10.2 Delivery **[Q13, Q17]**
- Submission posts to a Next.js API route.
- The route sends the enquiry through **Resend** to **info@morpiks.com**.
- Sender: `no-reply@morpiks.com`; `Reply-To` is the visitor's email. **[Q17]**
- **Before launch:** DNS records for morpiks.com must be added so Resend can verify the sending domain.
- **Until then:** test using Resend's sandbox sender.

### 10.3 WhatsApp
- Optional secondary CTA linking to WhatsApp. Number is still TBC (see 12). **[Q13]**

---

## 11. Accessibility

- Keyboard-accessible navigation and slider controls.
- Readable contrast on the palette (`#111111` on `#FAFAFA`; check `#777777` for body text).
- Alt text on all images and the logo.
- Visible focus states (no shadows or borders, so use a text or background change).
- `prefers-reduced-motion`: disable slider auto-advance. **[Q11]**

---

## 12. Open Items and Assumptions

These were not decided in the grilling session. Confirm before implementation.

- [ ] **Intro under reduced motion:** the 3-second intro was not covered by the reduced-motion decision. Proposal: shorten it to a fade with no 3D transform. **Needs confirmation.**
- [ ] **Next.js router:** App Router assumed. **Needs confirmation.**
- [ ] **Resend DNS:** morpiks.com records needed before launch.
- [ ] **WhatsApp number:** TBC.
- [ ] **Booking link:** placeholder in Portfolio.md; needed for the CTA.
- [ ] **Insights section:** removed from scope (no content). Add back when content exists. **[Q6]**
- [ ] **Team profiles:** not in scope.
- [ ] **Scroll implementation:** nested CSS scroll-snap across horizontal and vertical containers can be fragile with wheel input. Proposal: use CSS snap as the base and drive transitions with Framer Motion, keeping the behaviour in section 9.

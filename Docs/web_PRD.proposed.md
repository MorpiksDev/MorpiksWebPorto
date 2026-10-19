# Web PRD - Morpiks Solutions (Proposed)

> Proposed revision of `web_PRD.md`. The original file is unchanged.
> Decisions marked **[Q#]** come from the design grilling session. No open items remain.

---

## 1. Overview

Apple-inspired, flat, clean marketing site for Morpiks Solutions. Single-page experience with a horizontal portfolio slider and a vertical company/contact section, navigated by a centred floating bar. Tagline: *Evolve Beyond Limits*.

---

## 2. Tech Stack

- **Framework:** Next.js, **App Router** **[Q21]**
- **Styling:** Tailwind CSS
- **Motion:** Framer Motion
- **Scroll:** native CSS scroll-snap on both axes, with a wheel handler **[Q22]**
- **Email:** Resend, called from a Next.js route handler **[Q13, Q21]**
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
| Mist Gray | `#D9D9D9` | Subtle backgrounds |
| Off-White | `#FAFAFA` | Page background |

No gradients, shadows, or borders anywhere in the UI.

---

## 5. Typography

- **Brand:** Montserrat (see 3.4).
- **Content (headings, body, UI labels, buttons):** `-apple-system, "SF Pro Display", "Inter", system-ui, sans-serif`. SF Pro on Apple devices, Inter elsewhere. **[Q5]**

---

## 6. Entry Experience

### 6.1 Intro (plays on every page load) **[Q12]**
- Full-viewport blocking overlay, logo centred.
- Shards are scrambled with a 3D cube-style transform, then return to their original positions.
- Scramble pattern is **randomised on each load**, always settling into the same final arrangement. **[Q18]**
- Total duration: **3 seconds**.
- Loading bar directly below the logo, filling over the same 3 seconds.
- No `sessionStorage`; the intro replays on every load.

#### 6.1.1 Reduced motion **[Q20]**
- When `prefers-reduced-motion` is set, the 3D scramble is replaced by a **0.5-second opacity fade** of the logo into its final position.
- The loading bar still fills over 3 seconds, without the 3D transform.
- The nav reveal follows the fade.

### 6.2 Transition to hero
- When the intro completes, the shards move to the top-left corner as the logo hero.
- The wordmark (MORPIKS SOLUTIONS) transitions to the top-left alongside the logo.

### 6.3 Navigation reveal **[Q4]**
- Navigation block expands after **500ms** on page load, animating its content in with it.

---

## 7. Navigation

### 7.1 Style
- Centred, bottom-positioned, semi-floating bar on desktop **and** mobile (same design).
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
- Auto-advances every **5 seconds**.
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

- No separate hero slide; slide 1 is the End-to-End image.
- System Integration has no image and is combined into slide 6.
- Every slide has descriptive alt text.

### 8.2 Vertical section: About and Contact
- Smooth vertical scroll with snap between the About and Contact panels.
- About shows company info; Contact shows the form and contact details.

### 8.3 Connection between sections **[Q10]**
- Scroll down or swipe up on the slider moves to the vertical section.
- Scroll up on the vertical section returns to the slider.
- Nav items jump directly to their target.
- Both directions use scroll-snap, so the scroll lock still applies.

### 8.4 Scroll implementation **[Q22]**
- CSS scroll-snap on both axes: horizontal for the slider, vertical for About/Contact.
- A wheel handler maps vertical wheel input to horizontal steps while the slider is active.
- Framer Motion animates the transitions between snap points.
- No custom scroll engine.

---

## 9. Scroll Lock

- CSS Scroll Snapping on both axes.
- The page has no free scroll; each step lands on a snap point.

---

## 10. Contact

### 10.1 Form
- Fields: name, email, message.
- Client-side validation of required fields.
- Visible CTA in hero and footer.
- Primary CTA: **Book a consultation**. Scrolls to the Contact panel and pre-selects "consultation" as the subject. **[Q25]**
- No third-party scheduler.

### 10.2 Delivery **[Q13, Q17, Q23]**
- Submission posts to a Next.js route handler.
- The route sends the enquiry through **Resend** to **info@morpiks.com**.
- Sender: `no-reply@morpiks.com`; `Reply-To` is the visitor's email.
- **Before launch:** DNS records for morpiks.com are added so Resend can verify the sending domain. The owner has DNS access.
- **Until verified:** test using Resend's sandbox sender.

### 10.3 WhatsApp **[Q24]**
- Optional secondary CTA in the Contact panel.
- Number: **+62 813-8499-0143** (`wa.me/6281384990143`).

### 10.4 Contact details
- Email: info@morpiks.com
- WhatsApp: +62 813-8499-0143
- Location: Bogor, Jawa Barat - Indonesia

---

## 11. Accessibility

- Keyboard-accessible navigation and slider controls.
- Readable contrast on the palette (`#111111` on `#FAFAFA`; check `#777777` for body text).
- Alt text on all images and the logo.
- Visible focus states (no shadows or borders, so use a text or background change).
- `prefers-reduced-motion`: slider auto-advance disabled; intro replaced by the fade in 6.1.1. **[Q11, Q20]**

---

## 12. Scope

- **In scope:** everything above.
- **Out of scope for this phase:** Insights section (no content yet) **[Q6, Q26]**; team profiles (optional, not in Portfolio.md) **[Q26]**. Both can be added later without changing the layout.

---

## 13. Resolved Decisions Log

| Item | Decision | Ref |
|---|---|---|
| Intro under reduced motion | 0.5s opacity fade, loading bar unchanged | Q20 |
| Router | App Router | Q21 |
| Scroll approach | CSS snap + wheel handler + Framer Motion | Q22 |
| Resend DNS | Owner has access; sandbox until verified | Q23 |
| WhatsApp | Number provided, shown as secondary CTA | Q24 |
| Booking CTA | Site contact form, subject pre-selected | Q25 |
| Insights and team profiles | Excluded from this phase | Q26 |

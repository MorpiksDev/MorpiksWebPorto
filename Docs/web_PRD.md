# Web Design

Apple inspired design language with clean layout and modern typography.

## Logo & Branding
use Assets\chameleon-low-poly.svg as logo for the website. create an icon for the website using the logo

the logo should be animated and interactive on each part level

## Web entry point
add delay and intro animation on web entry the logo part is scrabled using 3d cube transform and then scramble back to original position, it should take 3 sec to complete with loading bar on bellow logo

position : blocking full view initially , centered

after the delay and transformation is complete , the each part is transitioned to the left top corner (logo hero), along with transitioned brand name wordmark (MORPIKS SOLUTIONS)

## Navigation style

dont use generic navigation style, use unique yet premium style

centered navigation bottom (desktop) semi floating position, and animated along with the content transision

use the same design for mobile 

whole navigation block and content should be animated

entry point, add fast delay on page load for 50ms expand the navigation block along its content 

the design should be flat and clean, no shadows, no gradients, no borders, no icons, just text and background colors

## content view

the content view block uses horizontal content and vertical content and the view use scoll lock

(horizontal section)
the first page of webiste should show company portofolio then automatically sliding to the next section every 5 sec

(vertical section)
smoth transition vertical scoll and snap to the next section when scrolling showing company info and contact info

## Techstack
- Nextjs
- Tailwindcss
- Framer-motion

## Color Palette

- OBSIDIAN BLACK
#111111
- GRAPHITE
#333333
- STEEL GRAY
#777777
- MIST GRAY
#D9D9D9
- OFF-WHITE
#FAFAFA

## Typography
Montserrat ExtraBold / Light / Regular
SF Pro Display for content

### BRAND TYPHOGRAPY
- MORPIKS
  Montserrat ExtraBold - Logo wordmark / primary brand name - ExtraBold · 800

- SOLUTIONS
  Montserrat Light - Logo sub-name / secondary wordmark - Light · 300

- Evolve Beyond Limits:
  Montserrat Regular - Tagline / brand lockup when used - Regular · 400

SF Pro Display
Website content: headings, body copy, UI labels, buttons



## Layout

RESPONSIVE
Desktop, tablet, and mobile layouts; navigation adapts to smaller screens.

CONTACT CTA
Visible CTA in hero and footer; contact form validates required fields.

CONTACT ROUTING
Form submission sends enquiry to the agreed company email; WhatsApp link optional.

CONTENT
Services, about copy, insights, and contact details should be easy to update.

ACCESSIBILITY
Keyboard-accessible navigation, readable contrast, alt text, visible focus states.

scroll lock (CSS Scroll Snapping) both vertical and horizontall 



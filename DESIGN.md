---
version: alpha
name: Arknights-summer-act-2026-design-analysis
description: Faithful analysis of Hypergryph's Arknights 2026 summer web activity "TILL THE LANDS BECOME AN ORANGE / 直到大地变成一颗酸橙" (summer-act-2026, aka "信使的工作") — a fixed-stage 1365×768 game page whose entire UI is a warm cream-and-gold paper-craft system on a light blue sky: wooden panels, gold gradient buttons, blue accent pills, serif-heavy CJK type, and rem-scaled absolute layout.

colors:
  primary-blue: "#2EBDF8"
  blue-shadow: "#4198B5"
  blue-deep: "#1F89DB"
  brown: "#784025"
  brown-deep: "#5F3713"
  brown-soft: "#8A7654"
  gold: "#E18D25"
  gold-light: "#F0C030"
  gold-deep: "#B06E32"
  canvas: "#FFFFFF"
  canvas-cream: "#FFFCE8"
  modal-surface: "#F5F0D8"
  panel-wood: "#F0C090"
  panel-wood-deep: "#C06060"
  text-on-image: "#FFFFFF"
  text-shadow: "rgba(0,0,0,0.30)"
  overlay: "rgba(20,45,80,0.55)"
  stamp-red: "#D63B31"
  success-green: "#60B874"

typography:
  body:
    fontFamily: Noto Sans SC, PingFang SC, Microsoft YaHei, sans-serif
    fontSize: 11.375px
    fontWeight: 400
  display-title:
    fontFamily: SourceHanSansCN-Heavy, Noto Sans SC, sans-serif
    fontSize: 27.3px
    fontWeight: 900
    letterSpacing: 0.15em
  serif-title:
    fontFamily: SourceHanSerifCN-Heavy, SourceHanSerifCN-Bold, serif
    fontSize: 34.1px
    fontWeight: 900
  button-start:
    fontFamily: SourceHanSerifCN-Heavy, serif
    fontSize: 22.75px
    fontWeight: 900
    letterSpacing: 0.2em
    textShadow: 0 2.1px rgba(0,0,0,0.35)
  button-main:
    fontFamily: SourceHanSerifCN-Heavy, serif
    fontSize: 34.1px
    fontWeight: 900
    textShadow: "0 2.84px #E18D25, 2.84px 0 #E18D25, 0 -2.84px #E18D25, -2.84px 0 #E18D25"
  button-mode:
    fontFamily: SourceHanSerifCN-Heavy, serif
    fontSize: 31.3px
    fontWeight: 900
  button-modal:
    fontFamily: SourceHanSerifCN-Heavy, serif
    fontSize: 21.3px
    fontWeight: 900
  header-icon-label:
    fontFamily: SourceHanSansCN-Heavy, sans-serif
    fontSize: 21.3px
    textShadow: 0 2.84px rgba(0,0,0,0.30)
  progress-label:
    fontFamily: MaoKenShiJinHei, Noto Sans SC, sans-serif
    fontSize: 11.4px
  en-logo:
    fontFamily: LuckiestGuy-Regular, "Luckiest Guy", sans-serif
  en-numeral:
    fontFamily: Gilroy-Bold, Arial, sans-serif
    fontSize: 60.4px
    fontWeight: 900
  hint:
    fontFamily: Noto Sans SC, sans-serif
    fontSize: 9.2px

rounded:
  pill: 999px
  pill-full: 62.4375rem
  card: 0.625rem
  small: 0.375rem

spacing:
  base-rem: 11.375px
  xs: 0.25rem
  sm: 0.5rem
  md: 0.625rem
  lg: 1rem
  xl: 1.25rem
  xxl: 1.5rem
  panel-pad: 2.5rem
  stage-w: 120rem
  stage-h: 67.5rem

components:
  stage:
    description: "Fixed game stage. Whole UI is drawn inside 120rem x 67.5rem (1365 x 768 at base). Scaling is done by setting html font-size = min(viewportW/120, viewportH/67.5) px — every size in the system is rem."
    width: "{spacing.stage-w}"
    height: "{spacing.stage-h}"
  screen-fade:
    description: "Screen transition wrapper. opacity 0 -> 1, 0.5s ease-in-out. All screens stack inside the stage."
    transition: "opacity .5s ease-in-out"
  header-bar:
    description: "Top-right icon cluster, always visible, z-index 100."
    position: "absolute; top 2.5625rem; right 2.5rem"
    gap: "{spacing.lg}"
  header-icon-btn:
    description: "Round-ish image button (icons are pre-rendered PNGs, object-fit contain). Sizes: user icon 3.5rem x 3.5rem, sound/home 3.25rem."
    size: "3.25-3.5rem"
    hover: "brightness(1.05) translateY(-0.125rem)"
    active: "brightness(.95) translateY(0.0625rem)"
  loading-screen:
    description: "Full-stage loading screen (bg.15abb9.jpg, light-blue sky art). Absolutely-positioned image layers, no flex layout for the art."
    background: "bg.15abb9.jpg cover"
    layers:
      logo: "28.1875rem x 5.8125rem, top 3.125rem, left 2.5rem"
      title-wrap: "103.688rem x 54.0625rem, top 0 (title_bg.05705a.png)"
      title-top: "102.75rem x 48.75rem, top 7.5rem, left 2.5rem"
      title-text: "45.375rem x 29.125rem, top 20rem, left 6.25rem (活动标题字)"
      title-role: "44.9375rem x 52.4375rem, top 9.375rem, right 7.5rem (安洁莉娜立绘)"
      bottom-strip: "100% x 4rem, bottom 0 (bottom.9e3648.png)"
  start-button:
    description: "The gold start button (btn_start.107dd6.png). Text '游戏开始' in white."
    size: "34.75rem x 6.875rem"
    position: "absolute; bottom 10.625rem; left 21.25rem"
    typography: "{typography.button-start}"
    hover: "brightness(1.05) translateY(-0.125rem)"
    active: "brightness(.95) translateY(0.0625rem)"
  progress-bar:
    description: "Loading progress (progress_bg.e32000.png gold frame)."
    size: "40.9375rem x 3.8125rem"
    position: "absolute; bottom 11.25rem; left 15.625rem"
    inner: "progress_content.d8d906.png, 39.375rem x 2.1875rem, left padding 6.25rem"
    icon: "progress_icon.277bab.png, 7.5rem x 6rem, vertically centered at left"
    fill: "progress_bar.23dbb3.png, width animates 0->100%"
  main-screen:
    description: "Editor/game screen. bg.89a968.jpg full-stage cover; bottom strip same as loading."
    background: "bg.89a968.jpg cover"
  game-panel:
    description: "The central wooden panel (game_panel_bg.0dbea4.png), warm cream-wood texture with rounded corners baked into the image. Contains all interactive UI."
    size: "108.438rem x 62.9375rem"
    position: "absolute; left 1.875rem; vertically centered"
    padding: "4.375rem 3.125rem 2.25rem"
  menu-panel:
    description: "Left vertical menu panel (panel_menu_bg.9e761c.png), red-tinted wood texture."
    width: "19.5rem"
    padding: "2.5rem 1.5rem 1.75rem"
  title-badge:
    description: "Section title chip (content_title_bg.2ab3e9.png), centered text in white heavy sans."
    size: "15.0625rem x 3.5rem (scalable to 22rem)"
  rule-button:
    description: "Round help/rule button (btn_rule.948a3c.png), gold."
    size: "6.375-9.625rem"
  main-button:
    description: "The signature gold button (mainBtn.b6e517.png). White text with 4-direction gold outline (text-shadow 0.25rem #E18D25), optional check icon (confirmButtonIcon.7b06cf.png) to the left."
    size: "20.625rem x 6.25rem"
    typography: "{typography.button-main}"
    hover: "brightness(1.05) translateY(-0.125rem)"
    active: "brightness(.95) translateY(0.0625rem)"
  pill-button:
    description: "Small blue capsule (entry_button_bg.b7b1df.png pattern on #2EBDF8 fill), 0.25rem solid white border, solid 0.25rem #4198B5 bottom shadow."
    height: "2.3125rem"
    padding: "0.125rem 1.875rem 0"
    radius: "62.4375rem"
    shadow: "0 0.25rem #4198B5"
  modal-button:
    description: "Standard dialog button (modal_btn.c8466d.png, brown-red). Cancel variant modal_cancel.fdea3d.png (blue-teal)."
    size: "15.75rem x 4.875rem"
  mode-button:
    description: "List/selection row button. Default modeBg.9d01fa.png (pink-red), selected modeBgSelected.35a358.png (gold). Brown text #784025, optional left/right bracket glyphs (brackets.b91c58.png, right one rotated 180deg)."
    size: "42.3125rem x 6.125rem"
    typography: "{typography.button-mode}"
  tab-item:
    description: "Small nav chip. Default tab_item_bg.59d9fb.png (blue), active tab_active_item_bg.0255ea.png (brown-gold)."
  property-panel:
    description: "Right-side control panel, modal_bg.106f4f.png cream surface."
    width: "20.5rem"
    padding: "1.75rem 1.25rem 1.25rem"
  back-button:
    description: "Small round back arrow (back_btn.f43238.png), blue."
    size: "5.1875rem x 5.625rem"
  close-button:
    description: "Round X (iconClose.9b7696.png)."
    size: "4.875rem"
  share-screen:
    description: "Share/result layer. Full-stage share_bg.e63078.png (light blue-cream art) with the large share panel on the right."
    bg-size: "115.563rem x 62.5rem"
  share-panel:
    description: "Big white share panel (share_panel_bg.733093.png)."
    size: "89.5625rem x 52.3125rem"
    position: "absolute; top 7.5rem; right 2.1875rem"
    padding: "6.25rem 4.625rem 3.875rem 6.3125rem"
  share-platform-bar:
    description: "Gold platform bar (share_modal_plater_bg.6f82a7.png) hosting weibo/qq/qzone/link/download icon buttons."
    size: "42.9375rem x 3.0625rem"
  dialog:
    description: "Big modal dialog (bigModalBg.2995b3.png cream) with a protruding title plate (ruleModalTitle.04b289.png) overlapping the top edge, translate(-50%, -2.375rem)."
    size: "76.875rem x 48.0625rem"
    padding: "2.25rem 6.25rem 4rem"
  confirm-button:
    description: "Save/confirm button (confirmButtonBg.85f4a2.png, gold)."
    size: "19.1875rem x 5.6875rem"
  stamp:
    description: "Postage-stamp band (stamp_bg.0a85fb.png, cream with perforated edge), used on postal forms."
    size: "50.0625rem x 11.75rem"
  address-line:
    description: "Address input line (addressLineBg.830d94.png, pink-cream) with a gold label chip (addressLabelBg.8c85bc.png, text #7A4025)."
    size: "50.25rem x 3.875rem"
  photo-frame:
    description: "User photo frame in the editor: pure white surface, 0.25rem solid white border, 0.625rem radius, soft drop shadow."
    radius: "{rounded.card}"
    shadow: "0 0.5rem 1.5rem rgba(0,0,0,0.25)"

---

## Overview

Hypergryph's 2026 summer activity page ("TILL THE LANDS BECOME AN ORANGE / 直到大地变成一颗酸橙", codename "信使的工作 / The Messenger's Work") is a **fixed-stage web game**, not a scrolling site: every screen is drawn inside a 120rem × 67.5rem stage (1365 × 768 px at base font) that scales as one unit by setting the html font-size to `min(viewportWidth/120, viewportHeight/67.5)` px. All CSS sizes are rem — there is no media-query re-layout; the whole composition shrinks uniformly. Below 500px height the header icon row additionally scales to 1.2.

The visual language is a **warm paper-craft system on a cool sky**: light-blue painted backgrounds (loading `bg.15abb9.jpg`, main `bg.89a968.jpg`) with a soft sunlit atmosphere, warm cream panels (`game_panel_bg`, `modal_bg`, `bigModalBg`), gold gradient buttons, and a small set of accent colors: sky blue `#2EBDF8` (interactive pills, progress, highlights) and paper brown `#784025` / `#5F3713` (ink on paper). The event's title art, character art (Angelina), and decorations (bamboo, clouds, stamps, address labels, rope, tape) are all pre-rendered PNGs — the page composes images, it does not draw illustrations.

Type is CJK display faces: **SourceHanSerifCN-Heavy** (button labels, mode rows, dialog buttons), **SourceHanSansCN-Heavy** (titles, header labels), **MaoKenShiJinHei** (progress label), **LuckiestGuy / Gilroy-Bold** (EN numerals), with **Noto Sans SC** as the base body face. White text on images always carries a 0.25rem black-30% text-shadow.

**Key Characteristics:**
- **One-stage fixed layout.** Everything absolute-positioned in rem inside 120×67.5rem; scaling is font-size driven, never flex-wrap.
- **Image-as-component.** Every button, panel, and icon is a stretched PNG (`background-size: 100% 100%` or `cover`). Corners, textures, and shadows are baked into the art.
- **Three-button economy.** Gold `mainBtn` (primary CTA, white text + 4-direction gold outline), blue capsule `entry_button_bg` pill (secondary), brown-red `modal_btn` (dialog confirm), teal `modal_cancel` (dismiss).
- **Consistent micro-interactions.** Hover: `filter: brightness(1.05)` + `translateY(-0.125rem)`; Active: `brightness(.95)` + `translateY(0.0625rem)`; transition 0.2s. Screen switches fade `opacity 0.5s ease-in-out`.
- **Deep-drop shadows are rare.** Flat colored "hard shadows" (0.25rem solid under buttons) and soft shadows for floating surfaces only.

## Colors

### Brand & Accent
- **Sky Blue** (`{colors.primary-blue}` — `#2EBDF8`): the single interactive accent — capsule upload button fill, progress icon tones, sticker handles, back button art. Paired with hard shadow `{colors.blue-shadow}` `#4198B5`.
- **Paper Brown** (`{colors.brown}` — `#784025`): ink-on-paper text for mode buttons and titles. Deep variant `{colors.brown-deep}` `#5F3713` for address-line text; soft `{colors.brown-soft}` `#8A7654` for hints.
- **Gold** (`{colors.gold}` — `#E18D25`): the 4-direction text-outline on primary buttons and slider accent. The gold gradient family (`#F0C030` → `#B06E32`) lives inside button art (`btn_start`, `mainBtn`, `confirmButtonBg`, `modeBgSelected`).
- **Stamp Red** (`{colors.stamp-red}` — `#D63B31`): stamps ("好评"/"差评"), delete actions.

### Surfaces (all pre-rendered art)
- **Sky canvas**: `bg.15abb9.jpg` (loading) / `bg.89a968.jpg` (main) — light blue with white clouds and warm light.
- **Wooden panel** (`{colors.panel-wood}` — `#F0C090` family): `game_panel_bg.0dbea4.png` — the central cream-wood stage panel with rounded corners baked in.
- **Menu panel** (`{colors.panel-wood-deep}` — `#C06060` family): `panel_menu_bg.9e761c.png` — red-tinted wood for the left list.
- **Cream dialog** (`{colors.modal-surface}` — `#F5F0D8` family): `modal_bg.106f4f.png`, `bigModalBg.2995b3.png`, `ruleModalTitle.04b289.png`.
- **White share surface**: `share_panel_bg.733093.png`.
- **Overlay** (`{colors.overlay}` — `rgba(20,45,80,0.55)`): dim layer behind dialogs.

### Text
- **White on art** (`{colors.text-on-image}` — `#FFFFFF`): all button labels, header labels, titles on image backgrounds; always with `text-shadow: 0 0.25rem rgba(0,0,0,0.30)`.
- **Brown on paper** (`{colors.brown}` / `{colors.brown-deep}`): text placed on light panels (mode buttons, address lines, tips).

## Typography

### Font Family
1. **Source Han Sans CN** (Heavy 900 / Bold 700 / Medium 400) — titles, header icon labels, small chips. Subset woff2 self-hosted.
2. **Source Han Serif CN** (Heavy 900 / Bold / Regular) — the "voice" face: start button, main button, mode buttons, dialog buttons, share title. **Heavy serif is the signature of this UI.**
3. **MaoKenShiJinHei** — progress label and playful small text.
4. **Luckiest Guy / Gilroy-Bold** — English logo and numerals (display numerals render at 5.3125rem / 60px).
5. **Noto Sans SC** — base body face (loaded from Google Fonts, same as the site).

### Hierarchy (px values at 1365×768 base, 1rem = 11.375px)

| Token | Size | Face | Use |
|---|---|---|---|
| `{typography.button-main}` | 34px | Serif Heavy 900 | `mainBtn` / `confirmButtonBg` labels, 4-direction gold outline |
| `{typography.button-mode}` | 31px | Serif Heavy 900 | mode/selection rows, brown `#784025` |
| `{typography.display-title}` | 27px | Sans Heavy 900 | section titles on panels |
| `{typography.button-start}` | 23px | Serif Heavy 900 | start button, white + shadow |
| `{typography.button-modal}` | 21px | Serif Heavy 900 | modal confirm/cancel labels |
| `{typography.header-icon-label}` | 21px | Sans Heavy 900 | header icons |
| `{typography.body}` | 11.4px | Noto Sans SC | default body (1rem) |
| `{typography.hint}` | 9.2px | Noto Sans SC | tips, fine print |

### Principles
- **Serif Heavy for action, Sans Heavy for structure.** Buttons speak in serif; panels/titles in sans.
- **White text on art always carries a black-30% 0.25rem shadow.** Never render white text on a painted background without it.
- **The gold outline (`{colors.gold}` 4-direction text-shadow) is reserved for primary CTAs.** Secondary buttons get plain white or brown text.

## Layout

### Scaling Model
- **Stage**: 120rem × 67.5rem (1365 × 768 at base). `html { font-size: min(vw/120, vh/67.5)px }`, updated on resize. All sizes in rem.
- **Screens** stack absolutely in the stage; switching = opacity fade 0.5s.
- **Header** is a fixed cluster at `top 2.5625rem; right 2.5rem`, z-index 100, above every screen; `@media (max-height: 500px)` scales it 1.2.

### Loading Screen Composition (all absolute, no flex)
Bottom-up layering inside `bg.15abb9.jpg`:
- `bottom.9e3648.png` strip: full-width × 4rem, pinned bottom
- `title_bg.05705a.png`: 103.688rem × 54.0625rem, top 0 (the big title backdrop)
  - `title_top.d7a8ac.png`: 102.75rem × 48.75rem, top 7.5rem, left 2.5rem
  - `title_text.a08874.png`: 45.375rem × 29.125rem, top 20rem, left 6.25rem
  - `title_role.aaeded.png`: 44.9375rem × 52.4375rem, top 9.375rem, right 7.5rem
- `logo.120944.png`: 28.1875rem × 5.8125rem, top 3.125rem, left 2.5rem (top-left corner)
- Progress bar: 40.9375rem × 3.8125rem at bottom 11.25rem / left 15.625rem
- Start button: 34.75rem × 6.875rem at bottom 10.625rem / left 21.25rem

### Main Screen Composition
- Full-stage `bg.89a968.jpg`; bottom strip same as loading.
- `game_panel_bg.0dbea4.png`: 108.438rem × 62.9375rem, left 1.875rem, vertically centered — hosts the whole app UI.
- Inside the panel: header row (back arrow | centered title badge | rule button + gold main button), then a 3-column body: left menu panel (19.5rem), center canvas, right property panel (20.5rem).

### Spacing
- rem-based; gaps between siblings 1rem–1.5rem; panel paddings 1.5–2.5rem; the panel inner top offset 4.375rem clears the panel's baked-in header art.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow. | Painted backgrounds, art layers. |
| Hard shadow | `0 0.25rem` solid color (`#4198B5` on blue pills, `#B06E32` on gold buttons). | Every pressable button — the button "rests" on a 3D lip; active state compresses it to 0.125rem. |
| Soft float | `0 0.5rem 1.5rem rgba(0,0,0,0.25)`. | Photo frame, floating surfaces. |
| Modal | `rgba(20,45,80,0.55)` dim + elevated dialog art. | Dialogs, share layer. |

## Shapes

- **Buttons**: pill/capsule shapes — radius 62.4375rem (effectively full) for capsule buttons; baked rounded corners for image buttons.
- **Panels**: rounded corners baked into the PNG art; inner content never overrides panel geometry.
- **Photo frame**: 0.25rem white border + 0.625rem radius + soft shadow.
- **List rows**: `modeBg` (677×98) and `modeBgSelected` (676×125) — full-width rows with baked corners and a subtle 3D bottom lip.
- **Stickers/decor**: stamps (`stamp_bg`), address labels, tape, rope — photographic paper props with baked textures.

## Motion

- **Hover**: `filter: brightness(1.05)` + `transform: translateY(-0.125rem)`, 0.2s — applied to every interactive element via the same rule pattern.
- **Active**: `brightness(.95)` + `translateY(0.0625rem)`; capsule buttons also shrink their hard shadow (0.25rem → 0.125rem).
- **Screen transition**: opacity 0→1, 0.5s ease-in-out.
- **Entrance**: elements fade in from `translateY(1rem)` (0.6s ease-out, e.g. `kA1ySG`); dialogs scale in from 0.9/0.8.
- **Progress**: fill bar width animates with content in the gold frame.

## Components

### Buttons
- **`start-button`** — the loading-screen gold CTA (`btn_start.107dd6.png`, 34.75×6.875rem, serif 23px white + shadow). Positioned bottom-left third of the stage, next to the progress bar.
- **`main-button`** — the primary action everywhere (`mainBtn.b6e517.png`, 20.625×6.25rem). White serif-heavy 34px with the 4-direction `#E18D25` outline; optional check icon left of text (`confirmButtonIcon.7b06cf.png`, 2.8125×2.4375rem).
- **`pill-button`** — secondary/utility capsule: `#2EBDF8` fill + `entry_button_bg.b7b1df.png` pattern, 0.25rem solid white border, hard shadow `0 0.25rem #4198B5`, 2.3125rem tall.
- **`modal-button`** — dialog confirm (`modal_btn.c8466d.png` brown-red, 15.75×4.875rem); **`modal-cancel`** — `modal_cancel.fdea3d.png` teal.
- **`confirm-button`** — gold save button (`confirmButtonBg.85f4a2.png`, 19.1875×5.6875rem), same white + gold-outline text as `main-button`.
- **`rule-button`** — circular gold help button (`btn_rule.948a3c.png`, 6.375–9.625rem).
- **`back-button`** — circular blue back arrow (`back_btn.f43238.png`, 5.1875×5.625rem).

### Header
- **`header-bar`** — absolute top-right cluster (`top 2.5625rem; right 2.5rem`), z-100, 1rem gaps. Icons are image buttons (`header_user_2` 3.5×3.5rem, `header_sound_on_2`/`header_home_2` 3.25rem) with `object-fit: contain` and the standard hover/active micro-interactions.

### Panels & Lists
- **`game-panel`** — the central wooden surface; all app UI lives inside.
- **`menu-panel`** — left vertical list (`panel_menu_bg.9e761c.png`, 19.5rem wide): title chips + `pill-button` upload + `mode-button` rows.
- **`property-panel`** — right controls on `modal_bg.106f4f.png` (20.5rem wide): sliders with `#E18D25` accent, `tab_item_bg`-style mini buttons, color swatches.
- **`mode-button`** — selection rows (brown text on pink-red art; selected = gold art), optional bracket glyphs (left normal, right rotated 180°).
- **`tab-item`** — small nav chips (blue default / brown-gold active).

### Result & Share
- **`share-screen`** — full-stage `share_bg.e63078.png` with dim overlay; **`share-panel`** (89.5625×52.3125rem, top 7.5rem right 2.1875rem) hosts the generated image in a white frame, the save `confirm-button`, a cancel/continue button, and **`share-platform-bar`** (gold bar, 42.9375×3.0625rem) with weibo/qq/qzone/link/download icon buttons.
- **`dialog`** — `bigModalBg.2995b3.png` (76.875×48.0625rem) with the title plate `ruleModalTitle.04b289.png` protruding above the top edge (`translate(-50%, -2.375rem)`); close via `iconClose.9b7696.png` (4.875rem).

### Paper Props (sticker/decor vocabulary)
- **`stamp`** — `stamp_bg.0a85fb.png` cream postage band with perforated edge.
- **`address-line`** — `addressLineBg.830d94.png` + gold `addressLabelBg.8c85bc.png` label chip.
- **Tape** `tape.115ecb.png`, **rope** `rope.f878fd.png`, **frame** `frame-1.3e0f6c.png`, **brackets** `brackets.b91c58.png` (10×32, rotated 180° for right side), **star** `title_star.fc5ba0.png`, **crown** `crown.b686fa.png`, **underline** `text_underline.d3ee60.png`, **review stamps** `good_review.ef002c.png` / `bad_review.3fa034.png`.

## Do's and Don'ts

### Do
- **Build inside the 120×67.5rem stage** and scale via html font-size (`min(vw/120, vh/67.5)` px). All sizes in rem. Never re-layout with media queries — shrink uniformly.
- **Use the pre-rendered art as components** (buttons, panels, icons stretched via `background-size: 100% 100%`); corners and textures live in the PNGs.
- **Keep the three-button economy**: gold `mainBtn` for the one primary action, blue capsule for secondary, `modal_btn`/`modal_cancel` for dialogs.
- **White text on art gets `text-shadow: 0 0.25rem rgba(0,0,0,.3)`**; primary buttons additionally get the 4-direction `#E18D25` outline.
- **Apply the standard micro-interactions everywhere**: hover `brightness(1.05)` + `translateY(-0.125rem)`, active `brightness(.95)` + `translateY(0.0625rem)`, 0.2s.
- **Serif Heavy for button labels, Sans Heavy for titles**; `#784025` brown for text on light panels.
- **Mirror the loading-screen composition** (title art left, character art right, gold start button + progress bar bottom-left) and the main-screen shell (wooden panel centered on sky, bottom strip, top-right header icons).

### Don't
- Don't introduce new colors outside the sky-blue / paper-brown / gold family — no purple, no neon.
- Don't replace serif-heavy button type with light-weight sans, and don't drop the black-30% text shadow from white-on-art text.
- Don't use heavy drop shadows on buttons — the flat colored lip (`0 0.25rem` solid) is the brand's button depth.
- Don't crop or re-color the character/title art; the art IS the decoration system (plus the baked-in bamboo/cloud props).
- Don't render the page at a fixed px size without the font-size scaling — the whole design breaks outside 1365×768.
- Don't put interactive elements outside the header's top-right cluster or the game panel — the layout contract is stage-level.

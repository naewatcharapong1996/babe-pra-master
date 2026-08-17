// Adaptive shadow tied to our own ink token (--onyx) rather than a fixed
// rgba value — the color-mix technique cult-ui's CutoutCard uses. Shared by
// every "soft card" surface on the page (curated section, lifestyle banner)
// so they read as one consistent shadow instead of each section inventing
// its own.
export const cardShadowClassName =
  "shadow-[0px_1px_2px_-1px_color-mix(in_oklab,var(--onyx)_8%,transparent),0px_4px_8px_-2px_color-mix(in_oklab,var(--onyx)_6%,transparent),0px_8px_16px_-4px_color-mix(in_oklab,var(--onyx)_5%,transparent)]";

export const cardShadowHoverClassName =
  "hover:shadow-[0px_2px_4px_-1px_color-mix(in_oklab,var(--onyx)_10%,transparent),0px_8px_16px_-4px_color-mix(in_oklab,var(--onyx)_8%,transparent),0px_16px_32px_-8px_color-mix(in_oklab,var(--onyx)_6%,transparent)]";

/* Conversion-event interface. NOT connected to any analytics provider.

   No analytics tool has been chosen yet, so nothing is sent anywhere and
   the privacy page still says the site runs no analytics. This exists so
   the events are named once, in one place, and wiring a provider later is
   a single listener rather than a hunt through components.

   Two ways events are marked:
   1. Links carry `data-track="<event>"` (works from server components).
   2. Client code calls track() for things that aren't clicks (quote steps).

   Both end up as a `dts:track` CustomEvent on window. To connect a
   provider, add one listener for that event — and delegate clicks on
   [data-track] into it — then update app/privacy/page.tsx. */

export type TrackEvent =
  | "call"
  | "directions"
  | "quote_start"
  | "quote_step"
  | "quote_submit"
  | "instagram"
  | "tiktok"
  | "google_reviews"
  | "write_review"
  | "review_open";

export function track(event: TrackEvent, props?: Record<string, string | number>): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("dts:track", { detail: { event, ...props } }));
}

/* Every outcome of the live-reviews provider, with a mocked fetch — no
   request reaches Google. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { FIELD_MASK, reviewsResponse } from "../lib/reviews/places";

const creds = { apiKey: "test-key", placeId: "test-place" };

function mockFetch(respond: () => Response | Promise<Response>) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const impl = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    return respond();
  }) as typeof fetch;
  return { impl, calls };
}

const quiet = () => {
  const orig = console.error;
  console.error = () => {};
  return () => (console.error = orig);
};

test("missing credentials → not-configured, and Google is never called", async () => {
  const { impl, calls } = mockFetch(() => new Response("{}"));
  for (const c of [{ apiKey: "", placeId: "x" }, { apiKey: "x", placeId: "" }]) {
    const r = await reviewsResponse({ ...c, fetchImpl: impl });
    assert.equal(r.status, 503);
    assert.deepEqual(r.body, { status: "unavailable", reason: "not-configured" });
  }
  assert.equal(calls.length, 0);
});

test("HTTP error, network error and bad JSON → provider-error", async () => {
  const restore = quiet();
  try {
    const cases = [
      () => new Response('{"error":{"status":"PERMISSION_DENIED"}}', { status: 403 }),
      () => Promise.reject(new Error("socket hang up")),
      () => new Response("<html>not json</html>", { status: 200 }),
    ];
    for (const respond of cases) {
      const { impl } = mockFetch(respond);
      const r = await reviewsResponse({ ...creds, fetchImpl: impl });
      assert.equal(r.status, 502);
      assert.deepEqual(r.body, { status: "unavailable", reason: "provider-error" });
    }
  } finally {
    restore();
  }
});

test("no reviews → empty (the carousel keeps the verified selection)", async () => {
  const { impl } = mockFetch(() => Response.json({ rating: 5, userRatingCount: 3 }));
  const r = await reviewsResponse({ ...creds, fetchImpl: impl });
  assert.deepEqual(r.body, { status: "unavailable", reason: "empty" });
});

test("success maps attribution and links, requests uncached", async () => {
  const { impl, calls } = mockFetch(() =>
    Response.json({
      rating: 4.9,
      userRatingCount: 150,
      googleMapsLinks: { reviewsUri: "https://maps.example/reviews", writeAReviewUri: "https://maps.example/write" },
      reviews: [
        {
          name: "places/x/reviews/1",
          rating: 5,
          text: { text: "Great tint." },
          relativePublishTimeDescription: "a week ago",
          publishTime: "2026-09-10T12:00:00Z",
          authorAttribution: { displayName: "A Reviewer", uri: "https://maps.example/a", photoUri: "https://photo.example/a" },
          googleMapsUri: "https://maps.example/review/1",
        },
        { rating: 5, text: { text: "no author" } }, // dropped: can't attribute
      ],
    }),
  );
  const r = await reviewsResponse({ ...creds, fetchImpl: impl });
  assert.equal(r.status, 200);
  assert.equal(r.body.status, "live");
  if (r.body.status !== "live") return;
  assert.equal(r.body.rating, 4.9);
  assert.equal(r.body.count, 150);
  assert.equal(r.body.reviews.length, 1);
  assert.deepEqual(r.body.reviews[0], {
    id: "places/x/reviews/1",
    authorName: "A Reviewer",
    authorPhotoUrl: "https://photo.example/a",
    authorUrl: "https://maps.example/a",
    rating: 5,
    text: "Great tint.",
    publishedAt: "2026-09-10T12:00:00Z",
    relativeTime: "a week ago",
    reviewUrl: "https://maps.example/review/1",
  });
  assert.deepEqual(r.body.links, { reviews: "https://maps.example/reviews", writeReview: "https://maps.example/write" });

  const [call] = calls;
  assert.match(call.url, /^https:\/\/places\.googleapis\.com\/v1\/places\/test-place\?/);
  assert.equal(call.init?.cache, "no-store");
  const headers = call.init?.headers as Record<string, string>;
  assert.equal(headers["X-Goog-FieldMask"], FIELD_MASK);
  assert.equal(headers["X-Goog-Api-Key"], "test-key");
});

import { LegalPage, CONTACT_LINE } from "@/lib/legal";
import { BUSINESS } from "@/lib/business";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "What Dallas Tint Shop collects when you request a quote, and what we do with it.",
  path: "/privacy",
});

/* Written to match what the site actually does. If the quote form changes
   channels — an email archive, a CRM, analytics — this page has to change
   with it, or it stops being true. */
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="September 2026">
      <p>
        {BUSINESS.name} runs a single form on this site: the quote request. This
        page explains what that form collects and where it goes. We do not sell
        or share your information with anyone.
      </p>

      <h2>What we collect</h2>
      <p>
        Only what you type into the quote form: your name, phone number, an
        optional email address, your vehicle, the services you&apos;re
        interested in, your answers to the follow-up questions for those
        services (such as body style or which areas you want covered), and any
        notes you add. Nothing else. We do
        not ask for payment details, and we have no account system.
      </p>

      <h2>Where it goes</h2>
      <p>
        When you submit the form, the details are sent as a text message to the
        shop&apos;s phone through Textbelt, an SMS delivery service. That text is
        how we see your request. Textbelt handles the message in transit; we
        don&apos;t store your submission anywhere else on this website.
      </p>

      <h2>How we use it</h2>
      <p>
        To reply to you with an estimate, by whichever method you asked for. We
        don&apos;t add you to a mailing list and we don&apos;t send marketing
        messages.
      </p>

      <h2>Cookies and tracking</h2>
      <p>
        This site sets no advertising or analytics cookies and does not track you
        across other websites. If you choose to load our TikTok feed, TikTok may
        set its own cookies; nothing from TikTok loads until you ask for it.
      </p>

      <h2>Third parties</h2>
      <p>
        The site is hosted on Vercel and quote texts are delivered by Textbelt.
        Photos and reels link out to Instagram, and our TikTok feed loads from
        TikTok only when you ask for it. Reviews, reviewer photos, maps and
        directions come from Google. Each of those companies has its own privacy
        policy governing what it handles.
      </p>

      <h2>Your choices</h2>
      <p>
        Want the details from your quote request deleted, or a copy of what we
        have? Call us and we&apos;ll take care of it. In practice this means
        deleting the text message.
      </p>

      <h2>Contact</h2>
      <p>{CONTACT_LINE}</p>
    </LegalPage>
  );
}

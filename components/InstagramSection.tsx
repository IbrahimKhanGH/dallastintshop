import Image from "next/image";
import SectionHeader from "./SectionHeader";
import { BUSINESS } from "@/lib/data";

// TODO: Replace with the latest 6 posts from @thedallastintshop
// (Instagram Graph API or static curated set).
const INSTA_POSTS = [
  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1617814086367-ed64d6dfafce?auto=format&fit=crop&w=900&q=80",
];

export default function InstagramSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-brand-black py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_60%_at_50%_100%,rgba(193,18,31,0.25)_0%,transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Dallas Car Culture"
            title={
              <>
                Follow the{" "}
                <span className="h-display-italic text-brand-red">build feed</span>
              </>
            }
            description="Daily wraps, tints, PPF and detail jobs from the shop floor — see real cars we just finished."
          />
          <a
            href={BUSINESS.instagram}
            target="_blank"
            rel="noreferrer"
            className="h-display group inline-flex items-center gap-3 rounded-sm border border-white/20 bg-white/[0.04] px-5 py-3 text-xs uppercase tracking-[0.25em] text-white transition-all hover:bg-white/10"
          >
            {BUSINESS.instagramHandle}
            <span className="grid h-6 w-6 place-items-center rounded-sm bg-brand-red/20 text-brand-red transition-all group-hover:bg-brand-red group-hover:text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M7 17L17 7M9 7h8v8"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="square"
                />
              </svg>
            </span>
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {INSTA_POSTS.map((src, i) => (
            <a
              key={i}
              href={BUSINESS.instagram}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden rounded-md bg-white/[0.03]"
            >
              <Image
                src={src}
                alt={`Instagram post ${i + 1} from Dallas Tint Shop`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40" />
              <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className="text-white"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (nextLocale: (typeof routing.locales)[number]) => {
    if (nextLocale === "en") {
      return;
    }

    if (nextLocale === locale) {
      return;
    }

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="mb-10 flex justify-end">
      <div className="relative inline-grid grid-cols-2 items-center rounded-full border border-zinc-800/90 bg-zinc-950/70 p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-sm">
        {routing.locales.map((availableLocale) => {
          const isActive = locale === availableLocale;
          const label = availableLocale === "pt-BR" ? "PT" : "EN";
          const isDisabled = availableLocale === "en";

          return (
            <button
              key={availableLocale}
              type="button"
              onClick={() => handleLocaleChange(availableLocale)}
              aria-pressed={isActive}
              aria-label={`Switch language to ${availableLocale}`}
              disabled={isPending || isDisabled}
              className={`relative z-10 min-w-16 rounded-full px-4 py-1.5 font-mono text-xs tracking-[0.16em] transition-all duration-200 ease-out ${
                isActive
                  ? "text-zinc-950"
                  : isDisabled
                    ? "text-zinc-600 cursor-not-allowed opacity-50"
                    : "text-zinc-400 hover:text-zinc-100 cursor-pointer"
              }`}
            >
              {isActive ? (
                <motion.span
                  layoutId="active-locale-pill"
                  transition={{
                    type: "tween",
                    duration: 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0 rounded-full bg-zinc-100 shadow-sm"
                />
              ) : null}
              <span className="relative z-10 flex items-center justify-center gap-1">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

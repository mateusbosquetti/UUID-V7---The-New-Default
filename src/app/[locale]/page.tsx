"use client";

import React from "react";
import { useTranslations } from "next-intl";
import UuidV7Generator from "@/components/uuid-generator";
import BTreeSimulator from "@/components/btree-simulator";
import UrlDecoder from "@/components/url-decoder";
import LanguageSwitcher from "@/components/language-switcher";

export default function Home() {
  const t = useTranslations("HomePage");

  const paragraphClassName =
    "font-sans text-base font-normal leading-8 text-[rgba(255,255,255,0.72)] md:text-[1.05rem]";
  const heading2ClassName =
    "mt-16 mb-4 font-mono text-4xl font-semibold tracking-tight text-zinc-100 md:text-5xl";
  const sectionClassName = "space-y-6 md:space-y-7";

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-[#0a0a0a]">
      <main className="mx-auto w-full max-w-4xl flex-1 space-y-12 px-6 pt-24 pb-16 md:space-y-14 md:px-8 md:pt-24 md:pb-24">
        {/* HEADER / HERO */}
        <header className="flex flex-col border-b border-zinc-900 pb-12 mb-12">
          <h1 className="mb-6 font-mono text-5xl font-bold tracking-tighter text-white md:text-7xl">
            {t("title-first-part")}{" "}
            <span className="bg-linear-to-r from-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              {t("title-second-part")}
            </span>
          </h1>

          <div className="md:flex md:justify-between">
            <p className={`mb-12 max-w-2xl ${paragraphClassName} md:text-xl`}>
              {t("subtitle")}
            </p>
            <LanguageSwitcher />
          </div>

          {/* AUTHOR METADATA */}
          <div className="flex items-center gap-4">
            <img
              src="/autor.jpg"
              alt="Mateus Bosquetti"
              className="h-12 w-12 rounded-full object-cover border-2 border-zinc-800"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-200">{t("meta.author")}</span>
              <div className="mt-0.5 flex items-center gap-2 font-mono text-sm text-zinc-500">
                <time dateTime="2026-07-15">{t("meta.date")}</time>
                <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
                <span>{t("meta.read-time")}</span>
              </div>
            </div>
          </div>
        </header>

        {/* ARTICLE CONTENTS */}
        <article className="space-y-14 md:space-y-16 text-zinc-300">
          
          {/* SEÇÃO 1: O PROBLEMA */}
          <section className={sectionClassName}>
            <p className={paragraphClassName}>
              {t("section1.p1")}
            </p>
            <p className={paragraphClassName}>
              {t.rich("section1.p2", {
                code_val: (chunks) => <code className="text-zinc-200 font-mono bg-zinc-900 px-1.5 py-0.5 rounded">{chunks}</code>
              })}
            </p>
            <ul className={`list-disc pl-6 space-y-3 ${paragraphClassName}`}>
              <li>
                <strong className="text-zinc-200 font-medium">{t("section1.li1-strong")}</strong>{t("section1.li1-text")}
              </li>
              <li>
                <strong className="text-zinc-200 font-medium">{t("section1.li2-strong")}</strong>{t.rich("section1.li2-text", {
                  code_val: (chunks) => <code className="text-zinc-200 font-mono bg-zinc-900 px-1 py-0.5 rounded">{chunks}</code>
                })}
              </li>
            </ul>
            <p className={paragraphClassName}>
              {t.rich("section1.p3", {
                code_val: (chunks) => <code className="text-zinc-200 font-mono bg-zinc-900 px-1.5 py-0.5 rounded">{chunks}</code>,
                bold_val: (chunks) => <strong className="text-zinc-200 font-medium">{chunks}</strong>
              })}
            </p>
          </section>

          {/* SEÇÃO 2: A SOLUÇÃO */}
          <section className={sectionClassName}>
            <h2 className={heading2ClassName}>
              {t("section2.title")}
            </h2>
            <p className={paragraphClassName}>
              {t("section2.p1")}
            </p>
            <p className={paragraphClassName}>
              {t("section2.p2")}
            </p>

            {/* GERADOR & RAIO-X INTERATIVO */}
            <UuidV7Generator />
          </section>

          {/* SEÇÃO 3: FUNCIONAMENTO & PERFORMANCE */}
          <section className={sectionClassName}>
            <h2 className={heading2ClassName}>
              {t("section3.title")}
            </h2>
            <p className={paragraphClassName}>
              {t("section3.p1")}
            </p>
            <p className={paragraphClassName}>
              {t.rich("section3.p2", {
                bold_val: (chunks) => <strong className="text-zinc-200 font-medium">{chunks}</strong>
              })}
            </p>
            <p className={paragraphClassName}>
              {t.rich("section3.p3", {
                bold_val: (chunks) => <strong className="text-zinc-200 font-medium">{chunks}</strong>
              })}
            </p>

            {/* SIMULADOR DE B-TREE */}
            <BTreeSimulator />
          </section>

          {/* SEÇÃO 4: CONTRAS & TRADE-OFFS */}
          <section className={sectionClassName}>
            <h2 className={heading2ClassName}>
              {t("section4.title")}
            </h2>
            <p className={paragraphClassName}>
              {t("section4.p1")}
            </p>
            <ul className={`list-disc pl-6 space-y-3 ${paragraphClassName}`}>
              <li>
                <strong className="text-zinc-200 font-medium">{t("section4.li1-strong")}</strong>{t.rich("section4.li1-text", {
                  bold_val: (chunks) => <strong className="text-zinc-200 font-medium">{chunks}</strong>
                })}
              </li>
              <li>
                <strong className="text-zinc-200 font-medium">{t("section4.li2-strong")}</strong>{t.rich("section4.li2-text", {
                  code_val: (chunks) => <code className="text-zinc-200 font-mono bg-zinc-900 px-1 py-0.5 rounded">{chunks}</code>
                })}
              </li>
            </ul>
            <p className={paragraphClassName}>
              {t.rich("section4.p2", {
                bold_val: (chunks) => <strong className="text-zinc-200 font-medium">{chunks}</strong>
              })}
            </p>

            {/* DECODIFICADOR DE URL E PRIVACIDADE */}
            <UrlDecoder />
          </section>

          {/* SEÇÃO 5: QUAL ESCOLHER */}
          <section className={sectionClassName}>
            <h2 className={heading2ClassName}>
              {t("section5.title")}
            </h2>
            <p className={paragraphClassName}>
              {t.rich("section5.p1", {
                bold_val: (chunks) => <strong className="text-zinc-200 font-medium">{chunks}</strong>
              })}
            </p>
            <p className={paragraphClassName}>
              {t("section5.p2")}
            </p>
          </section>

        </article>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto w-full border-t border-zinc-900 bg-[#060606]">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="text-xs tracking-[0.3em] text-zinc-600 uppercase font-mono">
            {t("footer.subtitle")}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500">
            <span>mateusbosquetti123@gmail.com</span>
            <a
              href="https://www.linkedin.com/in/mateus-bosquetti/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-zinc-300"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/mateusbosquetti"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-zinc-300"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';

const ACCENT = '#2C5F8A';

export type LegalSection = {
  zhHeading: string;
  enHeading: string;
  zh: string[];
  en: string[];
};

// 双语法律/信息页统一排版。Server Component，便于 SEO。
// 每节先中文（深色），后英文（灰色），分块对照。
export default function LegalPage({
  titleZh,
  titleEn,
  updated,
  intro,
  sections,
}: {
  titleZh: string;
  titleEn: string;
  updated: string;
  intro?: { zh: string; en: string };
  sections: LegalSection[];
}) {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1
            className="text-2xl font-semibold text-gray-900"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {titleZh}
          </h1>
          <p className="mt-1 text-sm text-gray-400" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            {titleEn}
          </p>
          <p className="mt-3 text-xs text-gray-400">
            最后更新 / Last updated: {updated}
          </p>

          {intro && (
            <div className="mt-6 border-l-2 pl-4" style={{ borderColor: ACCENT }}>
              <p className="text-sm text-gray-700 leading-relaxed">{intro.zh}</p>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">{intro.en}</p>
            </div>
          )}

          <div className="mt-10 space-y-10">
            {sections.map((s, i) => (
              <section key={i}>
                <h2 className="text-base font-semibold text-gray-900">
                  {i + 1}. {s.zhHeading}
                </h2>
                <p
                  className="text-xs text-gray-400 mb-3"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  {s.enHeading}
                </p>
                <div className="space-y-2">
                  {s.zh.map((p, j) => (
                    <p key={j} className="text-sm text-gray-700 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
                <div className="space-y-2 mt-3">
                  {s.en.map((p, j) => (
                    <p key={j} className="text-sm text-gray-400 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

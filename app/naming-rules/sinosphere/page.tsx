import type { Metadata } from "next";
import Link from 'next/link';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: "台湾·新加坡·马来西亚华人英文名写法",
  description:
    "台湾威妥玛拼音、新加坡马来西亚闽南粤语方言拼音详解，识别华人英文姓名并还原中文名的完整指南。",
  keywords: [
    "台湾人英文名",
    "新加坡华人姓名",
    "马来西亚华人名字",
    "威妥玛拼音",
    "Tan陈Lim林",
  ],
  alternates: { canonical: "/naming-rules/sinosphere" },
};

const sections = [
  {
    id: 'taiwan',
    title: '台湾人英文名',
    subtitle: '威妥玛拼音 + 自选英文名',
    rules: [
      {
        title: '不用汉语拼音，用威妥玛或通用拼音',
        content: '台湾官方长期使用威妥玛拼音（Wade-Giles）或通用拼音（Tongyong Pinyin）转写姓名，与中国大陆的汉语拼音差异显著。同一个汉字，在台湾和大陆的英文写法可能完全不同。翻译时不能用大陆拼音规则反推。',
      },
      {
        title: '常见姓氏对照',
        content: `威妥玛（台湾）vs 汉语拼音（大陆）：
蔡 → Tsai（台）/ Cai（陆）
郑 → Cheng（台）/ Zheng（陆）
蒋 → Chiang（台）/ Jiang（陆）
许 → Hsu（台）/ Xu（陆）
朱 → Chu（台）/ Zhu（陆）
周 → Chou（台）/ Zhou（陆）
庄 → Chuang（台）/ Zhuang（陆）
赵 → Chao（台）/ Zhao（陆）
邱 → Chiu（台）/ Qiu（陆）
吕 → Lü / Lu（台）/ Lü（陆）
看到"Ts-""Ch-""Hs-"开头的姓，基本可判断为台湾威妥玛拼音。`,
      },
      {
        title: '自选英文名',
        content: '大量台湾人在中文名之外另取一个英文名（通常为西方名），如 Kevin Chen、Jessica Wang、Andy Lin。这个英文名与中文名无对应关系，属个人偏好，翻译时一般保留英文名，不另行音译。',
      },
      {
        title: '姓名顺序',
        content: '台湾人在英文环境中通常将姓名调换为西方顺序（名在前、姓在后），如 Tsai Ing-wen（蔡英文）在英文报道中写作 Ing-wen Tsai。部分官方文件保留中文顺序（姓在前）。翻译时留意顺序，以姓氏辨别。',
      },
      {
        title: '连字号用法',
        content: '台湾中文名的名字部分（两字）在英文中常用连字号连接，如 Ing-wen（英文）、Chien-jen（建仁）。这表示连字号两侧合起来是一个名，不可拆分。',
      },
    ],
  },
  {
    id: 'singapore',
    title: '新加坡华人英文名',
    subtitle: '方言拼音为主，非普通话拼音',
    rules: [
      {
        title: '核心规律：按方言音拼写，不按普通话',
        content: '新加坡华人祖籍多为福建（闽南）、潮州、广东、客家等地，英文姓名按各自方言发音拼写，而非普通话。同一汉字，在新加坡的英文写法与大陆普通话拼音可能截然不同，不能用汉语拼音反推原字。',
      },
      {
        title: '常见姓氏方言拼音对照',
        content: `以下为新加坡常见写法（括号内为对应汉字）：
Tan（陈）—— 闽南音，非普通话 Chen
Lim（林）—— 闽南音，非普通话 Lin
Ong（王）—— 闽南音，非普通话 Wang
Ng（黄/吴）—— 粤语音，非普通话 Huang/Wu
Goh / Goa（吴）—— 闽南音
Lee（李）—— 闽南/粤语音，拼写与普通话 Li 相近但读音不同
Wong（王/黄）—— 粤语音
Koh / Chua / Quah（柯/蔡/柯）—— 闽南音
Teo / Teoh（张/郑）—— 闽南/潮州音
Lau（刘）—— 粤语音，非普通话 Liu
Yeo（杨）—— 闽南音，非普通话 Yang
Kwek / Quek（郭）—— 闽南/粤语音`,
      },
      {
        title: '英文名前置',
        content: '新加坡华人普遍有英文名，置于中文姓名之前，如 Peter Tan（陈某某）、Mary Lim（林某某）。正式文件中有时写全：Peter Tan Wei Ming。翻译时，英文名通常音译或保留，中文姓名部分可从方言拼写还原。',
      },
      {
        title: '姓名顺序',
        content: '新加坡官方文件中华人姓名通常为西方顺序（英文名/名在前，姓在后）。纯中文语境仍保持姓在前。翻译时注意：Tan Ah Kow 这类全中文拼音写法，Tan 是姓，其余是名。',
      },
      {
        title: '还原中文名的方法',
        content: '遇到新加坡华人英文姓名需还原中文时，步骤：①先判断姓（通常为第一个词）；②对照方言拼音表查对应汉字；③若有官方中文文件或本人中文名，以此为准，方言拼音仅供参考。',
      },
    ],
  },
  {
    id: 'malaysia',
    title: '马来西亚华人英文名',
    subtitle: '方言拼音，含马来尊称',
    rules: [
      {
        title: '与新加坡高度相似，同为方言拼音',
        content: '马来西亚华人祖籍结构与新加坡相似，英文姓名同样按闽南、粤语、客家、潮州等方言音拼写，不按普通话。Tan、Lim、Wong、Ng、Goh、Lee 等写法与新加坡一致，对应关系相同。',
      },
      {
        title: '马来西亚国家荣誉称号',
        content: `马来西亚有联邦及州级荣誉衔头，常出现在华人名字前，翻译时须识别并保留：
Tun（敦）—— 最高联邦荣誉，极少数人持有
Tan Sri（丹斯里）—— 联邦二等荣誉，类似爵士
Datuk Seri / Dato' Seri（拿督斯里）—— 联邦三等
Datuk / Dato'（拿督）—— 联邦或州级荣誉
这些称号置于名字之前，如 Tan Sri Lim Guan Eng（丹斯里林冠英）。翻译时称号单独处理，后接中文姓名。`,
      },
      {
        title: '客家话拼音特点',
        content: '马来西亚有相当比例的客家华人，其姓氏英文写法与闽南、粤语又有所不同。如 Wong 在粤语是王/黄，在客家话也可能是黄；Fong 可能是方或冯。遇到不确定的情况，优先查阅本人的中文资料。',
      },
      {
        title: '华语姓名与英文名并用',
        content: '马来西亚华人普遍同时使用中文名和英文名。官方文件（如护照、身份证）以英文拼音写法为准，中文名为辅。翻译时若需要中文名，以本人中文身份证上的写法为准，不可自行按拼音反推。',
      },
      {
        title: '易混淆点：华人 vs 马来人 vs 印度人',
        content: '马来西亚是多民族国家。马来人用 bin/binti 父名制（见各语言人名规则主页）；华人用中文姓名方言拼音；印度裔用"本名 a/l 父名"（a/l = anak lelaki，之子）或"本名 a/p 父名"（a/p = anak perempuan，之女）。看到 bin/binti 或 a/l/a/p 即可判断非华裔，不可用华人规则处理。',
      },
    ],
  },
];

export default function SinosphereNamingPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-16 max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}>
      <h1 className="text-3xl font-bold text-center mb-3" style={{ color: '#1A1A1A' }}>
        台湾·新加坡·马来西亚<br />华人英文姓名写法
      </h1>
      <p className="text-center text-gray-500 text-sm mb-12 leading-relaxed">
        三地华人姓名英文写法各有规律，与大陆汉语拼音差异显著<br />
        识别方言拼音是正确还原中文名的关键
      </p>

      {/* 快速跳转 */}
      <div className="flex gap-3 mb-12 justify-center">
        {sections.map(s => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="px-4 py-1.5 rounded-full text-sm border border-gray-200 text-gray-500 hover:border-gray-400 transition-all"
            style={{ background: '#fff' }}
          >
            {s.title}
          </a>
        ))}
      </div>

      {/* 各板块 */}
      <div className="space-y-14">
        {sections.map(section => (
          <section key={section.id} id={section.id} className="scroll-mt-8">
            <div className="mb-5">
              <h2 className="text-xl font-bold mb-1" style={{ color: '#1A1A1A' }}>
                {section.title}
              </h2>
              <p className="text-sm text-gray-400">{section.subtitle}</p>
            </div>

            <div className="space-y-4">
              {section.rules.map((rule, i) => (
                <div
                  key={i}
                  className="rounded-xl px-5 py-4"
                  style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                >
                  <div className="text-sm font-semibold mb-2" style={{ color: '#2C5F8A' }}>
                    {rule.title}
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#374151' }}>
                    {rule.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 方言拼音快查表 */}
      <section className="mt-16">
        <h2 className="text-lg font-bold mb-4" style={{ color: '#1A1A1A' }}>常见姓氏方言拼音快查</h2>
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#E8EDF2' }}>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#2C5F8A' }}>汉字</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#2C5F8A' }}>普通话拼音</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#2C5F8A' }}>新加坡/马来西亚写法</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#2C5F8A' }}>台湾威妥玛</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['陈', 'Chen', 'Tan / Chan', 'Chen'],
                ['林', 'Lin', 'Lim', 'Lin'],
                ['黄', 'Huang', 'Ng / Wong', 'Huang'],
                ['王', 'Wang', 'Ong / Wong', 'Wang'],
                ['吴', 'Wu', 'Goh / Ng', 'Wu'],
                ['李', 'Li', 'Lee', 'Li / Lee'],
                ['郭', 'Guo', 'Koh / Kwok / Quek', 'Kuo'],
                ['蔡', 'Cai', 'Chua / Chea', 'Tsai'],
                ['张', 'Zhang', 'Teo / Cheung / Chang', 'Chang'],
                ['刘', 'Liu', 'Lau', 'Liu'],
                ['杨', 'Yang', 'Yeo / Yeoh', 'Yang'],
                ['郑', 'Zheng', 'Tay / Cheng', 'Cheng'],
                ['许', 'Xu', 'Koh / Khoo', 'Hsu'],
                ['周', 'Zhou', 'Chew / Chu', 'Chou'],
                ['蒋', 'Jiang', 'Chiang', 'Chiang'],
              ].map(([zh, py, sg, tw]) => (
                <tr key={zh} className="border-t border-gray-50">
                  <td className="px-4 py-2.5 font-medium">{zh}</td>
                  <td className="px-4 py-2.5 text-gray-500">{py}</td>
                  <td className="px-4 py-2.5" style={{ color: '#2C5F8A' }}>{sg}</td>
                  <td className="px-4 py-2.5 text-gray-600">{tw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-300">
        内容依据语言学及命名惯例整理，仅供翻译参考
      </footer>
    </main>
    </>
  );
}

import type { MetadataRoute } from 'next';

// PWA manifest：让用户能把本站「安装到桌面/主屏」，常驻图标=回访入口。
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '外文译名词典 | nametochinese',
    short_name: '译名词典',
    description: '外文人名、地名中文译名查询工具，专为翻译工作者设计。',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F5F0',
    theme_color: '#012D6C',
    lang: 'zh-CN',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}

// src/lib/__tests__/sync-locale-meta.test.ts v5.2.58

import { afterEach, describe, expect, it } from 'vitest';
import { syncMetadataLocale } from '../sync-locale-meta';

describe('syncMetadataLocale', () => {
  afterEach(() => {
    document.head.innerHTML = '';
  });

  it('切换语言时让 og:url 与 canonical 同步到同一语言前缀', () => {
    document.head.innerHTML = `
      <link rel="canonical" href="https://hanzi.ewuse.com/zh-CN/learn">
      <meta name="description" content="旧描述">
      <meta property="og:url" content="https://hanzi.ewuse.com/zh-CN/learn">
      <meta property="og:locale" content="zh_CN">
    `;

    syncMetadataLocale('en');

    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://hanzi.ewuse.com/en/learn'
    );
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
      'https://hanzi.ewuse.com/en/learn'
    );
    expect(document.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe('en_US');
  });
});

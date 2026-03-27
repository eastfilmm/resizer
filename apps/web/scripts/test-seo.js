#!/usr/bin/env node

/**
 * SEO 테스트 스크립트
 * 
 * 사용법:
 * 1. 개발 서버 실행: pnpm dev
 * 2. 다른 터미널에서: node scripts/test-seo.js
 * 
 * 또는 빌드 후:
 * 1. pnpm build && pnpm start
 * 2. node scripts/test-seo.js
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3000';

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function extractMetaTags(html) {
  const metaTags = {};
  
  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) metaTags.title = titleMatch[1];
  
  // Meta description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (descMatch) metaTags.description = descMatch[1];
  
  // Meta keywords
  const keywordsMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i);
  if (keywordsMatch) metaTags.keywords = keywordsMatch[1];
  
  // Open Graph tags
  const ogTags = {};
  const ogMatches = html.matchAll(/<meta\s+property=["']og:(\w+)["']\s+content=["']([^"']+)["']/gi);
  for (const match of ogMatches) {
    ogTags[match[1]] = match[2];
  }
  if (Object.keys(ogTags).length > 0) metaTags.openGraph = ogTags;
  
  // Twitter Card tags
  const twitterTags = {};
  const twitterMatches = html.matchAll(/<meta\s+name=["']twitter:(\w+)["']\s+content=["']([^"']+)["']/gi);
  for (const match of twitterMatches) {
    twitterTags[match[1]] = match[2];
  }
  if (Object.keys(twitterTags).length > 0) metaTags.twitter = twitterTags;
  
  // Robots
  const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
  if (robotsMatch) metaTags.robots = robotsMatch[1];
  
  // Canonical URL
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (canonicalMatch) metaTags.canonical = canonicalMatch[1];
  
  // JSON-LD
  const jsonLdMatches = html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const jsonLd = [];
  for (const match of jsonLdMatches) {
    try {
      jsonLd.push(JSON.parse(match[1]));
    } catch (e) {
      console.warn('Failed to parse JSON-LD:', e.message);
    }
  }
  if (jsonLd.length > 0) metaTags.jsonLd = jsonLd;
  
  return metaTags;
}

function checkRobotsTxt(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const robotsUrl = `${urlObj.origin}/robots.txt`;
    const client = urlObj.protocol === 'https:' ? https : http;
    
    client.get(robotsUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ exists: true, content: data });
      });
    }).on('error', (err) => {
      if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        resolve({ exists: false, error: err.message });
      } else {
        reject(err);
      }
    });
  });
}

function checkSitemap(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const sitemapUrl = `${urlObj.origin}/sitemap.xml`;
    const client = urlObj.protocol === 'https:' ? https : http;
    
    client.get(sitemapUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ exists: true, content: data });
      });
    }).on('error', (err) => {
      if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        resolve({ exists: false, error: err.message });
      } else {
        reject(err);
      }
    });
  });
}

async function testSEO() {
  console.log('🔍 SEO 테스트 시작...\n');
  console.log(`대상 URL: ${TARGET_URL}\n`);
  
  try {
    // HTML 가져오기
    console.log('📄 HTML 가져오는 중...');
    const html = await fetchHTML(TARGET_URL);
    console.log('✅ HTML 가져오기 완료\n');
    
    // 메타 태그 추출
    console.log('🏷️  메타 태그 분석 중...');
    const metaTags = extractMetaTags(html);
    
    console.log('\n=== 메타 태그 분석 결과 ===\n');
    
    if (metaTags.title) {
      console.log(`✅ Title: ${metaTags.title}`);
    } else {
      console.log('❌ Title: 없음');
    }
    
    if (metaTags.description) {
      console.log(`✅ Description: ${metaTags.description}`);
      if (metaTags.description.length < 120) {
        console.log('   ⚠️  Description이 너무 짧습니다 (권장: 120-160자)');
      } else if (metaTags.description.length > 160) {
        console.log('   ⚠️  Description이 너무 깁니다 (권장: 120-160자)');
      }
    } else {
      console.log('❌ Description: 없음');
    }
    
    if (metaTags.keywords) {
      console.log(`✅ Keywords: ${metaTags.keywords}`);
    } else {
      console.log('⚠️  Keywords: 없음 (선택사항)');
    }
    
    if (metaTags.openGraph) {
      console.log('\n✅ Open Graph 태그:');
      Object.entries(metaTags.openGraph).forEach(([key, value]) => {
        console.log(`   - og:${key}: ${value}`);
      });
    } else {
      console.log('\n❌ Open Graph 태그: 없음');
    }
    
    if (metaTags.twitter) {
      console.log('\n✅ Twitter Card 태그:');
      Object.entries(metaTags.twitter).forEach(([key, value]) => {
        console.log(`   - twitter:${key}: ${value}`);
      });
    } else {
      console.log('\n⚠️  Twitter Card 태그: 없음 (선택사항)');
    }
    
    if (metaTags.canonical) {
      console.log(`\n✅ Canonical URL: ${metaTags.canonical}`);
    } else {
      console.log('\n⚠️  Canonical URL: 없음');
    }
    
    if (metaTags.jsonLd && metaTags.jsonLd.length > 0) {
      console.log('\n✅ JSON-LD 구조화된 데이터:');
      metaTags.jsonLd.forEach((data, index) => {
        console.log(`   [${index + 1}] @type: ${data['@type']}`);
        console.log(`       name: ${data.name || 'N/A'}`);
      });
    } else {
      console.log('\n❌ JSON-LD 구조화된 데이터: 없음');
    }
    
    // robots.txt 확인
    console.log('\n=== robots.txt 확인 ===\n');
    const robotsResult = await checkRobotsTxt(TARGET_URL);
    if (robotsResult.exists) {
      console.log('✅ robots.txt 존재');
      console.log('내용:');
      console.log(robotsResult.content);
    } else {
      console.log('❌ robots.txt 없음');
      console.log(`오류: ${robotsResult.error}`);
    }
    
    // sitemap.xml 확인
    console.log('\n=== sitemap.xml 확인 ===\n');
    const sitemapResult = await checkSitemap(TARGET_URL);
    if (sitemapResult.exists) {
      console.log('✅ sitemap.xml 존재');
      console.log('내용:');
      console.log(sitemapResult.content);
    } else {
      console.log('❌ sitemap.xml 없음');
      console.log(`오류: ${sitemapResult.error}`);
    }
    
    console.log('\n=== 테스트 완료 ===\n');
    console.log('💡 추가 검증 도구:');
    console.log('   - Google Rich Results Test: https://search.google.com/test/rich-results');
    console.log('   - Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/');
    console.log('   - Twitter Card Validator: https://cards-dev.twitter.com/validator');
    console.log('   - Lighthouse (Chrome DevTools): F12 > Lighthouse 탭');
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 개발 서버가 실행 중인지 확인하세요:');
      console.error('   pnpm dev');
    }
    process.exit(1);
  }
}

testSEO();

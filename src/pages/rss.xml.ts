import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { withBase } from '../lib/base';

export async function GET(context: APIContext) {
  const posts = await getCollection('writing');
  return rss({
    title: 'Surya Ravi — Writing',
    description: 'Write-ups and notes on application, API and AI security.',
    site: context.site!,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.summary ?? '',
        pubDate: post.data.date,
        link: post.data.external ?? withBase(`/writing/${post.id}/`),
        categories: post.data.tags,
      })),
  });
}

import type { Route } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCurrentUserFromSession } from '@/lib/auth';
import { buildVideoPolicyClauses, getActiveChildPolicy } from '@/lib/child-policy';
import { localizeCategoryName } from '@/lib/categories';
import { CategoryChipSlider } from '@/components/catalog/category-chip-slider';
import { VideoCard } from '@/components/video/video-card';
import { localizeVideoList } from '@/lib/content-localization';
import { getDemoLongCategoryCounts, getFilteredDemoLongVideos } from '@/lib/demo-videos';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';
import { prisma } from '@/lib/prisma';
import { buildVideoLanguageWhere } from '@/lib/video-language';

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const locale = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();
  const policy = user ? await getActiveChildPolicy(user.id) : null;
  const policyClauses = buildVideoPolicyClauses(policy);

  const [videos, grouped] = await Promise.all([
    prisma.video.findMany({
      where: {
        AND: [{ isPublished: true }, buildVideoLanguageWhere(locale), ...policyClauses, ...(category ? [{ category }] : [])]
      },
      orderBy: [{ viewsCount: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        category: true,
        ageGroup: true,
        thumbnailUrl: true,
        durationSec: true,
        viewsCount: true,
        contentType: true
      }
    }),
    prisma.video.groupBy({
      by: ['category'],
      where: {
        AND: [{ isPublished: true }, buildVideoLanguageWhere(locale), ...policyClauses]
      },
      _count: { _all: true },
      orderBy: { category: 'asc' }
    })
  ]);

  const fallbackVideos = videos.length === 0 ? getFilteredDemoLongVideos(locale, { category, limit: 40 }) : [];
  const fallbackGroups = grouped.length === 0 ? getDemoLongCategoryCounts(locale) : [];
  const sourceGroups = grouped.length ? grouped.map((item) => ({ name: item.category, count: item._count._all })) : fallbackGroups;

  const localizedVideos = videos.length ? localizeVideoList(videos, locale) : fallbackVideos;
  const categories = sourceGroups.map((item) => ({
    name: item.name,
    count: item.count,
    href: (`/search?category=${encodeURIComponent(item.name)}` as Route),
    active: item.name === category
  }));

  return (
    <div className="min-h-screen bg-background pb-24 pt-5 lg:pb-10">
      <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-5 lg:px-6">
        <div className="mb-6 flex items-start gap-3">
          <Link
            href={'/categories' as Route}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary shadow-card transition hover:bg-secondary"
            aria-label={translate(locale, 'common.back')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="min-w-0">
            <h1 className="text-[28px] font-bold leading-tight text-primary sm:text-[34px]">
              {category ? localizeCategoryName(category, locale) : translate(locale, 'home.allCategories')}
            </h1>
            <p className="mt-1 text-[15px] text-primary/75 sm:text-[16px]">
              {translate(locale, 'categories.videoCount', { count: localizedVideos.length })}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(243,250,255,0.92)_100%)] p-4 shadow-card sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-bold text-primary sm:text-[20px]">{translate(locale, 'categories.title')}</h2>
                <p className="mt-1 text-[14px] text-primary/68 sm:text-[15px]">{translate(locale, 'categories.subtitle')}</p>
              </div>
            </div>

            <CategoryChipSlider categories={categories} allLabel={translate(locale, 'home.allCategories')} />
          </section>

          {localizedVideos.length ? (
            <section className="grid justify-center gap-4 sm:gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,340px))] xl:[grid-template-columns:repeat(auto-fit,minmax(280px,360px))]">
              {localizedVideos.map((video) => (
                <VideoCard key={video.id} video={video} locale={locale} />
              ))}
            </section>
          ) : (
            <div className="rounded-[22px] border border-border bg-card p-5 text-[16px] text-primary/80 shadow-card">
              {translate(locale, 'categories.empty')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

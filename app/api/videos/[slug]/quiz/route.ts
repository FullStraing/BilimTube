import { NextResponse } from 'next/server';
import { getCurrentUserFromSession } from '@/lib/auth';
import { buildVideoPolicyClauses, getActiveChildPolicy } from '@/lib/child-policy';
import { getLocaleFromCookie, translate } from '@/lib/i18n/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const locale = await getLocaleFromCookie();
  const user = await getCurrentUserFromSession();
  if (!user) {
    return NextResponse.json({ error: translate(locale, 'common.notAuthorized') }, { status: 401 });
  }

  const { slug } = await params;
  const policy = await getActiveChildPolicy(user.id);
  const policyClauses = buildVideoPolicyClauses(policy);

  const video = await prisma.video.findFirst({
    where: {
      AND: [{ slug, isPublished: true }, ...policyClauses]
    },
    select: {
      id: true,
      title: true,
      quiz: {
        select: {
          id: true,
          title: true,
          description: true,
          questions: {
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              text: true,
              sortOrder: true,
              options: {
                orderBy: { sortOrder: 'asc' },
                select: {
                  id: true,
                  text: true,
                  sortOrder: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!video) {
    return NextResponse.json({ error: translate(locale, 'common.videoNotFound') }, { status: 404 });
  }

  if (!video.quiz) {
    return NextResponse.json({ error: translate(locale, 'quiz.notAddedTitle') }, { status: 404 });
  }

  return NextResponse.json({
    videoTitle: video.title,
    quiz: video.quiz
  });
}

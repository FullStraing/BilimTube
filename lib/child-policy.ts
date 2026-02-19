import type { Prisma } from '@prisma/client';
import { getActiveChildIdForUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const ENTERTAINMENT_CATEGORIES = ['Мультфильмы', 'Игры', 'Развлечения'];

export type ActiveChildPolicy = {
  id: string;
  allowedAgeGroups: string[];
  educationalOnly: boolean;
};

export async function getActiveChildPolicy(userId: string): Promise<ActiveChildPolicy | null> {
  const activeChildId = await getActiveChildIdForUser(userId);
  if (!activeChildId) return null;

  const child = await prisma.childProfile.findFirst({
    where: { id: activeChildId, userId },
    select: {
      id: true,
      allowedAgeGroups: true,
      educationalOnly: true
    }
  });

  if (!child) return null;
  return child;
}

export function buildVideoPolicyClauses(policy: ActiveChildPolicy | null): Prisma.VideoWhereInput[] {
  if (!policy) return [];

  const clauses: Prisma.VideoWhereInput[] = [];

  if (policy.allowedAgeGroups.length > 0) {
    clauses.push({ ageGroup: { in: policy.allowedAgeGroups } });
  }

  if (policy.educationalOnly) {
    clauses.push({
      category: { notIn: ENTERTAINMENT_CATEGORIES }
    });
  }

  return clauses;
}

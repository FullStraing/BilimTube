import { notFound, redirect } from 'next/navigation';
import { getCurrentUserFromSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ParentControlsView } from '@/features/parent-control/controls-view';

export default async function ParentChildControlsPage({
  params
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;

  const user = await getCurrentUserFromSession();
  if (!user) {
    redirect('/auth/login');
  }

  const child = await prisma.childProfile.findFirst({
    where: {
      id: childId,
      userId: user.id
    },
    select: {
      id: true,
      name: true,
      age: true,
      avatarColor: true,
      dailyLimitMinutes: true,
      educationalOnly: true,
      allowedAgeGroups: true
    }
  });

  if (!child) {
    notFound();
  }

  return <ParentControlsView child={child} />;
}

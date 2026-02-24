'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/auth/login');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center justify-between rounded-[18px] bg-[#F8D6DF] px-4 py-5 text-left text-[18px] font-semibold text-[#D93D63] transition hover:brightness-95"
    >
      <span className="inline-flex items-center gap-3">
        <LogOut className="h-6 w-6" />
        Выйти
      </span>
      <span aria-hidden> </span>
    </button>
  );
}


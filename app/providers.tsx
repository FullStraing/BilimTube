'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createQueryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { ToastStateProvider } from '@/components/ui/use-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastStateProvider>
        {children}
        <Toaster />
      </ToastStateProvider>
    </QueryClientProvider>
  );
}

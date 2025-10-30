'use client';

import { useEffect, useState } from 'react';

type ToastItem = { id: string; message: string; variant?: 'success' | 'error' | 'info' };

export function toast(message: string, variant: 'success' | 'error' | 'info' = 'info') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('app:toast', { detail: { message, variant } })
    );
  }
}

export function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ message: string; variant?: 'success' | 'error' | 'info' }>;
      const id = crypto.randomUUID();
      const item: ToastItem = { id, message: ce.detail.message, variant: ce.detail.variant };
      setToasts((prev) => [...prev, item]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };
    window.addEventListener('app:toast', handler as any);
    return () => window.removeEventListener('app:toast', handler as any);
  }, []);

  const color = (v?: string) =>
    v === 'error' ? 'bg-rose-600' : v === 'success' ? 'bg-[#00A396]' : 'bg-[#FF8001]';

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`text-white px-4 py-3 rounded-lg shadow-lg ${color(t.variant)}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}



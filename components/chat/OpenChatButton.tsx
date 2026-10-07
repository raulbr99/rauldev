'use client';

import type { ReactNode } from 'react';
import { requestOpenChat } from '@/lib/chat-events';

export default function OpenChatButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button type="button" onClick={requestOpenChat} className={className}>
      {children}
    </button>
  );
}

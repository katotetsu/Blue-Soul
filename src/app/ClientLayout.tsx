'use client'

import { ReactNode } from 'react';
import { ChantProvider } from '@/context/ChantContext';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <ChantProvider>{children}</ChantProvider>;
} 
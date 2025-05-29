'use client';
import { RecoilRoot } from 'recoil';
import { Header } from '@/components/header';
import { Suspense } from 'react';

export default function LayoutRecoilRoot({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <Suspense>
        <Header />
        <div className='container m-auto'>{children}</div>
      </Suspense>
    </RecoilRoot>
  );
}

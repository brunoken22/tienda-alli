'use client';
import {RecoilRoot} from 'recoil';
import {Header} from '@/components/header';
import {Suspense} from 'react';

export default function LayoutRecoilRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RecoilRoot>
      <Suspense>
        <Header />
        {children}
      </Suspense>
    </RecoilRoot>
  );
}

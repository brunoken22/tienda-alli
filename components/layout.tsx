'use client';
import {RecoilRoot} from 'recoil';
import {Header} from '@/components/header';

export function LayoutRecoilRoot({children}: {children: React.ReactNode}) {
  return (
    <RecoilRoot>
      <Header />
      {children}
    </RecoilRoot>
  );
}

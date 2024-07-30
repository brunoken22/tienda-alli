'use client';
import {RecoilRoot} from 'recoil';
import {Header} from '@/components/header';

export default function LayoutRecoilRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RecoilRoot>
      <Header />
      {children}
    </RecoilRoot>
  );
}

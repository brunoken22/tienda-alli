"use client"
import { RecoilRoot } from 'recoil';

export function LayoutRecoilRoot({children}: {children: React.ReactNode}) {
  return <RecoilRoot>{children}</RecoilRoot>;
}

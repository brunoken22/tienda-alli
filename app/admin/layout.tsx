import { AuthProvider } from "@/contexts/auth-context";

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

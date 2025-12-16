export interface AdminType {
  id: string;
  name: string;
  email: string;
  isVerified: false;
  role: "Admin" | "User";
  isActive: Boolean;
}

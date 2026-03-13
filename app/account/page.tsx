import { UserProfile } from "@clerk/nextjs";
import DisabilitySelector from "@/components/DisabilitySelector";

export default function AccountPage() {
  return (
    <div style={{ padding: "40px" }}>
      <UserProfile />
      <DisabilitySelector />
    </div>
  );
}
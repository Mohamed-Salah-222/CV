import { UserProfile } from "@clerk/react";

export default function ProfilePage() {
  return (
    <div className="flex justify-center p-8">
      <UserProfile />
    </div>
  );
}

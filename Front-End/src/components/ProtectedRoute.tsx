import { Show } from "@clerk/react";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out">
        <Navigate to="/sign-in" replace />
      </Show>
    </>
  );
}

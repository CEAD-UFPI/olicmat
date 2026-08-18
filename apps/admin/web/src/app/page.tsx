import { redirect } from "next/navigation";

// The landing page now lives in the dedicated `@olicmat/web` module.
// The root of the admin app is not a public page — send unauthenticated
// visitors straight to login; authenticated users are handled by the
// dashboard layout's role redirect.
export default function Home() {
  redirect("/login");
}

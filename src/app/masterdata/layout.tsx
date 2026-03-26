import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  console.log(user);

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/"); // atau forbidden page
  }

  return <>{children}</>;
}
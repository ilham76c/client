"use client";

import dynamic from "next/dynamic";

const OwnershipChart = dynamic(
  () => import("@/features/ownership/components/OwnershipChart"),
  { ssr: false }
);

export default function OwnershipClient() {
  return <OwnershipChart />;
}

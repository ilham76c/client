import { useQuery } from "@tanstack/react-query";

export function useOwnership() {
  return useQuery({
    queryKey: ["ownership"],
    queryFn: async () => {
      const res = await fetch("/api/ownership");
      return res.json();
    },
  });
}

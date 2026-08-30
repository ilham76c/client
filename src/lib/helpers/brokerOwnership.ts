export type BrokerOwnership = 'FOREIGN' | 'LOCAL' | 'BUMN';

interface BrokerOwnershipMeta {
  color: string;
  label: string;
}

const BROKER_OWNERSHIP_MAP: Record<BrokerOwnership, BrokerOwnershipMeta> = {
  FOREIGN: { color: '#f87171', label: 'Asing' },
  LOCAL: { color: '#c084fc', label: 'Lokal' },
  BUMN: { color: '#4ade80', label: 'BUMN' },
};

export function brokerOwnershipMeta(
  ownership: string | null,
): BrokerOwnershipMeta {
  if (!ownership) {
    return { color: '#6b7280', label: 'Tidak diketahui' };
  }

  const normalized = ownership.trim().toUpperCase() as BrokerOwnership;

  return (
    BROKER_OWNERSHIP_MAP[normalized] ?? { color: '#9ca3af', label: ownership }
  );
}

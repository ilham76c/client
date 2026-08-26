// lib/helpers/brokerType.ts
import BuildingBankIcon from '@mui/icons-material/AccountBalance';
import LockIcon from '@mui/icons-material/Lock';
import InsightsIcon from '@mui/icons-material/Insights';

export function brokerTypeMeta(type: string) {
  switch (type) {
    case 'BANK KUSTODIAN':
      return {
        icon: BuildingBankIcon,
        color: '#60a5fa',
        label: 'Bank Kustodian',
      };
    case 'CLOSED MEMBER':
      return { icon: LockIcon, color: '#facc15', label: 'Closed Member' };
    case 'PERUSAHAAN SEKURITAS':
    case 'PERUSAHAAN SEKURITAS / BROKER':
      return {
        icon: InsightsIcon,
        color: '#4ade80',
        label: 'Perusahaan Sekuritas',
      };
    default:
      return { icon: InsightsIcon, color: '#9ca3af', label: type };
  }
}

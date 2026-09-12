// hooks/useVolumeSpikes.ts
import { useQuery } from '@tanstack/react-query';
import { screenerApi } from '../api';

export const useVolumeSpikes = ({ limit, period, minRatio }) => {
  return useQuery({
    queryKey: ['volume-spikes', limit, period, minRatio],
    queryFn: ({ signal }) => screenerApi.fetchVolumeSpikes({ limit, period, minRatio }, signal),
    enabled: !!limit && !!period,
    staleTime: 60 * 1000, // 1 minute — price data changes more often
    select: (res) => res.data,
  });
};

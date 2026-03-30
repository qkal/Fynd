<script lang="ts">
import { createCache } from '../../../src/index';

interface Props {
  fn: (signal: AbortSignal) => Promise<number[]>;
  cacheKey: string;
}

const { fn, cacheKey }: Props = $props();

export const cache = createCache({ refetchOnWindowFocus: false });
const result = cache.query({
  key: cacheKey,
  fn,
  select: (data: number[]) => data.map((n) => n * 2),
});
</script>

<div data-testid="status">{result.status}</div>
<div data-testid="data">{JSON.stringify(result.data ?? null)}</div>

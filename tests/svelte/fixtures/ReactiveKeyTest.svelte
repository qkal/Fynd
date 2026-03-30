<script lang="ts">
import { createCache } from '../../../src/index';

interface Props {
  fn: (signal: AbortSignal) => Promise<unknown>;
  keepPreviousData?: boolean;
}

const { fn, keepPreviousData = false }: Props = $props();

let userId = $state(1);

const cache = createCache({ refetchOnWindowFocus: false });
const result = cache.query({
  key: () => ['user', userId],
  fn,
  keepPreviousData,
});

export function setUserId(id: number) {
  userId = id;
}
</script>

<div data-testid="status">{result.status}</div>
<div data-testid="data">{JSON.stringify(result.data ?? null)}</div>

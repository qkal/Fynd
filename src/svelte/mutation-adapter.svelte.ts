import { MutationRunner } from '../core/mutation';
import type { MutationConfig, MutationState } from '../core/types';

/**
 * Wraps a MutationRunner in Svelte 5 `$state` reactivity.
 * Accepts the global `cacheOnError` from the resolved CacheConfig.
 */
export function createReactiveMutation<TData, TVariables, TContext = unknown>(
  config: MutationConfig<TData, TVariables, TContext>,
  cacheOnError?: (error: Error, key: unknown[]) => void,
) {
  const runner = new MutationRunner<TData, TVariables, TContext>(config, cacheOnError);
  let state = $state<MutationState<TData>>(runner.getState());

  const unsubscribe = runner.subscribe((newState) => {
    state = newState;
  });

  $effect(() => {
    return () => {
      unsubscribe();
      runner.reset();
    };
  });

  return {
    get status() {
      return state.status;
    },
    get data() {
      return state.data;
    },
    get error() {
      return state.error;
    },
    mutate: (variables: TVariables): Promise<void> => runner.mutate(variables),
    reset: () => runner.reset(),
  };
}

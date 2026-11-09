import { DependencyList, useCallback, useEffect, useState } from 'react';
import { errorMessage, useNotify } from './notify';

export default function useLoad<T>(load: () => Promise<T>, deps: DependencyList) {
  const notify = useNotify();
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);

  const run = useCallback(load, deps);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setData(await run());
    } catch (error) {
      notify(errorMessage(error, 'Erro ao carregar dados'), 'error');
    } finally {
      setLoading(false);
    }
  }, [run, notify]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, setData, loading, reload };
}

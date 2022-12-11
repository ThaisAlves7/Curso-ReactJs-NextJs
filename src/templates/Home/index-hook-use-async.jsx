import { useCallback, useEffect, useState } from 'react';

const useAsync = (asyncFunction, shouldRun) => {
  const [state, setState] = useState({
    result: null,
    error: null,
    status: 'idle',
  });

  const run = useCallback(async () => {
    //Delay para fins de testes e visualização das mensagens [ Didático ]
    await new Promise((d) => setTimeout(d, 2000));

    setState({
      result: null,
      error: null,
      status: 'pending',
    });

    //Delay para fins de testes e visualização das mensagens [ Didático ]
    await new Promise((d) => setTimeout(d, 2000));

    return asyncFunction()
      .then((response) => {
        setState({
          result: response,
          error: null,
          status: 'settled',
        });
      })
      .catch((err) => {
        setState({
          result: null,
          error: err,
          status: 'error',
        });
      });
  }, [asyncFunction]);

  useEffect(() => {
    if (shouldRun) {
      run();
    }
  }, [run, shouldRun]);

  return [run, state.result, state.error, state.status];
};

const fetchData = async () => {
  // throw new Error('Que chato');
  //Delay para fins de testes e visualização das mensagens [ Didático ]
  await new Promise((d) => setTimeout(d, 2000));

  const data = await fetch('https://jsonplaceholder.typicode.com/posts');
  const json = await data.json();

  return json;
};

export const Home = () => {
  const [posts, setPosts] = useState(null);
  const [reFetchData, result, error, status] = useAsync(fetchData, true);

  // Re-executar a função novamente
  useEffect(() => {
    setTimeout(() => {
      reFetchData();
    }, 6000);
  }, [reFetchData]);

  function handleClick() {
    reFetchData();
  }

  // Não tem nada sendo executado
  if (status === 'idle') {
    return <pre>Idle: Nada executando!</pre>;
  }

  // Execução carregando
  if (status === 'pending') {
    return <pre>Pending: Loading...</pre>;
  }

  // Erro no carregamento dos arquivos
  if (status === 'error') {
    return <pre>Error: {error.message}</pre>;
  }

  // Arquivos carregados
  if (status === 'settled') {
    return <pre onClick={handleClick}>Settled: {JSON.stringify(result, null, 2)}</pre>;
  }

  return 'IXII';
};

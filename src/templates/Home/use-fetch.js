import { useEffect, useRef, useState } from 'react';

// Verificar igualdade
const isObjectEqual = (objA, objB) => {
  return JSON.stringify(objA) === JSON.stringify(objB);
};

/* eslint-disable no-unused-vars */
export const useFetch = (url, options) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const urlRef = useRef(url);
  const optionsRef = useRef(options);

  useEffect(() => {
    let changed = false;

    // Comparar se as urls são iguais
    if (!isObjectEqual(url, urlRef.current)) {
      urlRef.current = url;
      changed = true;
    }

    // Comparar se as options são iguais
    if (!isObjectEqual(options, optionsRef.current)) {
      optionsRef.current = options;
      changed = true;
    }

    // Realiza a chamada apenas 1 vez
    if (changed) {
      setShouldLoad((s) => !s);
    }
  }, [url, options]);

  useEffect(() => {
    let wait = false;
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);

    const fetchData = async () => {
      // Criando um delay só para testes
      await new Promise((r) => setTimeout(r, 3000));

      try {
        const response = await fetch(urlRef.current, { signal, ...optionsRef.current });
        const jsonResult = await response.json();

        if (!wait) {
          setResult(jsonResult);
          setLoading(false);
        }
      } catch (err) {
        if (!wait) {
          setLoading(false);
        }
        console.log('My Error', err.message);
      }
    };

    fetchData();

    return () => {
      wait = true;
      controller.abort;
    };
  }, [shouldLoad]);

  return [result, loading];
};

// Verificar tamanho da tela para "Media Queries de responsividade"
/* (function () {
  console.clear();
  const matchMedia = window.matchMedia('(max-width: 768px)');

  matchMedia.addListener(function () {
    console.log(matchMedia, window.innerWidth);
  });
})(); */

import { useDebugValue, useEffect, useState } from 'react';

const useMediaQuery = (queryValue, initialValue = false) => {
  const [match, setMatch] = useState(initialValue);

  useDebugValue('Qualquer coisa que eu quiser');

  useEffect(() => {
    let isMounted = true;
    const matchMedia = window.matchMedia(queryValue);

    const handleChange = () => {
      // Verifica se a função esta montada ainda
      if (!isMounted) return;
      setMatch(Boolean(matchMedia.matches));
    };

    matchMedia.addEventListener('change', handleChange);
    setMatch(!!matchMedia.matches);

    return () => {
      isMounted = false;
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [queryValue]);

  return match;
};

export const Home = () => {
  const huge = useMediaQuery('(min-width: 980px)');
  const big = useMediaQuery('(max-width: 979px) and (min-width: 768px)');
  const medium = useMediaQuery('(max-width: 767px) and (min-width: 321px)');
  const small = useMediaQuery('(max-width: 321px)');

  const background = huge ? 'green' : big ? 'red' : medium ? 'yellow' : small ? 'purple' : null;

  return <div style={{ fontSize: '60px', background }}> Oi</div>;
};

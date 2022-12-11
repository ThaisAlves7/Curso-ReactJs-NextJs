import { useLayoutEffect, useRef, useState } from 'react';

export const Home = () => {
  const [counted, setCounted] = useState([0, 1, 2, 3, 4, 5]);
  const divRef = useRef();

  // Realiza a rolagem de forma automática a cada inserção dentro da Div
  useLayoutEffect(() => {
    const now = Date.now();
    while (Date.now() < now + 600);
    divRef.current.scrollTop = divRef.current.scrollHeight;
  });

  // Adiciona um item na lista na sequência somando +1 ao valor anterior
  const handleClick = () => {
    setCounted((c) => [...c, +c.slice(-1) + 1]);
  };

  return (
    <>
      <button onClick={handleClick}>Count {counted.slice(-1)}</button>
      <div ref={divRef} style={{ height: '100px', width: '100px', overflowY: 'scroll' }}>
        {counted.map((c) => {
          return <p key={`c-${c}`}>{c}</p>;
        })}
      </div>
    </>
  );
};

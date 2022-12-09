/* eslint-disable no-undef */
import { Home } from '.';

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const handlers = [
  rest.get('*jsonplaceholder.typicode.com*', async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          userId: 1,
          id: 1,
          title: 'title1',
          body: 'body1',
          url: 'img1.jpg',
        },
        {
          userId: 2,
          id: 2,
          title: 'title2',
          body: 'body2',
          url: 'img2.jpg',
        },
        {
          userId: 3,
          id: 3,
          title: 'title3',
          body: 'body3',
          url: 'img3.jpg',
        },
      ]),
    );
  }),
];
const server = setupServer(...handlers);

describe('<Home />', () => {
  // Antes de qualquer teste ligar servidor
  beforeAll(() => {
    server.listen();
  });

  // Entre cada teste resetar chamado do server
  afterEach(() => server.resetHandlers());

  // Após todos os testes desligar server
  afterAll(() => {
    server.close();
  });

  it('should search, posts and load more', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('Não existem posts =(');

    // [assertions] => verifica quantidade de asserções que deve ter no código
    expect.assertions(3);
    await waitForElementToBeRemoved(noMorePosts);

    // Verifica se o input de pesquisa foi carregado
    const search = screen.getByPlaceholderText(/type your search/i);
    expect(search).toBeInTheDocument();

    // Verifica se as imagens dos posts foram carregados
    const images = screen.getAllByRole('img', { name: /title/i });
    expect(images).toHaveLength(2);

    // Verifica se o button de carregar mais posts foi carregado em tela
    const button = screen.getByRole('button', { name: /load more posts/i });
    expect(button).toBeInTheDocument();
  });

  it('should search for posts', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('Não existem posts =(');

    expect.assertions(10);
    await waitForElementToBeRemoved(noMorePosts);

    // Verifica se os componentes estão em tela
    const search = screen.getByPlaceholderText(/type your search/i);
    expect(screen.getByRole('heading', { name: 'title1 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'title2 2' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'title3 3' })).not.toBeInTheDocument();

    // Verifica se ao pesquisar apenas title1 esta visível e verifica se 'Search value: title1' esta em tela
    userEvent.type(search, 'title1');
    expect(screen.getByRole('heading', { name: 'title1 1' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'title2 2' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'title3 3' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Search value: title1' })).toBeInTheDocument();

    // Verifica se após limpar a pesquisa apenas os 2 posts de inicio retornaram a tela novamente
    userEvent.clear(search);
    expect(screen.getByRole('heading', { name: 'title1 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'title2 2' })).toBeInTheDocument();

    // Verifica se a mensagem de não existe esta visível para posts que não forem encontrados
    userEvent.type(search, 'post does not exists');
    expect(screen.getByText('Não existem posts =(')).toBeInTheDocument();
  });

  it('should load more posts', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('Não existem posts =(');

    expect.assertions(2);
    await waitForElementToBeRemoved(noMorePosts);

    // Carrega o componente do button
    const button = screen.getByRole('button', { name: /load more posts/i });

    // Realiza o click e verifica se foi carregado o post 'title 3' após o clique.
    userEvent.click(button);
    expect(screen.getByRole('heading', { name: 'title3 3' })).toBeInTheDocument();

    // Verifica se após o carregamento de todos os posts se o button ficou desativado
    expect(button).toBeDisabled();
  });
});

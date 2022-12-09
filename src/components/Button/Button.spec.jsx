import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from ".";

describe("<Button />", () => {
  it('should render the button with the text "Load more"', () => {
    render(<Button text="Load more" />);

    // Verifica quantidades inserções caso você tenha mais do que 1
    // expect.assertions(1);

    const button = screen.getByRole("button", { name: /load more/i });
    expect(button).toBeInTheDocument(); // Verifica se o elemento esta em tela
  });

  it("should call function on button click", () => {
    const fn = jest.fn(); // Mock
    render(<Button text="Load more" onClick={fn} />);

    const button = screen.getByRole("button", { name: /load more/i });

    // Realiza o efeito de click
    // fireEvent.click(button);

    userEvent.click(button);

    // Verifica se foi realizado a quantidades de clicks a partir do parâmetro
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should be disable when disabled is true", () => {
    render(<Button text="Load more" disabled={true} />);

    const button = screen.getByRole("button", { name: /load more/i });
    expect(button).toBeDisabled();
  });

  it("should be disable when disabled is false", () => {
    const fn = jest.fn();
    render(<Button text="Load more" disabled={false} onClick={fn} />);

    const button = screen.getByRole("button", { name: /load more/i });
    expect(button).toBeEnabled();
  });

  it("should match snapshot", () => {
    const fn = jest.fn();
    const { container } = render(
      <Button text="Load more" disabled={false} onClick={fn} />
    );

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toMatchSnapshot();
  });
});

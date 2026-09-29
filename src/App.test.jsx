import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

async function escribirNota(user, indice, valor) {
  const input = screen.getByLabelText(`Nota evaluación ${indice}`);
  await user.clear(input);
  await user.type(input, valor);
}

describe('App', () => {
  it('muestra el promedio y la nota necesaria con evaluaciones pendientes', async () => {
    const user = userEvent.setup();
    render(<App />);

    await escribirNota(user, 1, '4');
    await escribirNota(user, 2, '6');

    expect(screen.getByTestId('promedio')).toHaveTextContent('5');
    // (5 * 100 - 4 * 30 - 6 * 30) / 40 = 5
    expect(screen.getByTestId('necesaria')).toHaveTextContent('Necesitas un 5');
    expect(screen.queryByTestId('estado')).not.toBeInTheDocument();
  });

  it('muestra APROBADO cuando todas las notas llegan al mínimo', async () => {
    const user = userEvent.setup();
    render(<App />);

    await escribirNota(user, 1, '5');
    await escribirNota(user, 2, '6');
    await escribirNota(user, 3, '7');

    expect(screen.getByTestId('estado')).toHaveTextContent('APROBADO');
  });

  it('muestra SUSPENDIDO cuando el promedio final no llega', async () => {
    const user = userEvent.setup();
    render(<App />);

    await escribirNota(user, 1, '2');
    await escribirNota(user, 2, '3');
    await escribirNota(user, 3, '4');

    expect(screen.getByTestId('estado')).toHaveTextContent('SUSPENDIDO');
  });

  it('muestra un error con una nota fuera de rango', async () => {
    const user = userEvent.setup();
    render(<App />);

    await escribirNota(user, 1, '12');

    expect(screen.getByText(/no está entre 0 y 10/)).toBeInTheDocument();
  });

  it('permite añadir evaluaciones', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Añadir evaluación' }));

    expect(screen.getByLabelText('Nota evaluación 4')).toBeInTheDocument();
  });
});

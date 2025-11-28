import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('envía usuario y contraseña al hacer submit', async () => {
    // Arrange
    const handleSubmit = vi.fn();
    const handleUsernameChange = vi.fn();
    const handlePasswordChange = vi.fn();

    render(
      <LoginForm
        handleSubmit={handleSubmit}
        handleUsernameChange={handleUsernameChange}
        handlePasswordChange={handlePasswordChange}
        username=""
        password=""
      />
    );

    const user = userEvent.setup();

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login!/i });

    await user.type(usernameInput, 'alice');
    await user.type(passwordInput, 's3cret');
    await user.click(submitButton);

    expect(handleUsernameChange).toHaveBeenCalled();
    expect(handlePasswordChange).toHaveBeenCalled();

    // Como el componente pasa { username, password } del prop, para este test
    // podemos simular el "estado controlado" actualizando los props en un rerender.
    // Alternativamente, verificamos que el submit se llamó una vez.
    expect(handleSubmit).toHaveBeenCalledTimes(1); // submit tras click [web:17][web:6]

    // Si el componente real mantiene estado fuera, conviene renderizar un wrapper controlado.
    // Aquí demostramos una forma que asegura el payload esperado:
  });

  it('integra estado controlado y verifica el payload enviado', async () => {
    // Wrapper que controla username/password como lo haría un contenedor
    function ControlledWrapper({ onSubmit }) {
      const [username, setUsername] = React.useState('');
      const [password, setPassword] = React.useState('');

      return (
        <LoginForm
          handleSubmit={onSubmit}
          handleUsernameChange={(e) => setUsername(e.target.value)}
          handlePasswordChange={(e) => setPassword(e.target.value)}
          username={username}
          password={password}
        />
      );
    }

    const handleSubmit = vi.fn();
    render(<ControlledWrapper onSubmit={handleSubmit} />);

    const user = userEvent.setup();

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login!/i });

    await user.type(usernameInput, 'bob');
    await user.type(passwordInput, 'hunter2');
    await user.click(submitButton);

    // Ahora el payload refleja el estado controlado del wrapper
    expect(handleSubmit).toHaveBeenCalledWith({ username: 'bob', password: 'hunter2' }); // payload correcto [web:17][web:6]
  });
});

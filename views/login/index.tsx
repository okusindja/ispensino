import { useState } from 'react';

import useLogin from './hooks/useLogin';

const LoginView = () => {
  const { errorMsg, handleLogin, loading } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const data = {
    email,
    password,
  };

  return (
    <form>
      <h1>Iniciar Sessão</h1>
      <input
        name="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        name="password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errorMsg && <p>{errorMsg}</p>}
      <button onClick={() => handleLogin(data)} type="button">
        {loading ? 'A carregar...' : 'Iniciar Sessão'}
      </button>
    </form>
  );
};

export default LoginView;

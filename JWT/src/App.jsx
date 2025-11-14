import { useState } from "react";

export default function App() {
  const [email, setEmail] = useState("teste@teste.com");
  const [password, setPassword] = useState("123456");
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [privateMsg, setPrivateMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return setError(data.error || "Erro ao fazer login");

      sessionStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (err) {
      setLoading(false);
      setError("Falha de comunicação com o servidor");
    }
  }

  async function loadPrivate() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/private", {
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return setError(data.error || "Erro");

      setPrivateMsg(data.message);
    } catch (err) {
      setLoading(false);
      setError("Erro na requisição");
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Área Restrita
        </h1>

        {!token ? (
          <form className="space-y-5" onSubmit={login}>
            <div>
              <label className="text-sm text-gray-600 font-medium">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 font-medium">Senha</label>
              <input
                type="password"
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            {error && (
              <p className="text-red-600 text-center text-sm">{error}</p>
            )}
          </form>
        ) : (
          <div className="space-y-5">
            <p className="text-gray-700 text-center">
              Você está logado!  
              <br />
              <span className="text-xs text-gray-400 break-words">
                {token}
              </span>
            </p>

            <button
              onClick={loadPrivate}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
            >
              {loading ? "Carregando..." : "Acessar área privada"}
            </button>

            {privateMsg && (
              <p className="text-center text-green-600 font-medium">
                {privateMsg}
              </p>
            )}

            {error && (
              <p className="text-center text-red-600 text-sm">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

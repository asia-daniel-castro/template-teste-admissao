import { useState } from 'react';
import { Building2, LogOut } from 'lucide-react';
import logo from './assets/logo.png';
import { ReadmeDrawer } from './ReadmeDrawer';
import { TestTimer } from './TestTimer';

function Avatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
  return (
    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-semibold shrink-0">
      {initials || '?'}
    </div>
  );
}

function LoginGate({ onLogin }: { onLogin: (name: string) => void }) {
  const [name, setName] = useState('');
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) onLogin(name.trim());
        }}
        className="w-72 flex flex-col gap-3 p-6 rounded-xl border border-slate-800 bg-slate-900"
      >
        <h1 className="text-base font-semibold">Plataforma de Teste</h1>
        <p className="text-sm text-slate-400">Digite seu nome para entrar</p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          className="border border-slate-700 bg-slate-950 rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-blue-600 rounded px-4 py-2 text-sm font-medium"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="h-screen w-16 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 gap-6 shrink-0">
      <div className="relative">
        <img src={logo} alt="Logo" className="h-9 w-9 rounded-xl" />
        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
      </div>
      <nav className="flex flex-col gap-2 mt-2">
        <button
          title="Consulta CNPJ"
          className="h-10 w-10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Building2 className="h-4 w-4" />
        </button>
      </nav>
      <button
        title="Sair"
        className="mt-auto h-10 w-10 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </aside>
  );
}

function TopBar({ userName }: { userName: string }) {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/95 flex items-center justify-between px-5 shrink-0">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-6 w-6 rounded-md" />
        <span className="text-sm font-medium text-slate-300">
          Plataforma de Teste
        </span>
      </div>
      <TestTimer />
      <div className="flex items-center gap-2">
        <Avatar name={userName} />
        <span className="text-sm font-medium text-slate-200">{userName}</span>
      </div>
    </header>
  );
}

export default function App() {
  const [userName, setUserName] = useState<string | null>(null);
  const [cnpj, setCnpj] = useState('');

  if (!userName) return <LoginGate onLogin={setUserName} />;

  return (
    <div className="h-screen w-full flex bg-slate-950 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar userName={userName} />
        <main className="flex-1 overflow-y-auto p-8 pb-14">
          <h1 className="text-xl font-bold mb-4">Consulta de Empresa (CNPJ)</h1>
          <div className="flex gap-2 mb-8">
            <input
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0000-00"
              className="border border-slate-700 bg-slate-900 rounded px-3 py-2 w-64"
            />
            <button className="bg-blue-600 rounded px-4 py-2">Buscar</button>
          </div>
          {/* TODO candidato: renderizar aqui o resultado, reproduzindo o layout do print */}
        </main>
      </div>
      <ReadmeDrawer />
    </div>
  );
}

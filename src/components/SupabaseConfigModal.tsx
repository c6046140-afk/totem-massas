import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Check, 
  Copy, 
  Terminal, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { 
  getStoredSupabaseCredentials, 
  saveSupabaseCredentials, 
  testSupabaseConnection, 
  getSupabaseSqlSchema 
} from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    hasTable: boolean;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getStoredSupabaseCredentials();
      setUrl(creds.url);
      setAnonKey(creds.anonKey);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    setIsTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection(url, anonKey);
    setTestResult(result);
    setIsTesting(false);

    if (result.success) {
      saveSupabaseCredentials(url, anonKey);
      onConfigUpdated();
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(getSupabaseSqlSchema());
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleClear = () => {
    saveSupabaseCredentials('', '');
    setUrl('');
    setAnonKey('');
    setTestResult(null);
    onConfigUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl text-stone-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-white">
                Integração Banco de Dados Supabase
              </h2>
              <p className="text-xs text-stone-400">
                Conecte seu projeto Supabase para armazenar pedidos em tempo real
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Status Alert */}
          {testResult && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/40 border-red-500/40 text-red-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-bold block">
                  {testResult.success ? 'Conexão Estabelecida!' : 'Falha na Conexão'}
                </span>
                <p className="text-xs leading-relaxed opacity-90">
                  {testResult.message}
                </p>
              </div>
            </div>
          )}

          {/* Form Inputs */}
          <div className="space-y-4 bg-stone-950 p-5 rounded-2xl border border-stone-800/80">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Disponível no painel do Supabase em Project Settings &gt; API
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Supabase Anon (Public) Key
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Chave anônima pública (anon key) do seu projeto
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-stone-500 hover:text-stone-300 underline cursor-pointer"
              >
                Limpar / Usar Modo Local
              </button>

              <button
                type="button"
                disabled={isTesting || !url.trim() || !anonKey.trim()}
                onClick={handleTestAndSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Testando Conexão...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Testar & Conectar Supabase</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SQL Setup Script Helper */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">
                  Script SQL para Criar a Tabela no Supabase
                </h4>
              </div>

              <button
                type="button"
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copiar SQL</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Cole este comando no <strong>SQL Editor</strong> do seu Supabase para criar a tabela de pedidos com as políticas públicas adequadas para o totem:
            </p>

            <pre className="p-4 bg-stone-950 rounded-2xl border border-stone-800 font-mono text-[11px] text-stone-300 overflow-x-auto max-h-48 leading-relaxed scrollbar-thin">
              {getSupabaseSqlSchema()}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { PaymentMethod } from '../types/restaurant';
import { 
  X, 
  QrCode, 
  CreditCard, 
  Store, 
  Copy, 
  Check, 
  Smartphone, 
  ShieldCheck, 
  Loader2,
  Wifi,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  total: number;
  customerName: string;
  onClose: () => void;
  onPaymentSuccess: (method: PaymentMethod) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  total,
  customerName,
  onClose,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [cardStep, setCardStep] = useState<'idle' | 'approaching' | 'authorizing'>('idle');

  // Simulated dynamic Pix Payload string
  const pixCode = `00020126580014BR.GOV.BCB.PIX0136nonnamia-trattoria-pagamentos@pix.com.br520400005303986540${total.toFixed(2)}5802BR5920NONNA MIA TRATTORIA6009SAO PAULO62070503***6304D1B8`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  // Play a pleasant Web Audio confirmation chime
  const playSuccessSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // AudioContext fallback
    }
  };

  // Trigger confetti burst
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#059669', '#d97706', '#dc2626', '#ffffff']
    });
  };

  const handleProcessPixPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      playSuccessSound();
      triggerConfetti();
      onPaymentSuccess('pix');
    }, 1500);
  };

  const handleProcessCardPayment = (cardType: 'credit_card' | 'debit_card') => {
    setSelectedMethod(cardType);
    setCardStep('approaching');
    setTimeout(() => {
      setCardStep('authorizing');
      setTimeout(() => {
        playSuccessSound();
        triggerConfetti();
        onPaymentSuccess(cardType);
      }, 1400);
    }, 1600);
  };

  const handleProcessCounterPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      playSuccessSound();
      triggerConfetti();
      onPaymentSuccess('counter');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-stone-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                Autoatendimento • Pagamento
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold font-serif text-white mt-0.5">
              Finalizar & Pagar
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing || cardStep !== 'idle'}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Highlight */}
        <div className="p-5 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-stone-800/80 text-center">
          <span className="text-xs text-stone-400 uppercase tracking-widest font-semibold block">
            Valor do Pedido de {customerName || 'Cliente'}
          </span>
          <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight mt-1">
            R$ {total.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center justify-center gap-1 mt-1">
            <Sparkles className="w-3.5 h-3.5" />
            O número do seu pedido será gerado imediatamente após a confirmação
          </span>
        </div>

        {/* Payment Methods Tabs */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { setSelectedMethod('pix'); setCardStep('idle'); }}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                selectedMethod === 'pix'
                  ? 'bg-amber-600/20 border-amber-500 text-amber-200 shadow-md'
                  : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <QrCode className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold">PIX Instantâneo</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedMethod('credit_card'); setCardStep('idle'); }}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                selectedMethod === 'credit_card' || selectedMethod === 'debit_card'
                  ? 'bg-amber-600/20 border-amber-500 text-amber-200 shadow-md'
                  : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold">Cartão (Totem)</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedMethod('counter'); setCardStep('idle'); }}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                selectedMethod === 'counter'
                  ? 'bg-amber-600/20 border-amber-500 text-amber-200 shadow-md'
                  : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Store className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold">No Balcão</span>
            </button>
          </div>

          {/* TAB 1: PIX */}
          {selectedMethod === 'pix' && (
            <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-white rounded-2xl shadow-xl">
                {/* Dynamically generated SVG-like QR Code representation with high detail */}
                <div className="w-44 h-44 bg-white flex flex-col items-center justify-center p-2 relative">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixCode)}&margin=4`}
                    alt="QR Code Pix"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-stone-200">
                  Abra o app do seu banco e aponte a câmera para o QR Code
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Aprovação automática em poucos segundos
                </p>
              </div>

              {/* Copy Paste Code */}
              <button
                type="button"
                onClick={handleCopyPix}
                className="w-full max-w-xs flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-xs font-semibold text-stone-300 transition-colors cursor-pointer"
              >
                {copiedPix ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Código PIX Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Copiar Código Copia e Cola</span>
                  </>
                )}
              </button>

              {/* Confirm / Simulate Kiosk Hook */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessPixPayment}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando recebimento no Banco Central...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Simular Pagamento PIX Aprovado</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: CARTÃO NA MAQUININHA */}
          {(selectedMethod === 'credit_card' || selectedMethod === 'debit_card') && (
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 text-center space-y-5">
              {cardStep === 'idle' && (
                <>
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Wifi className="w-8 h-8 rotate-90" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Maquininha de Cartão Integrada
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                      Aceitamos Crédito, Débito e Pagamento por Aproximação (Apple Pay, Google Pay).
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleProcessCardPayment('credit_card')}
                      className="py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pagar no Crédito</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProcessCardPayment('debit_card')}
                      className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs uppercase tracking-wider border border-stone-700 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pagar no Débito</span>
                    </button>
                  </div>
                </>
              )}

              {cardStep === 'approaching' && (
                <div className="py-8 space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-300 animate-pulse">
                    <Smartphone className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-amber-200">
                      Aproxime ou Insira o Cartão...
                    </h4>
                    <p className="text-xs text-stone-400">
                      Siga as instruções na tela da maquininha ao lado
                    </p>
                  </div>
                </div>
              )}

              {cardStep === 'authorizing' && (
                <div className="py-8 space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-300">
                    <Loader2 className="w-10 h-10 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-emerald-300">
                      Autorizando Transação...
                    </h4>
                    <p className="text-xs text-stone-400">
                      Comunicando com a operadora
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAGAMENTO NO BALCÃO */}
          {selectedMethod === 'counter' && (
            <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Store className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Pagar no Caixa / Balcão
                </h3>
                <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                  Seu pedido será enviado para a cozinha imediatamente. Você pode pagar em dinheiro, vale-refeição ou cartão no caixa ao retirar.
                </p>
              </div>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessCounterPayment}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg shadow-amber-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Emitindo Comanda...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Confirmar Pedido & Gerar Número</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

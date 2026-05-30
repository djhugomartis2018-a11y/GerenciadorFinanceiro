import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Parcelamento } from '../../App';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';

interface ParcelamentosPageProps {
  parcelamentos: Parcelamento[];
  onAdd: (p: Omit<Parcelamento, 'id'>) => void;
  onPagar: (id: string) => void;
  onDesfazer: (id: string) => void;
  onDelete: (id: string) => void;
}

function NovoParcelamentoModal({ onSave, onClose }: { onSave: (p: Omit<Parcelamento, 'id'>) => void; onClose: () => void }) {
  const [desc, setDesc] = useState('');
  const [valorParcela, setValorParcela] = useState('');
  const [totalParcelas, setTotalParcelas] = useState('');
  const [parcelasPagas, setParcelasPagas] = useState('0');

  function handleSave() {
    if (!desc.trim()) { toast.error('Informe a descrição'); return; }
    const vp = parseFloat(valorParcela);
    const tp = parseInt(totalParcelas);
    const pp = parseInt(parcelasPagas);
    if (!vp || vp <= 0) { toast.error('Informe o valor da parcela'); return; }
    if (!tp || tp <= 0) { toast.error('Informe o total de parcelas'); return; }
    if (pp < 0 || pp > tp) { toast.error('Parcelas pagas inválidas'); return; }
    onSave({ desc: desc.trim(), valorParcela: vp, totalParcelas: tp, parcelasPagas: pp });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-2xl p-8 max-w-sm w-full mx-4 space-y-5">
        <h3 className="text-lg font-black">Novo Parcelamento</h3>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-dim uppercase tracking-wider">Descrição</label>
            <input
              type="text"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Ex: iPhone 15, TV Samsung..."
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-dim uppercase tracking-wider">Valor/parcela (R$)</label>
              <input
                type="number"
                value={valorParcela}
                onChange={e => setValorParcela(e.target.value)}
                placeholder="Ex: 100"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-dim uppercase tracking-wider">Total de parcelas</label>
              <input
                type="number"
                value={totalParcelas}
                onChange={e => setTotalParcelas(e.target.value)}
                placeholder="Ex: 12"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-dim uppercase tracking-wider">Parcelas já pagas</label>
            <input
              type="number"
              value={parcelasPagas}
              onChange={e => setParcelasPagas(e.target.value)}
              placeholder="0"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
            />
            <p className="text-[10px] text-text-dim">Preencha se o parcelamento já começou</p>
          </div>

          {valorParcela && totalParcelas && (
            <div className="bg-background border border-border rounded-xl p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-text-dim">Valor total</span>
                <span className="font-bold">R$ {(parseFloat(valorParcela || '0') * parseInt(totalParcelas || '0')).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">Valor restante</span>
                <span className="font-bold text-accent-purple">R$ {(parseFloat(valorParcela || '0') * (parseInt(totalParcelas || '0') - parseInt(parcelasPagas || '0'))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleSave} className="w-full bg-accent-purple text-white hover:bg-accent-purple/90 font-bold">
            Salvar Parcelamento
          </Button>
          <Button onClick={onClose} variant="outline" className="w-full border-border">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

const fmt = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function ParcelamentoCard({ p, onPagar, onDesfazer, onDelete }: {
  p: Parcelamento;
  onPagar: () => void;
  onDesfazer: () => void;
  onDelete: () => void;
}) {
  const perc = (p.parcelasPagas / p.totalParcelas) * 100;
  const restantes = p.totalParcelas - p.parcelasPagas;
  const valorTotal = p.valorParcela * p.totalParcelas;
  const valorRestante = p.valorParcela * restantes;
  const quitado = p.parcelasPagas >= p.totalParcelas;

  const barColor = quitado
    ? 'bg-green-500'
    : perc >= 80
    ? 'bg-accent-purple'
    : perc >= 50
    ? 'bg-blue-400'
    : 'bg-red-400';

  return (
    <Card className={`bg-surface border-border transition-all ${quitado ? 'opacity-60' : 'hover:border-accent-purple/30'}`}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm">{p.desc}</p>
              {quitado && (
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
                  Quitado
                </span>
              )}
            </div>
            <p className="text-xs text-text-dim mt-0.5">
              {fmt(p.valorParcela)}/mês · Total {fmt(valorTotal)}
            </p>
          </div>
          <button
            onClick={() => { if (confirm(`Excluir "${p.desc}"?`)) onDelete(); }}
            className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 size={14} className="text-red-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-black">
            <span className="text-text-dim uppercase tracking-widest">Progresso</span>
            <span className={quitado ? 'text-green-400' : 'text-accent-purple'}>
              {p.parcelasPagas}/{p.totalParcelas} parcelas
            </span>
          </div>
          <div className="h-3 bg-background rounded-full overflow-hidden border border-border">
            <div
              className={`h-full ${barColor} transition-all duration-700 rounded-full shadow-sm`}
              style={{ width: `${Math.min(perc, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-text-dim">
            <span>{perc.toFixed(0)}% pago</span>
            {!quitado && <span>Faltam {fmt(valorRestante)} ({restantes}x)</span>}
            {quitado && <span className="text-green-400">Parcelamento concluído!</span>}
          </div>
        </div>

        {/* Actions */}
        {!quitado && (
          <div className="flex gap-2">
            <Button
              onClick={onPagar}
              size="sm"
              className="flex-1 bg-accent-purple text-white hover:bg-accent-purple/90 font-bold text-xs h-8"
            >
              ✓ Pagar parcela {p.parcelasPagas + 1}
            </Button>
            {p.parcelasPagas > 0 && (
              <Button
                onClick={onDesfazer}
                size="sm"
                variant="outline"
                className="border-border text-xs h-8 px-3"
              >
                Desfazer
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ParcelamentosPage({ parcelamentos, onAdd, onPagar, onDesfazer, onDelete }: ParcelamentosPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [showQuitados, setShowQuitados] = useState(false);

  const ativos = parcelamentos.filter(p => p.parcelasPagas < p.totalParcelas);
  const quitados = parcelamentos.filter(p => p.parcelasPagas >= p.totalParcelas);
  const totalMensal = ativos.reduce((s, p) => s + p.valorParcela, 0);
  const totalRestante = ativos.reduce((s, p) => s + p.valorParcela * (p.totalParcelas - p.parcelasPagas), 0);

  function handleAdd(p: Omit<Parcelamento, 'id'>) {
    onAdd(p);
    toast.success('Parcelamento adicionado!');
  }

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Parcelamentos</h2>
          <p className="text-sm text-text-dim mt-1">Acompanhe suas compras parceladas</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-accent-purple text-white hover:bg-accent-purple/90 font-bold shadow-[0_0_15px_rgba(124,58,237,0.3)]"
        >
          <Plus size={18} className="mr-2" /> Novo Parcelamento
        </Button>
      </div>

      {/* Summary cards */}
      {ativos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-surface border-border">
            <CardContent className="p-5">
              <p className="text-[10px] font-black text-text-dark uppercase tracking-widest mb-1">Gasto Mensal</p>
              <p className="text-2xl font-black text-red-400">{fmt(totalMensal)}</p>
              <p className="text-[10px] text-text-dim mt-1">em parcelas este mês</p>
            </CardContent>
          </Card>
          <Card className="bg-surface border-border">
            <CardContent className="p-5">
              <p className="text-[10px] font-black text-text-dark uppercase tracking-widest mb-1">Total Restante</p>
              <p className="text-2xl font-black text-accent-purple">{fmt(totalRestante)}</p>
              <p className="text-[10px] text-text-dim mt-1">a pagar no total</p>
            </CardContent>
          </Card>
          <Card className="bg-surface border-border">
            <CardContent className="p-5">
              <p className="text-[10px] font-black text-text-dark uppercase tracking-widest mb-1">Ativos</p>
              <p className="text-2xl font-black">{ativos.length}</p>
              <p className="text-[10px] text-text-dim mt-1">parcelamentos em aberto</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active installments */}
      {ativos.length === 0 && quitados.length === 0 && (
        <div className="text-center py-16 text-text-dim space-y-3">
          <p className="text-4xl">📦</p>
          <p className="font-bold">Nenhum parcelamento cadastrado</p>
          <p className="text-sm">Adicione suas compras parceladas para acompanhar o progresso.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ativos.map(p => (
          <ParcelamentoCard
            key={p.id}
            p={p}
            onPagar={() => onPagar(p.id)}
            onDesfazer={() => onDesfazer(p.id)}
            onDelete={() => onDelete(p.id)}
          />
        ))}
      </div>

      {/* Completed installments */}
      {quitados.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setShowQuitados(!showQuitados)}
            className="flex items-center gap-2 text-sm font-bold text-text-dim hover:text-foreground transition-colors"
          >
            {showQuitados ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            Quitados ({quitados.length})
          </button>
          {showQuitados && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quitados.map(p => (
                <ParcelamentoCard
                  key={p.id}
                  p={p}
                  onPagar={() => {}}
                  onDesfazer={() => onDesfazer(p.id)}
                  onDelete={() => onDelete(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {showForm && (
        <NovoParcelamentoModal onSave={handleAdd} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

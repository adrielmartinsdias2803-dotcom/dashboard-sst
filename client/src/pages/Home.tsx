import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp,
  Target,
  Zap,
  Shield,
  ExternalLink,
  Users,
  Calendar,
  CheckCheck,
  Loader2,
  RefreshCw,
  ArrowRight,
  Flame,
  FileText
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SSTMetrics {
  totalRiscos: number;
  riscosAltos: number;
  riscosMedias: number;
  riscosCriticos: number;
  acoesConcluidas: number;
}

interface SyncStatus {
  lastSync: string | null;
  status: 'idle' | 'syncing' | 'success' | 'error';
}

export default function Home() {
  const [metrics, setMetrics] = useState<SSTMetrics>({
    totalRiscos: 0,
    riscosAltos: 0,
    riscosMedias: 0,
    riscosCriticos: 0,
    acoesConcluidas: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: 'Carregando...',
    status: 'idle'
  });

  // Buscar métricas reais do banco de dados
  const { data: metricsData } = trpc.sst.getMetrics.useQuery(undefined, {
    refetchInterval: 30000, // Refetch a cada 30 segundos
  });

  const { data: syncData } = trpc.sst.getSyncStatus.useQuery(undefined, {
    refetchInterval: 60000, // Refetch every minute
  });

  useEffect(() => {
    if (metricsData) {
      setMetrics({
        totalRiscos: metricsData.totalRiscos || 0,
        riscosAltos: metricsData.riscosAltos || 0,
        riscosMedias: metricsData.riscosMedias || 0,
        riscosCriticos: metricsData.riscosCriticos || 0,
        acoesConcluidas: metricsData.acoesConcluidas || 0,
      });
    }
  }, [metricsData]);

  useEffect(() => {
    if (syncData) {
      setSyncStatus({
        lastSync: syncData.lastSync,
        status: syncData.status as 'idle' | 'syncing' | 'success' | 'error'
      });
    }
  }, [syncData]);

  // Dados de tendência mensal (últimos 6 meses)
  const trendData = [
    { mes: "Ago", critico: 2, alto: 250, medio: 240, baixo: 245 },
    { mes: "Set", critico: 2, alto: 260, medio: 245, baixo: 240 },
    { mes: "Out", critico: 2, alto: 270, medio: 250, baixo: 235 },
    { mes: "Nov", critico: 3, alto: 275, medio: 252, baixo: 230 },
    { mes: "Dez", critico: 3, alto: 276, medio: 251, baixo: 225 },
    { mes: "Jan", critico: 3, alto: 276, medio: 251, baixo: 220 },
  ];

  const forceSyncMutation = trpc.sst.forceSyncNow.useMutation({
    onSuccess: (data) => {
      setIsSyncing(false);
      if (data.success) {
        toast.success("Sincronização iniciada com sucesso!");
        // Refetch sync status
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      setIsSyncing(false);
      toast.error("Erro ao sincronizar: " + error.message);
    },
  });

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      await forceSyncMutation.mutateAsync();
    } catch (error) {
      setIsSyncing(false);
    }
  };

  const handleAgendarRota = () => {
    window.location.href = '/agendar-rota';
  };

  const handlePowerBIAccess = () => {
    const powerbiUrl = "https://app.powerbi.com/groups/me/reports/5a087ca6-f606-4cb2-af76-6a3ca94a08c2/868e18c05a0d8320c33c?ctid=57a79bba-3c38-4dc9-b884-b899495e3e9c&experience=power-bi";
    try {
      window.open(powerbiUrl, "_blank");
      toast.success("Abrindo Dashboard PowerBI...");
    } catch (error) {
      toast.error("Não foi possível abrir o link. Tente copiar e colar manualmente no navegador.");
      navigator.clipboard.writeText(powerbiUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header Premium */}
      <header className="relative overflow-hidden bg-gradient-to-r from-primary via-blue-700 to-primary/90 text-white py-12 px-4 md:px-8 shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
              <img src="/images/mococa-logo.png" alt="Mococa" className="h-20 md:h-24 relative" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight">RELATÓRIO SEGURANÇA DO TRABALHO</h1>
              <p className="text-blue-100 text-sm md:text-base mt-2 font-light">Gestão Integrada de Saúde e Segurança do Trabalho</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-blue-100 text-sm font-light">Última Sincronização</p>
            <div className="flex items-center justify-end gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${
                syncStatus.status === 'success' ? 'bg-green-400 animate-pulse' :
                syncStatus.status === 'syncing' ? 'bg-yellow-400 animate-pulse' :
                syncStatus.status === 'error' ? 'bg-red-400' :
                'bg-gray-400'
              }`}></div>
              <p className="font-display text-sm font-semibold">{syncStatus.lastSync || 'Carregando...'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        
        {/* Ações Rápidas - Premium Card */}
        <div className="mb-16 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-primary/10 to-yellow-50 px-8 py-6 border-b border-slate-100">
            <h3 className="text-2xl font-display font-bold text-primary flex items-center gap-3">
              <Zap className="h-6 w-6 text-yellow-500" />
              Ações Rápidas
            </h3>
            <p className="text-slate-600 text-sm mt-1">Acesse ferramentas essenciais de gestão</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
              <Button 
                onClick={handleForceSync}
                disabled={isSyncing}
                className="flex flex-col items-center justify-center gap-2 px-4 py-4 bg-gradient-to-br from-primary to-blue-700 hover:from-primary/90 hover:to-blue-700/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg font-semibold text-sm h-auto whitespace-normal disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sincronizando...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5" />
                    <span>Sincronização</span>
                  </>
                )}
              </Button>
              <button
                onClick={handleAgendarRota}
                className="flex flex-col items-center justify-center gap-2 px-4 py-4 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 h-auto whitespace-normal cursor-pointer"
                title="Agendar uma nova rota de segurança"
              >
                <Calendar className="h-5 w-5" />
                <span>Agendar Rota</span>
              </button>
              <button
                onClick={handlePowerBIAccess}
                className="flex flex-col items-center justify-center gap-2 px-4 py-4 bg-gradient-to-br from-primary to-blue-700 hover:from-primary/90 hover:to-blue-700/90 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 h-auto whitespace-normal cursor-pointer"
                title="Abrir Dashboard PowerBI em nova aba"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                </svg>
                <span>Dashboard PowerBI</span>
              </button>
              <button
                onClick={() => window.location.href = '/admin/dashboard'}
                className="flex flex-col items-center justify-center gap-2 px-4 py-4 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 h-auto whitespace-normal cursor-pointer"
                title="Acessar Painel de Segurança do Trabalho"
              >
                <span className="text-lg">🔐</span>
                <span>Segurança do Trabalho</span>
              </button>
              <button
                onClick={() => window.location.href = '/painel-rotas'}
                className="flex flex-col items-center justify-center gap-2 px-4 py-4 bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 h-auto whitespace-normal cursor-pointer"
                title="Acessar Painel de Controle de Rotas"
              >
                <span className="text-lg">📋</span>
                <span>Painel de Rotas</span>
              </button>
            </div>
            <button
              onClick={() => {
                const url = 'https://mococa.sharepoint.com/:x:/s/msteams_6115f4_553804/IQAC1WtO39XDR6XhDrcEMBqNAaEW-EuEv7JV7Io_fYzQaxs?email=sandy.nascimento%40mococa.com.br&e=BlyQSz';
                window.open(url, '_blank');
              }}
              className="w-full flex flex-col items-center justify-center gap-2 px-4 py-4 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 h-auto whitespace-normal cursor-pointer"
              title="Acessar Planilha Condição de Risco"
            >
              <FileText className="h-5 w-5" />
              <span>Planilha Condição de Risco</span>
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-display font-bold text-primary">Resumo Executivo</h2>
          </div>
          
          <Card className="border-0 shadow-xl bg-white overflow-hidden">
            <CardContent className="p-8">
              <div className="border-l-4 border-yellow-500 pl-6 py-4 bg-gradient-to-r from-yellow-50 to-transparent rounded-r-lg">
                <p className="text-slate-700 leading-relaxed mb-4">
                  A análise da planilha de Gestão SST revelou um <span className="font-bold text-primary">panorama crítico que demanda ação imediata</span>. Foram identificados <span className="font-display font-bold text-lg text-primary">737 registros</span> de condições de risco e acidentes, com uma concentração preocupante de <span className="font-bold text-red-600">71,5%</span> classificados como Alto ou Médio risco.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Embora o sistema de gestão demonstre maturidade na identificação de riscos, o alto percentual de ações não iniciadas <span className="font-bold text-red-600">(52,9%)</span> e a distribuição desigual de responsabilidades indicam a necessidade urgente de reforço operacional e investimentos estruturais significativos.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Indicadores Principais */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-display font-bold text-primary">Indicadores Principais</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Total de Riscos */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <Badge className="bg-blue-600">Total</Badge>
                </div>
                <p className="text-slate-600 text-sm font-medium mb-2">Total de Riscos</p>
                <p className="text-4xl font-display font-bold text-primary">{metrics.totalRiscos}</p>
                <p className="text-xs text-slate-500 mt-3">Registros identificados</p>
              </CardContent>
            </Card>

            {/* Riscos Críticos */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-red-50 to-red-100 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Flame className="h-8 w-8 text-red-600" />
                  <Badge className="bg-red-600">Crítico</Badge>
                </div>
                <p className="text-slate-600 text-sm font-medium mb-2">Riscos Críticos</p>
                <p className="text-4xl font-display font-bold text-red-600">{metrics.riscosCriticos}</p>
                <p className="text-xs text-slate-500 mt-3">Ação imediata necessária</p>
              </CardContent>
            </Card>

            {/* Riscos Altos */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <Badge className="bg-orange-600">Alto</Badge>
                </div>
                <p className="text-slate-600 text-sm font-medium mb-2">Riscos Altos</p>
                <p className="text-4xl font-display font-bold text-orange-600">{metrics.riscosAltos}</p>
                <p className="text-xs text-slate-500 mt-3">{((metrics.riscosAltos / metrics.totalRiscos) * 100).toFixed(1)}% do total</p>
              </CardContent>
            </Card>

            {/* Riscos Médios */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="h-8 w-8 text-yellow-600" />
                  <Badge className="bg-yellow-600">Médio</Badge>
                </div>
                <p className="text-slate-600 text-sm font-medium mb-2">Riscos Médios</p>
                <p className="text-4xl font-display font-bold text-yellow-600">{metrics.riscosMedias}</p>
                <p className="text-xs text-slate-500 mt-3">{((metrics.riscosMedias / metrics.totalRiscos) * 100).toFixed(1)}% do total</p>
              </CardContent>
            </Card>

            {/* Ações Concluídas */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <Badge className="bg-green-600">Concluído</Badge>
                </div>
                <p className="text-slate-600 text-sm font-medium mb-2">Ações Concluídas</p>
                <p className="text-4xl font-display font-bold text-green-600">{metrics.acoesConcluidas}</p>
                <p className="text-xs text-slate-500 mt-3">Taxa: {((metrics.acoesConcluidas / (metrics.acoesConcluidas + 390)) * 100).toFixed(1)}%</p>
              </CardContent>
            </Card>
          </div>
        </section>

           {/* Legenda – Classificação de Risco */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-display font-bold text-primary">Legenda – Classificação de Risco | Segurança do Trabalho</h2>
          </div>

          <div className="space-y-6 mb-12">
            {/* Risco Baixo */}
            <Card className="border-l-4 border-l-green-600 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">🟢</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-green-700 mb-3">Risco Baixo</h3>
                    <p className="text-slate-700 mb-3"><span className="font-semibold">Condição segura.</span> Perigos identificados estão controlados. Atividade pode ser executada conforme procedimentos e uso básico de EPI.</p>
                    <p className="text-xs text-slate-600 italic border-t border-green-200 pt-3"><span className="font-semibold">Versão resumida:</span> Condição segura</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risco Médio */}
            <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-br from-yellow-50 to-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">🟡</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-yellow-700 mb-3">Risco Médio</h3>
                    <p className="text-slate-700 mb-3"><span className="font-semibold">Condição de atenção.</span> Perigos presentes com potencial de causar acidentes leves ou moderados. Exige reforço de medidas preventivas, orientação e uso adequado de EPI.</p>
                    <p className="text-xs text-slate-600 italic border-t border-yellow-200 pt-3"><span className="font-semibold">Versão resumida:</span> Atenção / Risco controlável</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risco Alto */}
            <Card className="border-l-4 border-l-orange-600 bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">🟠</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-orange-700 mb-3">Risco Alto</h3>
                    <p className="text-slate-700 mb-3"><span className="font-semibold">Condição perigosa.</span> Elevada probabilidade de acidente grave ou doença ocupacional. Necessária adoção imediata de medidas de controle, supervisão constante e, se aplicável, revisão do método de trabalho.</p>
                    <p className="text-xs text-slate-600 italic border-t border-orange-200 pt-3"><span className="font-semibold">Versão resumida:</span> Perigo significativo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risco Crítico */}
            <Card className="border-l-4 border-l-red-600 bg-gradient-to-br from-red-50 to-white hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">🔴</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-red-700 mb-3">Risco Crítico</h3>
                    <p className="text-slate-700 mb-3"><span className="font-semibold">Condição extremamente perigosa.</span> Risco iminente à vida ou à integridade física. Atividade deve ser interrompida imediatamente até a eliminação ou controle do risco.</p>
                    <p className="text-xs text-slate-600 italic border-t border-red-200 pt-3"><span className="font-semibold">Versão resumida:</span> Interdição imediata</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nota sobre versão resumida */}
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-slate-700"><span className="font-semibold text-blue-700">📋 Versão Resumida:</span> As versões resumidas acima são utilizadas em mapas de risco e sinalização para comunicação rápida e clara do nível de risco em cada área.</p>
          </div>
        </section>

        {/* Gráfico de Tendência de Riscos */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-display font-bold text-primary">Evolução de Riscos (Últimos 6 Meses)</h2>
          </div>

          <Card className="border-0 shadow-lg bg-white overflow-hidden">
            <CardContent className="p-8">
              <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="mes" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                      labelStyle={{ color: "#f1f5f9" }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="critico" 
                      stroke="#dc2626" 
                      strokeWidth={3}
                      name="Crítico"
                      dot={{ fill: "#dc2626", r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="alto" 
                      stroke="#ea580c" 
                      strokeWidth={3}
                      name="Alto"
                      dot={{ fill: "#ea580c", r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="medio" 
                      stroke="#eab308" 
                      strokeWidth={3}
                      name="Médio"
                      dot={{ fill: "#eab308", r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="baixo" 
                      stroke="#16a34a" 
                      strokeWidth={3}
                      name="Baixo"
                      dot={{ fill: "#16a34a", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-700"><span className="font-semibold">Observação:</span> O gráfico mostra a tendência de riscos nos últimos 6 meses. Note que riscos críticos aumentaram de 2 para 3 em novembro, indicando necessidade de ação imediata.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cenário Atual */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-display font-bold text-primary">O que Está Acontecendo</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Flame className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Concentração de Riscos Altos</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      71,5% dos riscos são classificados como Alto ou Médio, indicando um cenário crítico que demanda ações imediatas e reforço significativo nas operações.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Ações Não Iniciadas</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      52,9% das ações corretivas ainda estão no status "A iniciar", revelando um gargalo crítico na execução e implementação das medidas de segurança.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Distribuição Desigual</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      As áreas de Xarope e SPX concentram a maioria dos riscos, indicando necessidade de reforço específico e investimentos direcionados nessas regiões.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Falta de Investimento</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      A distribuição desigual de responsabilidades indica necessidade de investimentos estruturais significativos e reforço operacional em toda a organização.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Melhorias Necessárias */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <ArrowRight className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-display font-bold text-primary">Melhorias Necessárias</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Priorização Estratégica de Ações",
                description: "Implementar sistema de priorização baseado em risco, focando nas 52,9% de ações não iniciadas, especialmente nas áreas críticas (Xarope e SPX)."
              },
              {
                title: "Reforço de Manutenção Preventiva",
                description: "Aumentar investimentos em manutenção preventiva para reduzir riscos altos e críticos, com foco em equipamentos e processos de alto risco."
              },
              {
                title: "Foco em Áreas Críticas",
                description: "Direcionar recursos e atenção especial para as áreas de Xarope e SPX, que concentram a maioria dos riscos identificados."
              },
              {
                title: "Investimento em Infraestrutura",
                description: "Realizar investimentos estruturais significativos em infraestrutura de segurança, equipamentos de proteção e sistemas de controle."
              },
              {
                title: "Gestão Eficiente de Prazos",
                description: "Implementar sistema de acompanhamento de prazos com alertas automáticos para garantir cumprimento das ações corretivas dentro do cronograma."
              }
            ].map((item, idx) => (
              <Card key={idx} className="border-0 shadow-lg bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg min-w-fit">
                      <CheckCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Processo de Rotas de Segurança - Versão Corporativa */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-display font-bold text-primary">Processo de Rotas de Segurança</h2>
          </div>
          
          <p className="text-slate-600 text-lg mb-12 max-w-4xl">As rotas de segurança são inspeções sistemáticas realizadas nos setores da Mococa para identificar, avaliar e controlar condições de risco. O processo segue uma metodologia estruturada em cinco etapas sequenciais, garantindo a participação de múltiplos stakeholders e a implementação efetiva de ações corretivas.</p>

          {/* Fluxo 4: Cadastro da Rota */}
          <div className="mb-12">
            <Card className="border-l-4 border-l-blue-600 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="text-5xl">📋</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-block bg-blue-600 text-white font-bold px-4 py-2 rounded-full text-sm">Fluxo 4</span>
                      <h3 className="text-2xl font-bold text-blue-700">Cadastro da Rota (Agendamento)</h3>
                    </div>
                    <p className="text-slate-700 mb-4 leading-relaxed">O cadastro da rota representa o ponto de partida do processo de inspeção de segurança. Nesta etapa, define-se o setor a ser inspecionado, agendando-se a rota dentro de um prazo estabelecido pela organização.</p>
                    <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                      <p className="font-semibold text-slate-800 mb-3">Participantes Obrigatórios:</p>
                      <ul className="space-y-2 text-slate-700">
                        <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">•</span> <span className="font-medium">Técnico de Segurança do Trabalho</span> - Responsável pela coordenação e documentação</li>
                        <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">•</span> <span className="font-medium">Representante da Manutenção</span> - Conhecimento técnico de equipamentos</li>
                        <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">•</span> <span className="font-medium">Representante da Produção</span> - Conhecimento das operações e riscos do dia a dia</li>
                      </ul>
                    </div>
                    <p className="text-slate-600 text-sm italic"><span className="font-semibold">Prazo de Agendamento:</span> A rota deve ser agendada com antecedência de até 45 dias (1 mês e meio), permitindo planejamento adequado e confirmação de participantes.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fluxo 5: Rota em Campo */}
          <div className="mb-12">
            <Card className="border-l-4 border-l-orange-600 bg-gradient-to-br from-orange-50 to-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="text-5xl">🔍</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-block bg-orange-600 text-white font-bold px-4 py-2 rounded-full text-sm">Fluxo 5</span>
                      <h3 className="text-2xl font-bold text-orange-700">Rota em Campo (Identificação de Riscos)</h3>
                    </div>
                    <p className="text-slate-700 mb-4 leading-relaxed">Durante a rota em campo, a equipe multidisciplinar percorre o setor definido, realizando uma inspeção minuciosa e sistemática de todas as áreas, máquinas, processos e condições ambientais.</p>
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <p className="font-semibold text-slate-800 mb-3">Atividades Realizadas:</p>
                      <ul className="space-y-2 text-slate-700">
                        <li className="flex items-center gap-2"><span className="text-orange-600 font-bold">✓</span> Identificação de todas as condições de risco existentes</li>
                        <li className="flex items-center gap-2"><span className="text-orange-600 font-bold">✓</span> Registro fotográfico e documental das situações encontradas</li>
                        <li className="flex items-center gap-2"><span className="text-orange-600 font-bold">✓</span> Classificação preliminar dos riscos (Crítico, Alto, Médio, Baixo)</li>
                        <li className="flex items-center gap-2"><span className="text-orange-600 font-bold">✓</span> Coleta de informações junto aos colaboradores do setor</li>
                        <li className="flex items-center gap-2"><span className="text-orange-600 font-bold">✓</span> Documentação detalhada em formulário padronizado</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fluxo 6: Plano de Ação */}
          <div className="mb-12">
            <Card className="border-l-4 border-l-yellow-600 bg-gradient-to-br from-yellow-50 to-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="text-5xl">📊</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-block bg-yellow-600 text-white font-bold px-4 py-2 rounded-full text-sm">Fluxo 6</span>
                      <h3 className="text-2xl font-bold text-yellow-700">Plano de Ação</h3>
                    </div>
                    <p className="text-slate-700 mb-4 leading-relaxed">Após a conclusão da inspeção em campo, a equipe se reúne para análise consolidada dos riscos identificados, definindo estratégias de controle e ações corretivas.</p>
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <p className="font-semibold text-slate-800 mb-3">Elementos do Plano de Ação:</p>
                      <ul className="space-y-2 text-slate-700">
                        <li className="flex items-center gap-2"><span className="text-yellow-600 font-bold">→</span> <span className="font-medium">Descrição detalhada</span> de cada risco identificado</li>
                        <li className="flex items-center gap-2"><span className="text-yellow-600 font-bold">→</span> <span className="font-medium">Medidas de controle</span> propostas (eliminação, substituição, engenharia, administrativas, EPI)</li>
                        <li className="flex items-center gap-2"><span className="text-yellow-600 font-bold">→</span> <span className="font-medium">Responsável</span> pela execução de cada ação</li>
                        <li className="flex items-center gap-2"><span className="text-yellow-600 font-bold">→</span> <span className="font-medium">Prazo</span> definido para implementação</li>
                        <li className="flex items-center gap-2"><span className="text-yellow-600 font-bold">→</span> <span className="font-medium">Priorização</span> conforme classificação de risco</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fluxo 7: Execução */}
          <div className="mb-12">
            <Card className="border-l-4 border-l-green-600 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="text-5xl">⚙️</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-block bg-green-600 text-white font-bold px-4 py-2 rounded-full text-sm">Fluxo 7</span>
                      <h3 className="text-2xl font-bold text-green-700">Execução</h3>
                    </div>
                    <p className="text-slate-700 mb-4 leading-relaxed">Nesta etapa, os responsáveis designados executam as ações corretivas conforme definido no plano de ação, dentro dos prazos estabelecidos e de acordo com as especificações técnicas.</p>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="font-semibold text-slate-800 mb-3">Diretrizes para Execução:</p>
                      <ul className="space-y-2 text-slate-700">
                        <li className="flex items-center gap-2"><span className="text-green-600 font-bold">✓</span> Cumprimento rigoroso dos prazos estabelecidos</li>
                        <li className="flex items-center gap-2"><span className="text-green-600 font-bold">✓</span> Utilização de materiais e métodos apropriados</li>
                        <li className="flex items-center gap-2"><span className="text-green-600 font-bold">✓</span> Documentação fotográfica do antes e depois</li>
                        <li className="flex items-center gap-2"><span className="text-green-600 font-bold">✓</span> Comunicação periódica do progresso</li>
                        <li className="flex items-center gap-2"><span className="text-green-600 font-bold">✓</span> Envolvimento de colaboradores na implementação</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fluxo 8: Verificação */}
          <div className="mb-12">
            <Card className="border-l-4 border-l-red-600 bg-gradient-to-br from-red-50 to-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="text-5xl">✅</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-block bg-red-600 text-white font-bold px-4 py-2 rounded-full text-sm">Fluxo 8</span>
                      <h3 className="text-2xl font-bold text-red-700">Verificação (Avaliação Final)</h3>
                    </div>
                    <p className="text-slate-700 mb-4 leading-relaxed">A etapa final de verificação garante que as ações corretivas foram executadas adequadamente e que os riscos foram efetivamente eliminados ou controlados a níveis aceitáveis.</p>
                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <p className="font-semibold text-slate-800 mb-3">Critérios de Verificação:</p>
                      <ul className="space-y-2 text-slate-700">
                        <li className="flex items-center gap-2"><span className="text-red-600 font-bold">☑</span> Conformidade com as especificações do plano de ação</li>
                        <li className="flex items-center gap-2"><span className="text-red-600 font-bold">☑</span> Efetividade das medidas implementadas</li>
                        <li className="flex items-center gap-2"><span className="text-red-600 font-bold">☑</span> Eliminação ou redução adequada do risco</li>
                        <li className="flex items-center gap-2"><span className="text-red-600 font-bold">☑</span> Ausência de novos riscos criados pelas ações</li>
                        <li className="flex items-center gap-2"><span className="text-red-600 font-bold">☑</span> Registro final e fechamento da ação</li>
                      </ul>
                    </div>
                    <p className="text-slate-600 text-sm mt-4 italic"><span className="font-semibold">Resultado:</span> Caso a verificação identifique inadequações, novas ações corretivas são definidas e o ciclo continua até a resolução completa do risco.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

      </main>
    </div>
  );
}

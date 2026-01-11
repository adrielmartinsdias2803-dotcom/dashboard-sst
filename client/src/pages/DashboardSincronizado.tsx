import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DadosAderencia {
  numero_rota: string;
  setor: string;
  tecnico_seguranca: string;
  manutencao: string;
  producao: string;
  convidados: string;
  todos_presentes: string;
  data_prevista: string;
  data_realizada: string;
  status: string;
}

interface Estatisticas {
  totalRotas: number;
  rotasConcluidas: number;
  rotasPendentes: number;
  percentualConclusao: number;
  setoresInspecionados: number;
  setoresConvidados: Array<{ setor: string; count: number }>;
}

const CORES = ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#00f2fe"];

export default function DashboardSincronizado() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [ultimaSincronizacao, setUltimaSincronizacao] = useState<Date | null>(null);
  const [dados, setDados] = useState<DadosAderencia[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);

  // Queries
  const { data: dadosSincronizados, isLoading: loadingDados } = trpc.sync.obterDados.useQuery(
    undefined,
    {
      refetchInterval: 30000, // Refetch a cada 30 segundos
    }
  );

  const { data: statusSincronizacao } = trpc.sync.obterStatus.useQuery(undefined, {
    refetchInterval: 60000, // Refetch a cada 1 minuto
  });

  const { data: estatisticasData } = trpc.sync.obterEstatisticas.useQuery(undefined, {
    refetchInterval: 30000,
  });

  // Mutations
  const sincronizarMutation = trpc.sync.sincronizar.useMutation({
    onSuccess: (resultado) => {
      setIsSyncing(false);
      if (resultado.sucesso) {
        setDados(resultado.dados);
        setUltimaSincronizacao(new Date());
        toast.success(`✅ Sincronização concluída! ${resultado.total} registros`);
      } else {
        toast.error("Erro ao sincronizar dados");
      }
    },
    onError: (error) => {
      setIsSyncing(false);
      toast.error(`Erro: ${error.message}`);
    },
  });

  // Atualizar dados quando recebidos
  useEffect(() => {
    if (dadosSincronizados?.dados) {
      setDados(dadosSincronizados.dados);
      if (dadosSincronizados.ultimaSincronizacao) {
        setUltimaSincronizacao(new Date(dadosSincronizados.ultimaSincronizacao));
      }
    }
  }, [dadosSincronizados]);

  useEffect(() => {
    if (estatisticasData) {
      setEstatisticas(estatisticasData);
    }
  }, [estatisticasData]);

  const handleSincronizar = async () => {
    setIsSyncing(true);
    try {
      await sincronizarMutation.mutateAsync();
    } catch (error) {
      setIsSyncing(false);
    }
  };

  // Preparar dados para gráfico de tendência
  const dadosTendencia = dados.reduce(
    (acc, rota) => {
      const data = rota.data_prevista.split("-")[2]; // Pega o dia
      const mes = rota.data_prevista.split("-")[1]; // Pega o mês
      const chave = `${mes}/${data}`;

      const item = acc.find((i) => i.data === chave);
      if (item) {
        if (rota.status === "CONCLUÍDO") item.concluidas++;
        else item.pendentes++;
      } else {
        acc.push({
          data: chave,
          concluidas: rota.status === "CONCLUÍDO" ? 1 : 0,
          pendentes: rota.status === "CONCLUÍDO" ? 0 : 1,
        });
      }
      return acc;
    },
    [] as Array<{ data: string; concluidas: number; pendentes: number }>
  );

  // Preparar dados para gráfico de setores
  const dadosSetores =
    estatisticas?.setoresConvidados.slice(0, 5).map((s, idx) => ({
      name: s.setor,
      value: s.count,
      fill: CORES[idx % CORES.length],
    })) || [];

  const tempoDesdeUltimaSincronizacao = statusSincronizacao?.tempoDesdeUltimaSincronizacao
    ? Math.floor(statusSincronizacao.tempoDesdeUltimaSincronizacao / 60)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">Dashboard Sincronizado</h1>
              <p className="text-slate-600">Dados em tempo real do SharePoint</p>
            </div>
            <Button
              onClick={handleSincronizar}
              disabled={isSyncing}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-700 hover:from-primary/90 hover:to-blue-700/90"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Sincronizar Agora
                </>
              )}
            </Button>
          </div>

          {/* Status de Sincronização */}
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Última Sincronização</p>
                <p className="text-lg font-semibold text-slate-900">
                  {ultimaSincronizacao
                    ? ultimaSincronizacao.toLocaleString("pt-BR")
                    : "Nunca sincronizado"}
                </p>
              </div>
              {tempoDesdeUltimaSincronizacao !== null && (
                <div className="text-right">
                  <p className="text-sm text-slate-600">Há</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {tempoDesdeUltimaSincronizacao} minuto(s)
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Sincronizado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        {estatisticas && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total de Rotas</p>
                    <p className="text-3xl font-bold text-primary">{estatisticas.totalRotas}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Rotas Concluídas</p>
                    <p className="text-3xl font-bold text-green-600">
                      {estatisticas.rotasConcluidas}
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Rotas Pendentes</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {estatisticas.rotasPendentes}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Taxa de Conclusão</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {estatisticas.percentualConclusao}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de Tendência */}
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Tendência de Rotas</h3>
              {dadosTendencia.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dadosTendencia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="concluidas"
                      stroke="#10b981"
                      name="Concluídas"
                    />
                    <Line type="monotone" dataKey="pendentes" stroke="#f59e0b" name="Pendentes" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500 text-center py-8">Sem dados disponíveis</p>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de Setores */}
          <Card className="bg-white shadow-lg">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Setores Convidados</h3>
              {dadosSetores.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosSetores}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosSetores.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500 text-center py-8">Sem dados disponíveis</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Rotas */}
        <Card className="bg-white shadow-lg">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-900">Rotas Recentes</h3>
            {loadingDados ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : dados.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Rota</th>
                      <th className="px-4 py-2 text-left font-semibold">Setor</th>
                      <th className="px-4 py-2 text-left font-semibold">Data</th>
                      <th className="px-4 py-2 text-left font-semibold">Status</th>
                      <th className="px-4 py-2 text-left font-semibold">Técnico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados.slice(0, 10).map((rota, idx) => (
                      <tr key={idx} className="border-b hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium">{rota.numero_rota}</td>
                        <td className="px-4 py-3">{rota.setor}</td>
                        <td className="px-4 py-3">{rota.data_prevista}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              rota.status === "CONCLUÍDO"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {rota.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{rota.tecnico_seguranca}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Nenhuma rota encontrada</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

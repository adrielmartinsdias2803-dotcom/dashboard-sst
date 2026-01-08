import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  ArrowLeft,
  Settings,
  BarChart3,
  Calendar
} from "lucide-react"
import { toast } from "sonner";

interface RotaAgendada {
  id: number;
  dataRota: string;
  horaRota: string;
  setor: string;
  tecnicoSST: string;
  representanteManutenção: string;
  representanteProducao: string;
  convidados?: string;
  observacoes?: string;
  status: "pendente" | "confirmada" | "concluida" | "cancelada";
  responsavelConfirmacao?: string;
  dataConfirmacao?: Date;
  observacoesConfirmacao?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [rotas, setRotas] = useState<RotaAgendada[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [notificacoes, setNotificacoes] = useState<number>(0);
  const [tab, setTab] = useState<"notificacoes" | "historico">("notificacoes");

  const listRotasQuery = trpc.rotas.listRotas.useQuery({
    status: "pendente",
    limit: 100,
  });

  const confirmarRotaMutation = trpc.rotas.confirmarRota.useMutation({
    onSuccess: () => {
      toast.success("✅ Rota confirmada! Equipe notificada.");
      listRotasQuery.refetch();
      setNotificacoes(Math.max(0, notificacoes - 1));
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
    },
  });

  const rejeitarRotaMutation = trpc.rotas.cancelarRota.useMutation({
    onSuccess: () => {
      toast.success("⛔ Rota rejeitada.");
      listRotasQuery.refetch();
      setNotificacoes(Math.max(0, notificacoes - 1));
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
    },
  });

  const concluirRotaMutation = trpc.rotas.concluirRota.useMutation({
    onSuccess: () => {
      toast.success("🎉 Rota concluída com sucesso!");
      listRotasQuery.refetch();
    },
    onError: (error) => {
      toast.error(`❌ Erro: ${error.message}`);
    },
  });

  useEffect(() => {
    if (listRotasQuery.data) {
      setRotas(listRotasQuery.data as RotaAgendada[]);
      setNotificacoes((listRotasQuery.data as RotaAgendada[]).length);
    }
  }, [listRotasQuery.data]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-4 w-4" /> },
      confirmada: { label: "Confirmada", color: "bg-blue-100 text-blue-800", icon: <CheckCircle className="h-4 w-4" /> },
      concluida: { label: "Concluída", color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-4 w-4" /> },
      cancelada: { label: "Rejeitada", color: "bg-red-100 text-red-800", icon: <XCircle className="h-4 w-4" /> },
    };
    const config = statusMap[status];
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Premium */}
      <header className="relative overflow-hidden bg-gradient-to-r from-primary via-blue-700 to-primary/90 text-white py-8 px-4 md:px-8 shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
              <img src="/images/mococa-logo.png" alt="Mococa" className="h-16 md:h-20 relative" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">SEGURANÇA DO TRABALHO</h1>
              <p className="text-blue-100 text-sm md:text-base mt-1 font-light">Gestão de Rotas de Segurança</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="h-6 w-6" />
              {notificacoes > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {notificacoes}
                </span>
              )}
            </div>
            <Button 
              onClick={() => setLocation('/')}
              className="bg-white/20 text-white border-white hover:bg-white/30 border"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setTab("notificacoes")}
            className={`pb-4 px-4 font-semibold flex items-center gap-2 transition-colors ${
              tab === "notificacoes"
                ? "text-primary border-b-2 border-primary"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bell className="h-5 w-5" />
            Notificações ({notificacoes})
          </button>
          <button
            onClick={() => setTab("historico")}
            className={`pb-4 px-4 font-semibold flex items-center gap-2 transition-colors ${
              tab === "historico"
                ? "text-primary border-b-2 border-primary"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calendar className="h-5 w-5" />
            Histórico
          </button>
        </div>

        {/* Notificações Tab */}
        {tab === "notificacoes" && (
          <div className="space-y-4">
            {listRotasQuery.isLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">Carregando notificações...</p>
                </CardContent>
              </Card>
            ) : rotas.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12">
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-700">Tudo em dia! ✅</p>
                    <p className="text-gray-500 mt-2">Nenhuma rota pendente de confirmação.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              rotas.map((rota) => (
                <Card key={rota.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                          <h3 className="text-lg font-semibold text-primary">{rota.setor}</h3>
                          <Badge className="bg-yellow-100 text-yellow-800">AGUARDANDO CONFIRMAÇÃO</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          📅 {rota.dataRota} às {rota.horaRota}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedId(expandedId === rota.id ? null : rota.id)}
                      >
                        <ChevronRight className={`h-5 w-5 transition-transform ${expandedId === rota.id ? "rotate-90" : ""}`} />
                      </Button>
                    </div>
                  </CardHeader>

                  {expandedId === rota.id && (
                    <CardContent className="space-y-4 border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                        <div>
                          <p className="text-sm font-semibold text-gray-600">👨‍💼 Técnico SST</p>
                          <p className="text-gray-900 font-medium">{rota.tecnicoSST}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600">🔧 Manutenção</p>
                          <p className="text-gray-900 font-medium">{rota.representanteManutenção}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600">🏭 Produção</p>
                          <p className="text-gray-900 font-medium">{rota.representanteProducao}</p>
                        </div>
                        {rota.convidados && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">👥 Convidados</p>
                            <p className="text-gray-900 font-medium">{rota.convidados}</p>
                          </div>
                        )}
                      </div>

                      {rota.observacoes && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="text-sm font-semibold text-gray-600 mb-2">📝 Observações</p>
                          <p className="text-gray-900">{rota.observacoes}</p>
                        </div>
                      )}

                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          onClick={() =>
                            confirmarRotaMutation.mutate({
                              id: rota.id,
                              responsavelConfirmacao: "Administrador",
                              observacoesConfirmacao: "Confirmado pelo painel administrativo",
                            })
                          }
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
                          disabled={confirmarRotaMutation.isPending}
                        >
                          ✅ CONFIRMAR ROTA
                        </Button>
                        <Button
                          onClick={() =>
                            rejeitarRotaMutation.mutate({
                              id: rota.id,
                              observacoesConfirmacao: "Rejeitado pelo painel administrativo",
                            })
                          }
                          variant="destructive"
                          className="flex-1 font-semibold"
                          disabled={rejeitarRotaMutation.isPending}
                        >
                          ❌ REJEITAR
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {/* Histórico Tab */}
        {tab === "historico" && (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Rotas Realizadas</CardTitle>
              <CardDescription>Todas as rotas confirmadas e concluídas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-gray-500">Histórico será exibido aqui após conclusão de rotas</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

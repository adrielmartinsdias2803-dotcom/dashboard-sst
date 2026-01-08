import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, AlertCircle, ChevronRight, ArrowLeft } from "lucide-react";
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

export default function PainelRotas() {
  const [, setLocation] = useLocation();
  const [rotas, setRotas] = useState<RotaAgendada[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>("pendente");
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const listRotasQuery = trpc.rotas.listRotas.useQuery({
    status: filtroStatus as any,
    limit: 100,
  });

  const confirmarRotaMutation = trpc.rotas.confirmarRota.useMutation({
    onSuccess: () => {
      toast.success("Rota confirmada com sucesso!");
      listRotasQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao confirmar: ${error.message}`);
    },
  });

  const concluirRotaMutation = trpc.rotas.concluirRota.useMutation({
    onSuccess: () => {
      toast.success("Rota concluída com sucesso!");
      listRotasQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao concluir: ${error.message}`);
    },
  });

  const cancelarRotaMutation = trpc.rotas.cancelarRota.useMutation({
    onSuccess: () => {
      toast.success("Rota cancelada!");
      listRotasQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao cancelar: ${error.message}`);
    },
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-4 w-4" /> },
      confirmada: { label: "Confirmada", color: "bg-blue-100 text-blue-800", icon: <CheckCircle className="h-4 w-4" /> },
      concluida: { label: "Concluída", color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-4 w-4" /> },
      cancelada: { label: "Cancelada", color: "bg-red-100 text-red-800", icon: <XCircle className="h-4 w-4" /> },
    };
    const config = statusMap[status];
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  useEffect(() => {
    if (listRotasQuery.data) {
      setRotas(listRotasQuery.data as RotaAgendada[]);
    }
  }, [listRotasQuery.data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/images/mococa-logo.png" alt="Mococa" className="h-16" />
              <div>
                <h1 className="text-3xl font-bold">Painel de Controle de Rotas</h1>
                <p className="text-blue-100">Gerenciar agendamentos de Segurança do Trabalho</p>
              </div>
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
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="mb-8 flex gap-2 flex-wrap">
          {["pendente", "confirmada", "concluida", "cancelada"].map((status) => (
            <Button
              key={status}
              variant={filtroStatus === status ? "default" : "outline"}
              onClick={() => setFiltroStatus(status)}
              className="capitalize"
            >
              {status === "pendente" && "⏳ Pendentes"}
              {status === "confirmada" && "✅ Confirmadas"}
              {status === "concluida" && "🎉 Concluídas"}
              {status === "cancelada" && "❌ Canceladas"}
            </Button>
          ))}
        </div>

        {/* Lista de Rotas */}
        <div className="space-y-4">
          {listRotasQuery.isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Carregando rotas...</p>
              </CardContent>
            </Card>
          ) : rotas.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Nenhuma rota encontrada neste status.</p>
              </CardContent>
            </Card>
          ) : (
            rotas.map((rota) => (
              <Card key={rota.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{rota.setor}</h3>
                        {getStatusBadge(rota.status)}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Técnico SST</p>
                        <p className="text-gray-900">{rota.tecnicoSST}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Manutenção</p>
                        <p className="text-gray-900">{rota.representanteManutenção}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Produção</p>
                        <p className="text-gray-900">{rota.representanteProducao}</p>
                      </div>
                      {rota.convidados && (
                        <div>
                          <p className="text-sm font-semibold text-gray-600">Convidados</p>
                          <p className="text-gray-900">{rota.convidados}</p>
                        </div>
                      )}
                    </div>

                    {rota.observacoes && (
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Observações</p>
                        <p className="text-gray-900">{rota.observacoes}</p>
                      </div>
                    )}

                    {/* Ações */}
                    {rota.status === "pendente" && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          onClick={() =>
                            confirmarRotaMutation.mutate({
                              id: rota.id,
                              responsavelConfirmacao: "Sistema",
                              observacoesConfirmacao: "Confirmado automaticamente",
                            })
                          }
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={confirmarRotaMutation.isPending}
                        >
                          ✅ Confirmar
                        </Button>
                        <Button
                          onClick={() =>
                            cancelarRotaMutation.mutate({
                              id: rota.id,
                              observacoesConfirmacao: "Cancelado",
                            })
                          }
                          variant="destructive"
                          className="flex-1"
                          disabled={cancelarRotaMutation.isPending}
                        >
                          ❌ Cancelar
                        </Button>
                      </div>
                    )}

                    {rota.status === "confirmada" && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          onClick={() =>
                            concluirRotaMutation.mutate({
                              id: rota.id,
                              observacoesConfirmacao: "Rota concluída",
                            })
                          }
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          disabled={concluirRotaMutation.isPending}
                        >
                          🎉 Marcar como Concluída
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

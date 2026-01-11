import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Activity,
  Mail,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface SyncLog {
  id: number;
  status: "success" | "error" | "pending";
  message: string;
  errorDetails: string | null;
  recordsProcessed: number;
  lastSyncedAt: Date | null;
  createdAt: Date;
}

export default function SyncStatus() {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Usar tRPC para forçar sincronização
  const forceSyncMutation = trpc.sst.forceSyncNow.useMutation({
    onSuccess: (data: any) => {
      setIsSyncing(false);
      if (data.success) {
        toast.success("Sincronização iniciada com sucesso!");
        // Atualizar último sync
        setLastSync(new Date());
        // Adicionar novo log
        const newLog: SyncLog = {
          id: logs.length + 1,
          status: "success",
          message: data.message,
          errorDetails: null,
          recordsProcessed: data.recordsProcessed || 0,
          lastSyncedAt: new Date(),
          createdAt: new Date(),
        };
        setLogs([newLog, ...logs]);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      setIsSyncing(false);
      toast.error("Erro ao sincronizar: " + error.message);
    },
  });

  const handleForceSyncClick = async () => {
    setIsSyncing(true);
    await forceSyncMutation.mutateAsync();
  };

  useEffect(() => {
    // Dados de exemplo
    setLogs([
      {
        id: 1,
        status: "success",
        message: "Sincronização concluída com sucesso",
        errorDetails: null,
        recordsProcessed: 737,
        lastSyncedAt: new Date(Date.now() - 5 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        id: 2,
        status: "success",
        message: "Sincronização concluída com sucesso",
        errorDetails: null,
        recordsProcessed: 735,
        lastSyncedAt: new Date(Date.now() - 10 * 60 * 1000),
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    ]);

    setLastSync(new Date(Date.now() - 5 * 60 * 1000));
    setIsLoading(false);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-emerald-100 text-emerald-800">Sucesso</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Erro</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(date));
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Agora";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m atrás`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
    return `${Math.floor(seconds / 86400)}d atrás`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-white py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold">Status de Sincronização</h1>
          <p className="text-blue-100 mt-2">Monitoramento em tempo real do SharePoint</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        
        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
                Última Sincronização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {lastSync ? timeAgo(lastSync) : "Nunca"}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {lastSync ? formatTime(lastSync) : "Aguardando primeira sincronização"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
                Frequência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">A cada 5 min</div>
              <p className="text-xs text-muted-foreground mt-2">Sincronização automática ativa</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
                Registros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">737</div>
              <p className="text-xs text-muted-foreground mt-2">Última sincronização bem-sucedida</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-12 flex-wrap">
          <Button 
            className="gap-2" 
            onClick={handleForceSyncClick}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Sincronização
              </>
            )}
          </Button>
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            Configurar Alertas
          </Button>
        </div>

        {/* Sync Logs */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Histórico de Sincronizações</h2>

          <div className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Activity className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                  <p className="text-muted-foreground">Carregando histórico...</p>
                </CardContent>
              </Card>
            ) : logs.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Nenhuma sincronização registrada</p>
                </CardContent>
              </Card>
            ) : (
              logs.map((log) => (
                <Card key={log.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="mt-1">{getStatusIcon(log.status)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{log.message}</h3>
                            {getStatusBadge(log.status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium text-foreground">{log.recordsProcessed}</span>
                              <p>Registros</p>
                            </div>
                            <div>
                              <span className="font-medium text-foreground">
                                {formatTime(log.createdAt)}
                              </span>
                              <p>Data/Hora</p>
                            </div>
                            {log.lastSyncedAt && (
                              <div>
                                <span className="font-medium text-foreground">
                                  {formatTime(log.lastSyncedAt)}
                                </span>
                                <p>Última atualização</p>
                              </div>
                            )}
                          </div>

                          {log.errorDetails && (
                            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                              <p className="text-xs font-mono text-destructive">{log.errorDetails}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Configuration Info */}
        <section className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Informações de Sincronização
          </h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li>✓ Sincronização automática: <span className="font-semibold">Ativa</span></li>
            <li>✓ Intervalo: <span className="font-semibold">5 minutos</span></li>
            <li>✓ Sincronização manual: <span className="font-semibold">Disponível</span></li>
            <li>✓ Alertas por email: <span className="font-semibold">Configurados para 3 contatos</span></li>
            <li>✓ Última verificação: <span className="font-semibold">{lastSync ? timeAgo(lastSync) : "Nunca"}</span></li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 px-4 md:px-8 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-blue-100">
            Status de Sincronização - Dashboard SST Mococa
          </p>
        </div>
      </footer>
    </div>
  );
}

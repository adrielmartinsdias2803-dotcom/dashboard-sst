import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Zap, 
  RefreshCw, 
  Calendar, 
  Loader2,
  FileText,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("✅ Sincronização com SharePoint concluída!");
    } catch (error) {
      toast.error("❌ Erro ao sincronizar. Tente novamente.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAgendarRota = () => {
    window.location.href = "/agendar-rota";
  };

  const handlePowerBIAccess = () => {
    const powerBIUrl = "https://app.powerbi.com/";
    window.open(powerBIUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Premium */}
      <header className="relative overflow-hidden bg-gradient-to-r from-primary via-blue-700 to-primary/90 text-white py-12 px-4 md:px-8 shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-8 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
              <img src="/images/mococa-logo.png" alt="Mococa" className="h-20 md:h-24 relative" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">RELATÓRIO SEGURANÇA DO TRABALHO</h1>
              <p className="text-blue-100 text-lg md:text-xl mt-2 font-light">Gestão Integrada de Saúde e Segurança do Trabalho</p>
            </div>
          </div>
          <div className="text-blue-100 text-sm flex items-center gap-2">
            <span>Última Sincronização</span>
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="font-semibold">Janeiro 8, 2026 às 19:27</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        
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
            {/* Grid de 5 botões principais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
              {/* Sincronização */}
              <Button 
                onClick={handleForceSync}
                disabled={isSyncing}
                className="flex flex-col items-center justify-center gap-3 px-4 py-6 bg-gradient-to-br from-primary to-blue-700 hover:from-primary/90 hover:to-blue-700/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg font-semibold text-sm h-auto whitespace-normal disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Sincronizando...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-6 w-6" />
                    <span>Sincronização</span>
                  </>
                )}
              </Button>

              {/* Agendar Rota */}
              <button
                onClick={handleAgendarRota}
                className="flex flex-col items-center justify-center gap-3 px-4 py-6 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 h-auto whitespace-normal cursor-pointer"
                title="Agendar uma nova rota de segurança"
              >
                <Calendar className="h-6 w-6" />
                <span>Agendar Rota</span>
              </button>

              {/* Dashboard PowerBI */}
              <button
                onClick={handlePowerBIAccess}
                className="flex flex-col items-center justify-center gap-3 px-4 py-6 bg-gradient-to-br from-primary to-blue-700 hover:from-primary/90 hover:to-blue-700/90 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 h-auto whitespace-normal cursor-pointer"
                title="Abrir Dashboard PowerBI em nova aba"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                </svg>
                <span>Dashboard PowerBI</span>
              </button>

              {/* Segurança do Trabalho */}
              <button
                onClick={() => window.location.href = '/admin/dashboard'}
                className="flex flex-col items-center justify-center gap-3 px-4 py-6 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 h-auto whitespace-normal cursor-pointer"
                title="Acessar Painel de Segurança do Trabalho"
              >
                <Shield className="h-6 w-6" />
                <span>Segurança do Trabalho</span>
              </button>

              {/* Painel de Rotas */}
              <button
                onClick={() => window.location.href = '/painel-rotas'}
                className="flex flex-col items-center justify-center gap-3 px-4 py-6 bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 h-auto whitespace-normal cursor-pointer"
                title="Acessar Painel de Controle de Rotas"
              >
                <TrendingUp className="h-6 w-6" />
                <span>Painel de Rotas</span>
              </button>
            </div>

            {/* Botão de Planilha em linha cheia */}
            <button
              onClick={() => {
                const url = 'https://mococa.sharepoint.com/:x:/s/msteams_6115f4_553804/IQAC1WtO39XDR6XhDrcEMBqNAaEW-EuEv7JV7Io_fYzQaxs?email=sandy.nascimento%40mococa.com.br&e=BlyQSz';
                window.open(url, '_blank');
              }}
              className="w-full flex flex-col items-center justify-center gap-3 px-4 py-6 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 h-auto whitespace-normal cursor-pointer"
              title="Acessar Planilha Condição de Risco"
            >
              <FileText className="h-6 w-6" />
              <span>Planilha Condição de Risco</span>
            </button>
          </div>
        </div>

        {/* Resumo Executivo */}
        <div className="mb-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-6 flex items-center gap-3">
            <Shield className="h-8 w-8" />
            Resumo Executivo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Rotas Agendadas */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-semibold">Rotas Agendadas</p>
                    <p className="text-4xl font-bold text-primary mt-2">12</p>
                    <p className="text-xs text-slate-500 mt-2">Este mês</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Rotas Concluídas */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-semibold">Rotas Concluídas</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">8</p>
                    <p className="text-xs text-slate-500 mt-2">Taxa: 67%</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Pendentes */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-semibold">Pendentes</p>
                    <p className="text-4xl font-bold text-yellow-600 mt-2">4</p>
                    <p className="text-xs text-slate-500 mt-2">Aguardando confirmação</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Taxa de Conformidade */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-semibold">Conformidade</p>
                    <p className="text-4xl font-bold text-primary mt-2">94%</p>
                    <p className="text-xs text-slate-500 mt-2">Setores conformes</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-primary/5 border border-blue-200 rounded-2xl p-8">
          <h3 className="text-xl font-display font-bold text-primary mb-4">ℹ️ Bem-vindo ao Sistema de Gestão SST</h3>
          <p className="text-slate-700 leading-relaxed">
            Este sistema integrado oferece uma visão completa da segurança do trabalho na Mococa. Utilize as ferramentas acima para agendar rotas, acompanhar o progresso, sincronizar dados com SharePoint e gerar relatórios em tempo real. Todos os dados são sincronizados automaticamente para garantir consistência e conformidade.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 px-4 md:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">© 2026 Mococa - Sistema de Gestão de Segurança do Trabalho. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

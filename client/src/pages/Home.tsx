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
  Flame
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SSTMetrics {
  totalRiscos: number;
  riscosAltos: number;
  riscosMedias: number;
  riscosCriticos: number;
  acoesConcluidas: number;
}

export default function Home() {
  const [metrics, setMetrics] = useState<SSTMetrics>({
    totalRiscos: 737,
    riscosAltos: 276,
    riscosMedias: 251,
    riscosCriticos: 3,
    acoesConcluidas: 290,
  });
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const forceSyncMutation = trpc.sst.forceSyncNow.useMutation({
    onSuccess: (data) => {
      setIsSyncing(false);
      if (data.success) {
        toast.success("Sincronização iniciada com sucesso!");
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
    await forceSyncMutation.mutateAsync();
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
            <p className="text-blue-100 text-sm font-light">Análise Completa</p>
            <p className="font-display text-2xl font-bold mt-1">Janeiro 2026</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button 
                onClick={handleForceSync}
                disabled={isSyncing}
                className="gap-3 h-14 text-base font-semibold bg-gradient-to-r from-primary to-blue-700 hover:from-primary/90 hover:to-blue-700/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5" />
                    Sincronização
                  </>
                )}
              </Button>
              <a 
                href="https://app.powerbi.com/groups/me/reports/5a087ca6-f606-4cb2-af76-6a3ca94a08c2/868e18c05a0d8320c33c?ctid=57a79bba-3c38-4dc9-b884-b899495e3e9c&experience=power-bi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-blue-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 h-14 text-base shadow-lg hover:from-primary/90 hover:to-blue-700/90"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                </svg>
                Dashboard PowerBI
              </a>
              <a 
                href="https://mococa.sharepoint.com/:x:/s/msteams_6115f4_553804/IQAC1WtO39XDR6XhDrcEMBqNAaEW-EuEv7JV7Io_fYzQaxs?email=sandy.nascimento%40mococa.com.br&e=BlyQSz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 h-14 text-base shadow-lg hover:from-yellow-400/90 hover:to-yellow-500/90"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Planilha Condição de Risco
              </a>
            </div>
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

        {/* Fluxograma de Rotas */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-display font-bold text-primary">Realização de Rotas de Segurança</h2>
          </div>

          <Card className="border-0 shadow-xl bg-white overflow-hidden">
            <CardContent className="p-8">
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Cadastro da Rota",
                    participants: ["Técnico de Segurança", "Alguém da Manutenção", "Alguém da Produção"],
                    color: "bg-blue-100 text-blue-700"
                  },
                  {
                    step: 2,
                    title: "Convite de Participantes",
                    participants: ["PCP", "Qualidade", "Almoxerifado", "Melhoria Contínua", "Diretoria", "Facilities", "Meio Ambiente", "Pesquisa e Desenvolvimento"],
                    color: "bg-purple-100 text-purple-700"
                  },
                  {
                    step: 3,
                    title: "Agendamento",
                    participants: ["Prazo: 45 dias (1 mês e meio)"],
                    color: "bg-yellow-100 text-yellow-700"
                  },
                  {
                    step: 4,
                    title: "Execução da Rota",
                    participants: ["Inspeção de segurança", "Coleta de dados", "Documentação"],
                    color: "bg-green-100 text-green-700"
                  }
                ].map((phase, idx) => (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${phase.color} flex items-center justify-center font-bold text-lg`}>
                      {phase.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-3">{phase.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {phase.participants.map((participant, pidx) => (
                          <Badge key={pidx} variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                            {participant}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {idx < 3 && (
                      <div className="text-primary text-2xl">↓</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

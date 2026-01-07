import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  RefreshCw
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
    riscosCriticos: 2,
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

  // TODO: Integrar com API tRPC quando a rota estiver pronta
  // const { data: metricsData, isLoading } = trpc.sst.getMetrics.useQuery();
  // useEffect(() => {
  //   if (metricsData) {
  //     setMetrics(metricsData);
  //   }
  // }, [metricsData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header com Logo */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-white py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/mococa-logo.png" alt="Mococa" className="h-16 md:h-20" />
            <div>
              <h1 className="text-2xl md:text-4xl font-display font-bold">RELATÓRIO SST</h1>
              <p className="text-blue-100 text-sm md:text-base">Gestão de Saúde e Segurança do Trabalho</p>
            </div>
          </div>
          <div className="text-right text-sm md:text-base">
            <p className="text-blue-100">Análise Completa</p>
            <p className="font-semibold">Jan 2026</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        
        {/* Links de Acesso */}
        <div className="mb-12 flex justify-end gap-4 flex-wrap">
          <Button 
            onClick={handleForceSync}
            disabled={isSyncing}
            className="gap-2"
          >
            {isSyncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Forçar Sincronização
              </>
            )}
          </Button>
          <a 
            href="https://app.powerbi.com/links/msbdKkK4g_?ctid=57a79bba-3c38-4dc9-b884-b899495e3e9c&pbi_source=linkShare&bookmarkGuid=2597a280-9448-40cd-99f5-99b6ab80e143"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
            Acessar Dashboard PowerBI
          </a>
        </div>

        {/* Executive Summary */}
        <section className="mb-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-6">Resumo Executivo</h2>
          
          <Card className="border-l-4 border-l-secondary shadow-lg">
            <CardContent className="pt-6">
              <p className="text-lg text-foreground leading-relaxed mb-4">
                A análise da planilha de Gestão SST revelou um panorama crítico que demanda ação imediata. 
                Foram identificados <span className="font-bold text-primary">{metrics.totalRiscos} registros</span> de condições de risco 
                e acidentes, com uma concentração preocupante de <span className="font-bold text-destructive">71,5%</span> 
                classificados como Alto ou Médio risco.
              </p>
              <p className="text-lg text-foreground leading-relaxed">
                Embora o sistema de gestão demonstre maturidade na identificação de riscos, o alto percentual de 
                ações não iniciadas (52,9%) e a distribuição desigual de responsabilidades indicam a necessidade 
                de reforço operacional e investimentos estruturais significativos.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Key Metrics */}
        <section className="mb-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-6">Indicadores Principais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="border-t-4 border-t-destructive hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Total de Riscos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold text-destructive">{metrics.totalRiscos}</div>
                <p className="text-xs text-muted-foreground mt-2">Condições identificadas</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-destructive hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Riscos Altos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold text-destructive">{metrics.riscosAltos}</div>
                <p className="text-xs text-muted-foreground mt-2">37,4% do total</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-secondary hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Riscos Médios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold text-secondary">{metrics.riscosMedias}</div>
                <p className="text-xs text-muted-foreground mt-2">34,1% do total</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-red-900 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Riscos Críticos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold text-red-900">{metrics.riscosCriticos}</div>
                <p className="text-xs text-muted-foreground mt-2">0,3% do total</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-emerald-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Ações Concluídas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold text-emerald-600">{metrics.acoesConcluidas}</div>
                <p className="text-xs text-muted-foreground mt-2">39,3% de resolução</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What's Happening */}
        <section className="mb-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-6">O Que Está Acontecendo</h2>
          
          <div className="space-y-4">
            <Card className="border-l-4 border-l-destructive bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Passivo Crítico de Ações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-3">
                  <span className="font-bold">52,9% das ações corretivas (390 itens)</span> ainda não foram iniciadas, 
                  representando um passivo significativo de riscos não tratados. Apenas 39,3% das ações foram concluídas.
                </p>
                <p className="text-sm text-muted-foreground">
                  Impacto: Exposição prolongada de colaboradores a condições de risco, aumento da probabilidade de acidentes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-destructive bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <TrendingUp className="h-5 w-5" />
                  Aumento Exponencial de Registros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-3">
                  Crescimento de <span className="font-bold">83,6%</span> no número de registros entre 2024 (244) e 2025 (448). 
                  Isso pode indicar melhoria na cultura de reporte, mas também pode refletir aumento real de condições de risco.
                </p>
                <p className="text-sm text-muted-foreground">
                  Impacto: Necessidade de ampliação de recursos humanos e orçamentários para gestão eficaz.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-destructive bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Shield className="h-5 w-5" />
                  Concentração em Áreas Específicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-3">
                  As áreas de <span className="font-bold">Xarope (45 registros) e SPX (43 registros)</span> concentram 
                  mais de <span className="font-bold">11%</span> de todos os riscos identificados. Estas são zonas críticas que demandam atenção prioritária.
                </p>
                <p className="text-sm text-muted-foreground">
                  Impacto: Risco elevado de acidentes nestes setores, necessidade de intervenções estruturais urgentes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary bg-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-secondary">
                  <Zap className="h-5 w-5" />
                  Sobrecarga na Área de Manutenção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-3">
                  A área de <span className="font-bold">Manutenção é responsável por 63,9% (471 ações)</span> de todas as 
                  ações corretivas, indicando que a maioria dos riscos está relacionada a aspectos estruturais e de equipamentos.
                </p>
                <p className="text-sm text-muted-foreground">
                  Impacto: Possível gargalo operacional, demanda por recursos e planejamento adequados.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Fluxograma de Rotas */}
        <section className="mb-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-6">Fluxograma de Realização de Rotas</h2>
          <p className="text-foreground mb-8 text-lg">Processo de cadastro e agendamento de inspeções de segurança</p>
          
          <div className="space-y-6">
            {/* Etapa 1 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">1</div>
                <div className="w-1 h-24 bg-primary/30 mt-2"></div>
              </div>
              <Card className="flex-1 border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Cadastro da Rota
                  </CardTitle>
                  <CardDescription>Responsável: Técnico de Segurança</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-3">O Técnico de Segurança realiza o cadastro inicial da rota de inspeção, definindo:</p>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-center gap-2"><span className="text-primary font-bold">•</span> Setor/área a ser inspecionada</li>
                    <li className="flex items-center gap-2"><span className="text-primary font-bold">•</span> Objetivos e pontos críticos</li>
                    <li className="flex items-center gap-2"><span className="text-primary font-bold">•</span> Requisitos de segurança</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Etapa 2 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-lg">2</div>
                <div className="w-1 h-24 bg-secondary/30 mt-2"></div>
              </div>
              <Card className="flex-1 border-l-4 border-l-secondary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-secondary" />
                    Convite de Participantes
                  </CardTitle>
                  <CardDescription>Técnico de Segurança convida os integrantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4">Participantes obrigatórios da rota:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                      <CheckCheck className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Técnico de Segurança</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                      <CheckCheck className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Responsável Manutenção</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                      <CheckCheck className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Responsável Produção</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-lg">
                      <CheckCheck className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium">Convidados (PCP/Qualidade/Almoxerifado)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Etapa 3 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg">3</div>
                <div className="w-1 h-24 bg-emerald-500/30 mt-2"></div>
              </div>
              <Card className="flex-1 border-l-4 border-l-emerald-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    Agendamento
                  </CardTitle>
                  <CardDescription>Prazo: 1 mês e meio para confirmação</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-3">Processo de agendamento:</p>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">•</span> Convite enviado aos participantes</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">•</span> Prazo de 45 dias para confirmação de presença</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">•</span> Definição de data e horário consensual</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">•</span> Confirmação final com todos os participantes</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Etapa 4 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">4</div>
              </div>
              <Card className="flex-1 border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    Execução da Rota
                  </CardTitle>
                  <CardDescription>Realização da inspeção de segurança</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-3">Durante a rota:</p>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">•</span> Inspeção colaborativa do setor</li>
                    <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">•</span> Identificação de riscos e oportunidades</li>
                    <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">•</span> Documentação de achados</li>
                    <li className="flex items-center gap-2"><span className="text-blue-600 font-bold">•</span> Definição de planos de ação</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Improvements Needed */}
        <section className="mb-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-6">Melhorias Necessárias</h2>
          
          <div className="space-y-4">
            <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  1. Priorização Urgente de Ações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Estabelecer um plano de ação imediato para os 390 itens "A iniciar", priorizando riscos Alto e Crítico</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Definir prazos realistas e responsáveis para cada ação</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Implementar sistema de acompanhamento com métricas de progresso</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  2. Reforço da Equipe de Manutenção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Ampliar a equipe de manutenção dado o volume de 471 ações sob sua responsabilidade</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Investir em treinamento especializado para equipamentos críticos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Implementar manutenção preventiva para reduzir emergências</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  3. Foco nas Áreas Críticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Implementar auditorias e inspeções mais frequentes em Xarope e SPX</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Designar um gestor de risco específico para cada área crítica</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Priorizar investimentos estruturais nestes setores</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  4. Investimento em Infraestrutura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Priorizar melhorias estruturais: pisos, painéis elétricos, sistemas de drenagem</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Investir em iluminação adequada nos setores de risco</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Implementar sistemas de proteção (guarda-corpos, linhas de vida) em áreas críticas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  5. Gestão Eficiente de Prazos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Estabelecer sistema rigoroso de acompanhamento de prazos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Implementar alertas automáticos para ações atrasadas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>Reduzir o percentual de ações não iniciadas de 52,9% para menos de 20%</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Conclusão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-foreground leading-relaxed">
                O sistema de gestão SST da Mococa demonstra maturidade na identificação de riscos, porém enfrenta 
                desafios operacionais significativos. Com {metrics.totalRiscos} registros documentados e 71,5% classificados como Alto ou Médio, 
                a situação demanda ação estratégica imediata.
              </p>
              <p className="text-lg text-foreground leading-relaxed">
                A implementação das melhorias propostas, com foco em priorização de ações, reforço de recursos humanos 
                e investimentos estruturais, é essencial para reduzir a exposição de colaboradores a riscos e garantir 
                um ambiente de trabalho seguro e produtivo.
              </p>
              <p className="text-lg text-foreground font-semibold text-primary">
                Recomenda-se iniciar as ações prioritárias imediatamente, com revisão de progresso mensal.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 px-4 md:px-8 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-blue-100">
            Relatório de Análise de Gestão SST - Mococa | Janeiro 2026
          </p>
          <p className="text-xs text-blue-200 mt-2">
            Dados baseados em análise completa da planilha de Condições de Riscos
          </p>
        </div>
      </footer>
    </div>
  );
}

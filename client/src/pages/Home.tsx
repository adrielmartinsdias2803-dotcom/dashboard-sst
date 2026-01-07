import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp,
  Target,
  Zap,
  Shield
} from "lucide-react";

export default function Home() {
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
        
        {/* Executive Summary */}
        <section className="mb-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-6">Resumo Executivo</h2>
          
          <Card className="border-l-4 border-l-secondary shadow-lg">
            <CardContent className="pt-6">
              <p className="text-lg text-foreground leading-relaxed mb-4">
                A análise da planilha de Gestão SST revelou um panorama crítico que demanda ação imediata. 
                Foram identificados <span className="font-bold text-primary">737 registros</span> de condições de risco 
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-t-4 border-t-destructive hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Total de Riscos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold text-destructive">737</div>
                <p className="text-xs text-muted-foreground mt-2">Condições identificadas</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-destructive hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Riscos Altos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold text-destructive">276</div>
                <p className="text-xs text-muted-foreground mt-2">37,4% do total</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-secondary hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Riscos Médios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold text-secondary">251</div>
                <p className="text-xs text-muted-foreground mt-2">34,1% do total</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-emerald-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Ações Concluídas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display font-bold text-emerald-600">290</div>
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
                desafios operacionais significativos. Com 737 registros documentados e 71,5% classificados como Alto ou Médio, 
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

import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileWarning, 
  TrendingUp,
  Activity,
  MapPin
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Dados extraídos da análise
const stats = {
  total: 737,
  alto: 276,
  medio: 251,
  baixo: 163,
  concluidas: 290,
  a_iniciar: 390,
  percentual_concluido: 39.3,
  percentual_alto: 37.4
};

const dadosPorGrau = [
  { name: 'Alto', value: 276, color: '#dc2626' }, // red-600
  { name: 'Médio', value: 251, color: '#f59e0b' }, // amber-500
  { name: 'Baixo', value: 163, color: '#10b981' }, // emerald-500
  { name: 'Crítico', value: 2, color: '#7f1d1d' }, // red-900
];

const topAreas = [
  { name: 'Xarope', value: 45 },
  { name: 'SPX', value: 43 },
  { name: 'JBT', value: 26 },
  { name: 'Mistura Líquida', value: 24 },
  { name: 'CDM', value: 24 },
  { name: 'Padronização', value: 24 },
  { name: 'Caldeira', value: 19 },
];

const statusAcoes = [
  { name: 'A Iniciar', value: 390, color: '#ef4444' },
  { name: 'Concluída', value: 290, color: '#10b981' },
  { name: 'Cancelada', value: 12, color: '#6b7280' },
  { name: 'Outros', value: 6, color: '#3b82f6' },
];

const evolucaoAnual = [
  { ano: '2024', registros: 244 },
  { ano: '2025', registros: 448 },
];

export default function Home() {
  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
              Visão Geral de Riscos
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitoramento em tempo real das condições de SST e planos de ação.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-full border shadow-sm">
            <Clock className="h-4 w-4" />
            <span>Última atualização: Jan 07, 2026</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total de Registros" 
            value={stats.total} 
            icon={FileWarning}
            description="Condições identificadas"
            trend={{ value: 83.6, isPositive: false }}
          />
          <StatCard 
            title="Riscos Altos" 
            value={stats.alto} 
            icon={AlertTriangle}
            variant="danger"
            description={`${stats.percentual_alto}% do total`}
          />
          <StatCard 
            title="Ações Concluídas" 
            value={stats.concluidas} 
            icon={CheckCircle2}
            variant="success"
            description={`${stats.percentual_concluido}% de resolução`}
          />
          <StatCard 
            title="Ações Pendentes" 
            value={stats.a_iniciar} 
            icon={Clock}
            variant="warning"
            description="Aguardando início"
          />
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Severity Distribution */}
          <Card className="lg:col-span-1 shadow-md border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Severidade dos Riscos
              </CardTitle>
              <CardDescription>Distribuição por grau de risco</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosPorGrau}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dadosPorGrau.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Areas Chart */}
          <Card className="lg:col-span-2 shadow-md border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Áreas Críticas
              </CardTitle>
              <CardDescription>Setores com maior concentração de ocorrências</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topAreas}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20}>
                    {topAreas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${1 - index * 0.1})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Action Status */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Status das Ações
              </CardTitle>
              <CardDescription>Progresso das medidas corretivas</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusAcoes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                    {statusAcoes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Yearly Evolution */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Evolução Temporal
              </CardTitle>
              <CardDescription>Crescimento do volume de registros (2024-2025)</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evolucaoAnual} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="ano" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="registros" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts Section */}
        <Card className="border-l-4 border-l-destructive bg-destructive/5 shadow-sm">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Atenção Necessária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-background rounded-lg border border-destructive/20">
                <div className="h-2 w-2 mt-2 rounded-full bg-destructive shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Alto volume de ações "A Iniciar"</p>
                  <p className="text-sm text-muted-foreground">52.9% das ações corretivas ainda não foram iniciadas, representando um passivo de risco significativo.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-background rounded-lg border border-destructive/20">
                <div className="h-2 w-2 mt-2 rounded-full bg-destructive shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Concentração em Xarope e SPX</p>
                  <p className="text-sm text-muted-foreground">Estas duas áreas representam mais de 11% de todos os riscos identificados na fábrica.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

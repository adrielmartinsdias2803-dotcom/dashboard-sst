import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { AlertTriangle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

// Amostra de dados reais extraídos da análise
const riscos = [
  {
    id: 1,
    data: "2024-01-02",
    descricao: "Vazamento de Água sobre o Painel eletrico entrada mistura liquida",
    grau: "Alto",
    area: "Mistura Liquida",
    status: "A iniciar",
    responsavel: "MANUTENÇÃO"
  },
  {
    id: 2,
    data: "2024-01-12",
    descricao: "Ponta de vergalhão exposta no estacionamento, risco de perfuração",
    grau: "Alto",
    area: "Estacionamento",
    status: "A iniciar",
    responsavel: "FACILETES"
  },
  {
    id: 3,
    data: "2024-02-05",
    descricao: "Plataforma do Triblender do Xarope esta muito escorregadia",
    grau: "Médio",
    area: "Xarope",
    status: "Concluída",
    responsavel: "MANUTENÇÃO"
  },
  {
    id: 4,
    data: "2024-02-06",
    descricao: "Painel Elétrico danificado com risco de choque elétrico",
    grau: "Alto",
    area: "Mistura Liquida",
    status: "Concluída",
    responsavel: "MANUTENÇÃO"
  },
  {
    id: 5,
    data: "2024-02-08",
    descricao: "Falta de chuveiro lava olhos no setor SIG 2",
    grau: "Baixo",
    area: "TP",
    status: "A iniciar",
    responsavel: "MANUTENÇÃO"
  },
  {
    id: 6,
    data: "2024-02-13",
    descricao: "Pisos em diversas áreas precisando de manutenção (risco com paleteira)",
    grau: "Alto",
    area: "Industria",
    status: "Concluída",
    responsavel: "MANUTENÇÃO"
  },
  {
    id: 7,
    data: "2024-02-17",
    descricao: "Falta de Lampada Piloto na torre Chaminé da Caldeira",
    grau: "Alto",
    area: "Caldeira",
    status: "A iniciar",
    responsavel: "MANUTENÇÃO"
  },
  {
    id: 8,
    data: "2024-02-22",
    descricao: "Docas sem guarda-corpos, risco de queda",
    grau: "Alto",
    area: "CDM",
    status: "Concluída",
    responsavel: "Adriana Bueno"
  },
  {
    id: 9,
    data: "2024-03-08",
    descricao: "Piso da escada do xarope esta afundando",
    grau: "Médio",
    area: "Padronização Xarope",
    status: "A iniciar",
    responsavel: "MANUTENÇÃO"
  },
  {
    id: 10,
    data: "2024-03-12",
    descricao: "Vazamento de Diesel da bomba do sistema de combate a incendio",
    grau: "Alto",
    area: "CDM",
    status: "A iniciar",
    responsavel: "Ednilson"
  }
];

export default function Riscos() {
  const getBadgeVariant = (grau: string) => {
    switch (grau.toLowerCase()) {
      case 'alto': return 'destructive';
      case 'médio': return 'secondary'; // Using secondary for amber/warning look via CSS
      case 'baixo': return 'outline';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluída': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'a iniciar': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
              Registro de Riscos
            </h1>
            <p className="text-muted-foreground mt-1">
              Listagem detalhada das condições de risco identificadas.
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
        </div>

        <Card className="shadow-md border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Últimos Registros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Data</TableHead>
                    <TableHead>Descrição do Risco</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Grau</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riscos.map((risco) => (
                    <TableRow key={risco.id}>
                      <TableCell className="font-medium text-muted-foreground">
                        {new Date(risco.data).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate font-medium" title={risco.descricao}>
                          {risco.descricao}
                        </div>
                      </TableCell>
                      <TableCell>{risco.area}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(risco.grau)} className="uppercase text-[10px] tracking-wider font-bold">
                          {risco.grau}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {risco.responsavel}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(risco.status)}`}>
                          {risco.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

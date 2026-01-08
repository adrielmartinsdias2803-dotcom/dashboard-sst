import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle2,
  ArrowLeft,
  Send,
  Mail
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

interface FormData {
  dataRota: string;
  horaRota: string;
  setor: string;
  tecnicoSST: string;
  representanteManutenção: string;
  representanteProducao: string;
  convidados: string;
  observacoes: string;
  emailNotificacao: string;
}

export default function AgendarRota() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    dataRota: "",
    horaRota: "",
    setor: "",
    tecnicoSST: "",
    representanteManutenção: "",
    representanteProducao: "",
    convidados: "",
    observacoes: "",
    emailNotificacao: "",
  });

  const setores = [
    "Xarope",
    "SPX",
    "Produção",
    "Manutenção",
    "Almoxarifado",
    "Qualidade",
    "PCP",
    "Administrativo",
  ];

  // Mutation para criar rota
  const criarRotaMutation = trpc.rotas.createRota.useMutation({
    onSuccess: () => {
      toast.success("✅ Rota agendada com sucesso! Verifique no painel de administração.");
      
      // Resetar formulário
      setFormData({
        dataRota: "",
        horaRota: "",
        setor: "",
        tecnicoSST: "",
        representanteManutenção: "",
        representanteProducao: "",
        convidados: "",
        observacoes: "",
        emailNotificacao: "",
      });

      // Voltar para home após 2 segundos
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    },
    onError: (error: any) => {
      toast.error(`❌ Erro ao agendar: ${error.message}`);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.dataRota || !formData.horaRota || !formData.setor || !formData.tecnicoSST || 
        !formData.representanteManutenção || !formData.representanteProducao) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Salvar rota no banco de dados
      await criarRotaMutation.mutateAsync({
        dataRota: formData.dataRota,
        horaRota: formData.horaRota,
        setor: formData.setor,
        tecnicoSST: formData.tecnicoSST,
        representanteManutenção: formData.representanteManutenção,
        representanteProducao: formData.representanteProducao,
        convidados: formData.convidados || undefined,
        observacoes: formData.observacoes || undefined,
      });
    } catch (error) {
      // Erro já é tratado pelo mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-primary via-blue-700 to-primary/90 text-white py-8 px-4 md:px-8 shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Voltar</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Agendar Rota de Segurança</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-yellow-50 border-b border-slate-100">
            <CardTitle className="flex items-center gap-3 text-primary">
              <Calendar className="h-6 w-6" />
              Formulário de Agendamento
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              Preencha os dados abaixo para agendar uma rota de segurança. Prazo máximo: 45 dias.
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Seção 1: Informações da Rota */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Informações da Rota
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Data da Rota *
                    </label>
                    <input
                      type="date"
                      name="dataRota"
                      value={formData.dataRota}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Hora da Rota *
                    </label>
                    <input
                      type="time"
                      name="horaRota"
                      value={formData.horaRota}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Setor a Inspecionar *
                    </label>
                    <select
                      name="setor"
                      value={formData.setor}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Selecione um setor...</option>
                      {setores.map((setor) => (
                        <option key={setor} value={setor}>
                          {setor}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Seção 2: Participantes */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participantes (Obrigatórios)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Técnico de Segurança (SST) *
                    </label>
                    <input
                      type="text"
                      name="tecnicoSST"
                      value={formData.tecnicoSST}
                      onChange={handleInputChange}
                      placeholder="Nome do técnico"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Representante da Manutenção *
                    </label>
                    <input
                      type="text"
                      name="representanteManutenção"
                      value={formData.representanteManutenção}
                      onChange={handleInputChange}
                      placeholder="Nome do representante"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Representante da Produção *
                    </label>
                    <input
                      type="text"
                      name="representanteProducao"
                      value={formData.representanteProducao}
                      onChange={handleInputChange}
                      placeholder="Nome do representante"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 3: Convidados */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Convidados (Opcional)
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Departamentos/Pessoas Convidadas
                  </label>
                  <textarea
                    name="convidados"
                    value={formData.convidados}
                    onChange={handleInputChange}
                    placeholder="Ex: PCP (João Silva), Qualidade (Maria Santos), Almoxarifado, etc."
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                  <p className="text-xs text-slate-500 mt-1">
                    Você pode convidar: PCP, Qualidade, Almoxarifado, Melhoria Contínua, Diretoria, Facilities, Meio Ambiente, Pesquisa e Desenvolvimento
                  </p>
                </div>
              </div>

              {/* Seção 4: Observações */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Observações Adicionais
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Informações Complementares
                  </label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    placeholder="Adicione qualquer informação relevante para a rota..."
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>
              </div>

              {/* Seção 5: Email de Notificação */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Notificação por Email (Opcional)
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email para Receber Confirmação
                  </label>
                  <input
                    type="email"
                    name="emailNotificacao"
                    value={formData.emailNotificacao}
                    onChange={handleInputChange}
                    placeholder="seu.email@mococa.com.br"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Se preenchido, você poderá enviar a confirmação da rota por email após o agendamento.
                  </p>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">ℹ️ Informação importante:</span> A rota será agendada imediatamente e aparecerá no painel de administração. Você poderá enviar a confirmação por email de forma manual. A rota deve ser realizada dentro de 45 dias a partir da data de agendamento.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 justify-end border-t pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="px-6 py-2"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 px-6 py-2 bg-gradient-to-r from-primary to-blue-700 hover:from-primary/90 hover:to-blue-700/90"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Agendando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Agendar Rota
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Prazo</h4>
                  <p className="text-sm text-slate-600 mt-1">45 dias para agendar a rota</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Participantes</h4>
                  <p className="text-sm text-slate-600 mt-1">Mínimo 3 obrigatórios</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Confirmação</h4>
                  <p className="text-sm text-slate-600 mt-1">Você controla o envio de email</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

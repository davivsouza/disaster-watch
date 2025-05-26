"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Home,
  Briefcase,
  Users,
  Phone,
  Clock,
  Zap,
  Wind,
  Waves,
  Thermometer,
  Heart,
  Download,
} from "lucide-react"
import Link from "next/link"

const emergencyContacts = [
  { name: "Bombeiros", number: "193", description: "Incêndios e resgates" },
  { name: "SAMU", number: "192", description: "Emergências médicas" },
  { name: "Polícia Militar", number: "190", description: "Segurança pública" },
  { name: "Defesa Civil", number: "199", description: "Desastres naturais" },
]

const emergencyKit = [
  { item: "Água potável", quantity: "4 litros por pessoa por dia", priority: "high" },
  { item: "Alimentos não perecíveis", quantity: "3 dias de suprimento", priority: "high" },
  { item: "Medicamentos essenciais", quantity: "7 dias de suprimento", priority: "high" },
  { item: "Lanterna e pilhas", quantity: "1 por pessoa", priority: "high" },
  { item: "Rádio portátil", quantity: "1 unidade", priority: "medium" },
  { item: "Kit de primeiros socorros", quantity: "1 completo", priority: "high" },
  { item: "Documentos importantes", quantity: "Cópias em saco plástico", priority: "high" },
  { item: "Dinheiro em espécie", quantity: "Quantia pequena", priority: "medium" },
  { item: "Roupas extras", quantity: "1 muda por pessoa", priority: "medium" },
  { item: "Cobertores", quantity: "1 por pessoa", priority: "medium" },
]

const disasterPreparation = {
  earthquake: {
    title: "Terremotos",
    icon: Zap,
    before: [
      "Identifique locais seguros em cada cômodo (sob mesas resistentes, vãos de portas)",
      "Fixe móveis pesados e objetos que podem cair",
      "Mantenha um kit de emergência acessível",
      "Saiba como desligar gás, água e eletricidade",
      "Pratique exercícios de evacuação com a família",
    ],
    during: [
      "Abaixe-se, cubra-se e segure-se",
      "Se estiver dentro, fique longe de janelas e objetos que podem cair",
      "Se estiver fora, afaste-se de prédios, árvores e fios elétricos",
      "Se estiver dirigindo, pare em local seguro e permaneça no veículo",
    ],
    after: [
      "Verifique ferimentos e preste primeiros socorros",
      "Inspecione sua casa em busca de danos",
      "Use sapatos resistentes para proteger os pés de vidros quebrados",
      "Esteja preparado para réplicas",
    ],
  },
  flood: {
    title: "Enchentes",
    icon: Waves,
    before: [
      "Conheça o risco de enchentes em sua área",
      "Tenha um plano de evacuação",
      "Mantenha documentos importantes em local alto e seco",
      "Considere um seguro contra enchentes",
      "Identifique terrenos mais altos para evacuação",
    ],
    during: [
      "Mova-se para terrenos mais altos imediatamente",
      "Evite caminhar ou dirigir em águas em movimento",
      "Fique longe de linhas de energia derrubadas",
      "Ouça as autoridades locais para instruções de evacuação",
    ],
    after: [
      "Retorne para casa apenas quando as autoridades disserem que é seguro",
      "Evite água de enchente - pode estar contaminada",
      "Documente danos para o seguro",
      "Limpe e desinfete tudo que foi tocado pela água da enchente",
    ],
  },
  hurricane: {
    title: "Furacões",
    icon: Wind,
    before: [
      "Monitore previsões meteorológicas",
      "Prepare sua casa (janelas, portas, objetos soltos)",
      "Estoque suprimentos para pelo menos 7 dias",
      "Conheça sua zona de evacuação",
      "Tenha um plano de comunicação familiar",
    ],
    during: [
      "Fique em casa se não estiver em zona de evacuação",
      "Permaneça longe de janelas e portas de vidro",
      "Vá para o cômodo mais seguro da casa",
      "Não saia durante o olho da tempestade",
    ],
    after: [
      "Continue ouvindo notícias para informações de segurança",
      "Não saia até que as autoridades digam que é seguro",
      "Cuidado com linhas de energia derrubadas",
      "Use geradores apenas ao ar livre",
    ],
  },
  wildfire: {
    title: "Incêndios Florestais",
    icon: Thermometer,
    before: [
      "Crie espaço defensável ao redor de sua casa",
      "Use materiais resistentes ao fogo na construção",
      "Tenha múltiplas rotas de evacuação planejadas",
      "Mantenha documentos importantes prontos para levar",
      "Registre-se para alertas de emergência locais",
    ],
    during: [
      "Evacue imediatamente se ordenado",
      "Se preso, vá para uma área com pouca vegetação",
      "Ligue para o corpo de bombeiros",
      "Monitore rádio ou TV para informações",
    ],
    after: [
      "Retorne apenas quando as autoridades permitirem",
      "Cuidado com cinzas quentes e brasas",
      "Verifique o telhado e área ao redor em busca de brasas",
      "Documente danos para o seguro",
    ],
  },
}

export default function PreparacaoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <ArrowLeft className="h-5 w-5" />
                <span>Voltar</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Guia de Preparação</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="emergency-kit">Kit de Emergência</TabsTrigger>
            <TabsTrigger value="disasters">Por Tipo de Desastre</TabsTrigger>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <Home className="h-5 w-5" />
                    <span>Prepare sua Casa</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Kit de emergência completo</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Plano de evacuação familiar</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Documentos importantes seguros</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-800">
                    <Users className="h-5 w-5" />
                    <span>Prepare sua Família</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Ensine procedimentos de segurança</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Pratique simulações regulares</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Defina pontos de encontro</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-800">
                    <Briefcase className="h-5 w-5" />
                    <span>Prepare seu Trabalho</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-orange-700">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Conheça rotas de evacuação</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Participe de treinamentos</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Mantenha kit no escritório</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Basic Preparedness Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Passos Básicos de Preparação</CardTitle>
                <CardDescription>
                  Siga estes passos fundamentais para estar preparado para qualquer emergência
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Antes da Emergência</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600">1</span>
                        </div>
                        <div>
                          <div className="font-medium">Monte um kit de emergência</div>
                          <div className="text-sm text-gray-600">Água, comida, medicamentos e suprimentos básicos</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600">2</span>
                        </div>
                        <div>
                          <div className="font-medium">Crie um plano familiar</div>
                          <div className="text-sm text-gray-600">Rotas de evacuação e pontos de encontro</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-blue-600">3</span>
                        </div>
                        <div>
                          <div className="font-medium">Mantenha-se informado</div>
                          <div className="text-sm text-gray-600">Configure alertas e monitore notícias</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Durante a Emergência</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-red-600">1</span>
                        </div>
                        <div>
                          <div className="font-medium">Mantenha a calma</div>
                          <div className="text-sm text-gray-600">Pense claramente e siga seu plano</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-red-600">2</span>
                        </div>
                        <div>
                          <div className="font-medium">Siga as autoridades</div>
                          <div className="text-sm text-gray-600">
                            Obedeça ordens de evacuação e orientações oficiais
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-red-600">3</span>
                        </div>
                        <div>
                          <div className="font-medium">Comunique-se</div>
                          <div className="text-sm text-gray-600">Informe familiares sobre sua situação</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency-kit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kit de Emergência Essencial</CardTitle>
                <CardDescription>
                  Mantenha estes itens sempre prontos e acessíveis para situações de emergência
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {emergencyKit.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle
                          className={`h-5 w-5 ${item.priority === "high" ? "text-red-500" : "text-yellow-500"}`}
                        />
                        <div>
                          <div className="font-medium">{item.item}</div>
                          <div className="text-sm text-gray-600">{item.quantity}</div>
                        </div>
                      </div>
                      <Badge variant={item.priority === "high" ? "destructive" : "secondary"}>
                        {item.priority === "high" ? "Essencial" : "Importante"}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">Dicas Importantes</div>
                      <ul className="text-sm text-blue-800 mt-2 space-y-1">
                        <li>• Verifique e atualize seu kit a cada 6 meses</li>
                        <li>• Substitua água e alimentos próximos ao vencimento</li>
                        <li>• Mantenha o kit em local de fácil acesso</li>
                        <li>• Considere kits adicionais para carro e trabalho</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disasters" className="space-y-6">
            <div className="grid gap-6">
              {Object.entries(disasterPreparation).map(([key, disaster]) => {
                const Icon = disaster.icon
                return (
                  <Card key={key}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <span>{disaster.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>Antes</span>
                          </h4>
                          <ul className="space-y-2">
                            {disaster.before.map((item, index) => (
                              <li key={index} className="text-sm flex items-start space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-orange-800 mb-3 flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Durante</span>
                          </h4>
                          <ul className="space-y-2">
                            {disaster.during.map((item, index) => (
                              <li key={index} className="text-sm flex items-start space-x-2">
                                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                            <Heart className="h-4 w-4" />
                            <span>Depois</span>
                          </h4>
                          <ul className="space-y-2">
                            {disaster.after.map((item, index) => (
                              <li key={index} className="text-sm flex items-start space-x-2">
                                <Heart className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Contatos de Emergência</span>
                  </CardTitle>
                  <CardDescription>Números importantes para situações de emergência no Brasil</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-gray-600">{contact.description}</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{contact.number}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Plano de Comunicação Familiar</span>
                  </CardTitle>
                  <CardDescription>Configure um plano para manter contato com sua família</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium mb-2">Contato fora da região</div>
                      <div className="text-sm text-gray-600">
                        Escolha um parente ou amigo em outra cidade como ponto de contato central
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium mb-2">Pontos de encontro</div>
                      <div className="text-sm text-gray-600">
                        Defina dois locais: um próximo à sua casa e outro fora do bairro
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium mb-2">Informações importantes</div>
                      <div className="text-sm text-gray-600">
                        Mantenha uma lista com números de telefone, endereços e informações médicas
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Modelo de Plano
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

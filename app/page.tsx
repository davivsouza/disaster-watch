"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertTriangle,
  Zap,
  Thermometer,
  Wind,
  Waves,
  MapPin,
  Clock,
  Users,
  Shield,
  RefreshCw,
  ExternalLink,
  Mountain,
  Snowflake,
  Sun,
} from "lucide-react"
import Link from "next/link"
import { fetchAllDisasters, fetchDisasterStats, type DisasterEvent } from "@/lib/disaster-api"

const disasterIcons = {
  earthquake: Zap,
  hurricane: Wind,
  flood: Waves,
  wildfire: Thermometer,
  tornado: Wind,
  heatwave: Sun,
  volcano: Mountain,
  drought: Sun,
  dust: Wind,
  landslide: Mountain,
  ice: Snowflake,
  snow: Snowflake,
  water: Waves,
  other: AlertTriangle,
}

const disasterLabels = {
  earthquake: "Terremoto",
  hurricane: "Furacão/Tempestade",
  flood: "Enchente",
  wildfire: "Incêndio Florestal",
  tornado: "Tornado",
  heatwave: "Onda de Calor",
  volcano: "Vulcão",
  drought: "Seca",
  dust: "Tempestade de Areia",
  landslide: "Deslizamento",
  ice: "Gelo Marinho",
  snow: "Neve",
  water: "Mudança na Água",
  other: "Outros",
}

const severityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200",
}

const severityLabels = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
  critical: "Crítico",
}

export default function HomePage() {
  const [disasters, setDisasters] = useState<DisasterEvent[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [disasterData, statsData] = await Promise.all([fetchAllDisasters(), fetchDisasterStats()])
      setDisasters(disasterData)
      setStats(statsData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // Atualizar dados a cada 10 minutos
    const interval = setInterval(loadData, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("pt-BR")
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pt-BR").format(num)
  }

  const getEstimatedAffected = (disaster: DisasterEvent) => {
    // Estimativa baseada no tipo e severidade
    const baseNumbers = {
      earthquake: { low: 1000, medium: 5000, high: 25000, critical: 100000 },
      wildfire: { low: 500, medium: 2000, high: 10000, critical: 50000 },
      hurricane: { low: 10000, medium: 50000, high: 200000, critical: 1000000 },
      flood: { low: 2000, medium: 10000, high: 50000, critical: 200000 },
      volcano: { low: 5000, medium: 15000, high: 75000, critical: 300000 },
      other: { low: 1000, medium: 5000, high: 20000, critical: 100000 },
    }

    const categoryBase = baseNumbers[disaster.category as keyof typeof baseNumbers] || baseNumbers.other
    return categoryBase[disaster.severity]
  }

  if (loading && disasters.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">DisasterWatch</h1>
              </div>
              <nav className="flex space-x-6">
                <Link href="/" className="text-blue-600 font-medium">
                  Dashboard
                </Link>
                <Link href="/map" className="text-gray-600 hover:text-blue-600">
                  Mapa
                </Link>
                <Link href="/alerts" className="text-gray-600 hover:text-blue-600">
                  Alertas
                </Link>
                <Link href="/preparacao" className="text-gray-600 hover:text-blue-600">
                  Preparação
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    )
  }

  const activeAlerts = disasters.filter((d) => d.severity === "critical" || d.severity === "high").length
  const totalAffected = disasters.reduce((sum, d) => sum + getEstimatedAffected(d), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">DisasterWatch</h1>
              <Badge variant="outline" className="ml-2">
                Dados Reais
              </Badge>
            </div>
            <nav className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={loadData}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                <span>Atualizar</span>
              </Button>
              <Link href="/" className="text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link href="/mapa-detalhado" className="text-gray-600 hover:text-blue-600">
                Mapa Detalhado
              </Link>
              <Link href="/alerts" className="text-gray-600 hover:text-blue-600">
                Alertas
              </Link>
              <Link href="/preparacao" className="text-gray-600 hover:text-blue-600">
                Preparação
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data Source Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900">Dados em Tempo Real</span>
            </div>
            <div className="text-sm text-blue-700">
              {lastUpdated && `Última atualização: ${formatTimestamp(lastUpdated.toISOString())}`}
            </div>
          </div>
          <p className="text-sm text-blue-800 mt-2">
            Dados fornecidos pela NASA EONET e USGS - Atualizados automaticamente a cada 10 minutos
          </p>
        </div>

        {/* Alert Banner */}
        {activeAlerts > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Alertas Ativos</AlertTitle>
            <AlertDescription className="text-red-700">
              {activeAlerts} evento(s) de alta severidade em andamento. Mantenha-se informado e siga as orientações
              locais.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos Ativos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
              <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pessoas Afetadas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalAffected)}</div>
              <p className="text-xs text-muted-foreground">Estimativa total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.criticalEvents || 0}</div>
              <p className="text-xs text-muted-foreground">Requer ação imediata</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Regiões Afetadas</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.countries || 0}</div>
              <p className="text-xs text-muted-foreground">Países/regiões</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="recent" className="space-y-6">
          <TabsList>
            <TabsTrigger value="recent">Eventos Recentes</TabsTrigger>
            <TabsTrigger value="critical">Críticos</TabsTrigger>
            <TabsTrigger value="by-type">Por Tipo</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <div className="grid gap-4">
              {disasters.slice(0, 10).map((disaster) => {
                const Icon = disasterIcons[disaster.category as keyof typeof disasterIcons] || AlertTriangle
                return (
                  <Card key={disaster.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{disaster.title}</CardTitle>
                            <CardDescription className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{disaster.location.name || disaster.description}</span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={severityColors[disaster.severity]}>
                            {severityLabels[disaster.severity]}
                          </Badge>
                          <Badge variant="outline">{disaster.source}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{disaster.description}</p>
                      {disaster.magnitude && (
                        <div className="mb-2">
                          <span className="text-sm font-medium">Magnitude: </span>
                          <span className="text-sm">{disaster.magnitude.toFixed(1)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTimestamp(disaster.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>~{formatNumber(getEstimatedAffected(disaster))} pessoas</span>
                          </div>
                        </div>
                        {disaster.url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={disaster.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="critical">
            <div className="grid gap-4">
              {disasters
                .filter((d) => d.severity === "critical")
                .map((disaster) => {
                  const Icon = disasterIcons[disaster.category as keyof typeof disasterIcons] || AlertTriangle
                  return (
                    <Card key={disaster.id} className="border-red-200 bg-red-50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                              <Icon className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-red-900">{disaster.title}</CardTitle>
                              <CardDescription className="flex items-center space-x-2 text-red-700">
                                <MapPin className="h-4 w-4" />
                                <span>{disaster.location.name || disaster.description}</span>
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-red-600 text-white">CRÍTICO</Badge>
                            <Badge variant="outline">{disaster.source}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-red-800 mb-4">{disaster.description}</p>
                        {disaster.magnitude && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-red-900">Magnitude: </span>
                            <span className="text-sm text-red-800">{disaster.magnitude.toFixed(1)}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm text-red-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatTimestamp(disaster.date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>~{formatNumber(getEstimatedAffected(disaster))} pessoas</span>
                            </div>
                          </div>
                          {disaster.url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={disaster.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              {disasters.filter((d) => d.severity === "critical").length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento crítico</h3>
                    <p className="text-gray-600">Não há eventos críticos ativos no momento.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="by-type">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(disasterIcons).map(([type, Icon]) => {
                const typeDisasters = disasters.filter((d) => d.category === type)
                const label = disasterLabels[type as keyof typeof disasterLabels] || type

                return (
                  <Card key={type}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle>{label}</CardTitle>
                          <CardDescription>{typeDisasters.length} eventos ativos</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {typeDisasters.length > 0 ? (
                        <div className="space-y-2">
                          {typeDisasters.slice(0, 3).map((disaster) => (
                            <div key={disaster.id} className="text-sm">
                              <div className="font-medium">{disaster.location.name || disaster.title}</div>
                              <div className="text-gray-500 flex items-center justify-between">
                                <span>{formatTimestamp(disaster.date)}</span>
                                <Badge className={severityColors[disaster.severity]} variant="outline">
                                  {severityLabels[disaster.severity]}
                                </Badge>
                              </div>
                            </div>
                          ))}
                          {typeDisasters.length > 3 && (
                            <div className="text-sm text-blue-600">+{typeDisasters.length - 3} mais eventos</div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Nenhum evento ativo</p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-auto p-4 flex-col space-y-2">
              <Link href="/alerts">
                <AlertTriangle className="h-6 w-6" />
                <span>Configurar Alertas</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Link href="/mapa-detalhado">
                <MapPin className="h-6 w-6" />
                <span>Mapa Detalhado</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Link href="/preparacao">
                <Shield className="h-6 w-6" />
                <span>Guia de Preparação</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

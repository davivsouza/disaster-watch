"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MapPin,
  Search,
  Filter,
  Zap,
  Wind,
  Waves,
  Thermometer,
  Shield,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Mountain,
  Snowflake,
  Sun,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { fetchAllDisasters, type DisasterEvent } from "@/lib/disaster-api"

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
  earthquake: "Terremotos",
  hurricane: "Furacões/Tempestades",
  flood: "Enchentes",
  wildfire: "Incêndios",
  tornado: "Tornados",
  heatwave: "Ondas de Calor",
  volcano: "Vulcões",
  drought: "Secas",
  dust: "Tempestades de Areia",
  landslide: "Deslizamentos",
  ice: "Gelo Marinho",
  snow: "Neve",
  water: "Mudanças na Água",
  other: "Outros",
}

const severityColors = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
}

const severityLabels = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
  critical: "Crítico",
}

export default function MapPage() {
  const [disasters, setDisasters] = useState<DisasterEvent[]>([])
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterEvent | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchAllDisasters()
      setDisasters(data)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredDisasters = disasters.filter((disaster) => {
    const matchesType = filterType === "all" || disaster.category === filterType
    const matchesSearch =
      (disaster.location.name || disaster.description).toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("pt-BR")
  }

  const getEstimatedAffected = (disaster: DisasterEvent) => {
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
              <h1 className="text-2xl font-bold text-gray-900">Mapa Global de Desastres</h1>
              <Badge variant="outline">Dados Reais</Badge>
            </div>
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
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters and List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filtros</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por localização..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de desastre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {Object.entries(disasterLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Disaster List */}
            <Card>
              <CardHeader>
                <CardTitle>Eventos Ativos ({filteredDisasters.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="p-3 border rounded-lg">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    ))
                  : filteredDisasters.map((disaster) => {
                      const Icon = disasterIcons[disaster.category as keyof typeof disasterIcons] || AlertTriangle
                      return (
                        <div
                          key={disaster.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedDisaster?.id === disaster.id
                              ? "bg-blue-50 border-blue-200"
                              : "bg-white hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedDisaster(disaster)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Icon className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{disaster.title}</div>
                                <div className="text-xs text-gray-500 flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{disaster.location.name || disaster.description}</span>
                                </div>
                                {disaster.magnitude && (
                                  <div className="text-xs text-gray-600">
                                    Magnitude: {disaster.magnitude.toFixed(1)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge
                                className={`text-xs ${
                                  disaster.severity === "critical"
                                    ? "bg-red-100 text-red-800"
                                    : disaster.severity === "high"
                                      ? "bg-orange-100 text-orange-800"
                                      : disaster.severity === "medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                }`}
                              >
                                {severityLabels[disaster.severity]}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {disaster.source}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )
                    })}
              </CardContent>
            </Card>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Mapa Mundial</CardTitle>
                <CardDescription>
                  Visualização em tempo real de desastres naturais ao redor do mundo (NASA EONET + USGS)
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                {/* Simulated Map */}
                <div className="relative w-full h-full bg-gradient-to-br from-blue-200 to-green-200 rounded-lg overflow-hidden">
                  {/* World Map Background */}
                  <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=800')] bg-cover bg-center opacity-20" />

                  {/* Disaster Markers */}
                  {filteredDisasters.map((disaster) => {
                    const Icon = disasterIcons[disaster.category as keyof typeof disasterIcons] || AlertTriangle
                    // Simulate positioning based on coordinates
                    const x = ((disaster.location.coordinates[1] + 180) / 360) * 100
                    const y = ((90 - disaster.location.coordinates[0]) / 180) * 100

                    return (
                      <div
                        key={disaster.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                          selectedDisaster?.id === disaster.id ? "z-20" : "z-10"
                        }`}
                        style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` }}
                        onClick={() => setSelectedDisaster(disaster)}
                      >
                        <div className={`relative`}>
                          {/* Pulse animation for critical disasters */}
                          {disaster.severity === "critical" && (
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                          )}

                          {/* Marker */}
                          <div
                            className={`relative w-8 h-8 ${severityColors[disaster.severity]} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}
                          >
                            <Icon className="h-4 w-4 text-white" />
                          </div>

                          {/* Tooltip */}
                          {selectedDisaster?.id === disaster.id && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white p-3 rounded-lg shadow-lg border min-w-[250px]">
                              <div className="font-medium">{disaster.title}</div>
                              <div className="text-sm text-gray-600">
                                {disaster.location.name || disaster.description}
                              </div>
                              {disaster.magnitude && (
                                <div className="text-sm text-gray-600">Magnitude: {disaster.magnitude.toFixed(1)}</div>
                              )}
                              <div className="text-xs text-gray-500 mt-1">
                                ~{new Intl.NumberFormat("pt-BR").format(getEstimatedAffected(disaster))} pessoas
                                afetadas
                              </div>
                              <div className="text-xs text-gray-500">{formatTimestamp(disaster.date)}</div>
                              <div className="flex items-center justify-between mt-2">
                                <Badge
                                  className={`text-xs ${
                                    disaster.severity === "critical"
                                      ? "bg-red-100 text-red-800"
                                      : disaster.severity === "high"
                                        ? "bg-orange-100 text-orange-800"
                                        : disaster.severity === "medium"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {severityLabels[disaster.severity]}
                                </Badge>
                                {disaster.url && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={disaster.url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {/* Map Legend */}
                  <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                    <div className="text-sm font-medium mb-2">Severidade</div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-xs">Baixa</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="text-xs">Média</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full" />
                        <span className="text-xs">Alta</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs">Crítica</span>
                      </div>
                    </div>
                  </div>

                  {/* Data Sources */}
                  <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg">
                    <div className="text-xs font-medium mb-1">Fontes de Dados</div>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <div>NASA EONET</div>
                      <div>USGS Earthquakes</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  Filter,
  Shield,
  ArrowLeft,
  RefreshCw,
  Download,
  Share2,
  AlertTriangle,
  Globe,
  Navigation,
  Clock,
  Users,
  Zap,
  Wind,
  Waves,
  Thermometer,
  Mountain,
  Snowflake,
  Sun,
  MapPin,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { fetchAllDisasters, type DisasterEvent } from "@/lib/disaster-api"
import GoogleMap from "@/components/google-map"

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

const severityLabels = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
  critical: "Crítico",
}

export default function MapaDetalhadoPage() {
  const [disasters, setDisasters] = useState<DisasterEvent[]>([])
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterEvent | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchAllDisasters()
      setDisasters(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // Atualizar dados a cada 5 minutos
    const interval = setInterval(loadData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredDisasters = disasters.filter((disaster) => {
    const matchesType = filterType === "all" || disaster.category === filterType
    const matchesSeverity = filterSeverity === "all" || disaster.severity === filterSeverity
    const matchesSearch =
      (disaster.location.name || disaster.description).toLowerCase().includes(searchTerm.toLowerCase()) ||
      disaster.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSeverity && matchesSearch
  })

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("pt-BR")
  }

  const formatCoordinates = (coordinates: [number, number]) => {
    const [lat, lng] = coordinates
    const latDir = lat >= 0 ? "N" : "S"
    const lngDir = lng >= 0 ? "E" : "W"
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`
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

  const exportData = () => {
    const dataToExport = filteredDisasters.map((disaster) => ({
      id: disaster.id,
      title: disaster.title,
      location: disaster.location.name || disaster.description,
      coordinates: formatCoordinates(disaster.location.coordinates),
      latitude: disaster.location.coordinates[0],
      longitude: disaster.location.coordinates[1],
      severity: severityLabels[disaster.severity],
      category: disasterLabels[disaster.category as keyof typeof disasterLabels] || disaster.category,
      date: formatTimestamp(disaster.date),
      magnitude: disaster.magnitude,
      source: disaster.source,
      estimatedAffected: getEstimatedAffected(disaster),
      url: disaster.url,
    }))

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `disasters-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareLocation = async () => {
    if (selectedDisaster && navigator.share) {
      try {
        await navigator.share({
          title: `Desastre: ${selectedDisaster.title}`,
          text: `${selectedDisaster.description} - Coordenadas: ${formatCoordinates(selectedDisaster.location.coordinates)}`,
          url: selectedDisaster.url || window.location.href,
        })
      } catch (error) {
        console.log("Erro ao compartilhar:", error)
      }
    }
  }

  const openInGoogleMaps = (disaster: DisasterEvent) => {
    const [lat, lng] = disaster.location.coordinates
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    window.open(url, "_blank")
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
              <h1 className="text-2xl font-bold text-gray-900">Mapa Detalhado de Desastres</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Globe className="h-3 w-3 mr-1" />
                Google Maps
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={exportData} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </Button>
              {selectedDisaster && (
                <Button variant="ghost" size="sm" onClick={shareLocation} className="flex items-center space-x-2">
                  <Share2 className="h-4 w-4" />
                  <span>Compartilhar</span>
                </Button>
              )}
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Bar */}
        <div className="mb-6 p-4 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Google Maps Ativo</span>
              </div>
              <div className="text-sm text-gray-600">
                {filteredDisasters.length} eventos visíveis de {disasters.length} totais
              </div>
              {lastUpdated && (
                <div className="text-sm text-gray-500">
                  Última atualização: {formatTimestamp(lastUpdated.toISOString())}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">NASA EONET</Badge>
              <Badge variant="outline">USGS</Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Google Maps API
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with Filters and List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filtros Avançados</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar localização..."
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

                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Severidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as severidades</SelectItem>
                    <SelectItem value="critical">Crítico</SelectItem>
                    <SelectItem value="high">Alto</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="low">Baixo</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Event List */}
            <Card>
              <CardHeader>
                <CardTitle>Eventos no Mapa</CardTitle>
                <CardDescription>Clique para focar no Google Maps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="p-3 border rounded-lg">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    ))
                  : filteredDisasters.map((disaster) => {
                      const Icon = disasterIcons[disaster.category as keyof typeof disasterIcons] || AlertTriangle
                      const isSelected = selectedDisaster?.id === disaster.id

                      return (
                        <div
                          key={disaster.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-blue-50 border-blue-200 shadow-md"
                              : "bg-white hover:bg-gray-50 hover:shadow-sm"
                          }`}
                          onClick={() => setSelectedDisaster(disaster)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="p-1.5 bg-blue-100 rounded-lg">
                              <Icon className="h-3 w-3 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{disaster.title}</div>
                              <div className="text-xs text-gray-500 truncate">
                                {disaster.location.name || disaster.description}
                              </div>
                              <div className="text-xs text-gray-400 font-mono">
                                {formatCoordinates(disaster.location.coordinates)}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    disaster.severity === "critical"
                                      ? "border-red-200 text-red-700"
                                      : disaster.severity === "high"
                                        ? "border-orange-200 text-orange-700"
                                        : disaster.severity === "medium"
                                          ? "border-yellow-200 text-yellow-700"
                                          : "border-green-200 text-green-700"
                                  }`}
                                >
                                  {severityLabels[disaster.severity]}
                                </Badge>
                                <span className="text-xs text-gray-500">{disaster.source}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
              </CardContent>
            </Card>

            {/* Selected Event Details */}
            {selectedDisaster && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detalhes do Evento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold">{selectedDisaster.title}</h3>
                    <p className="text-sm text-gray-600">{selectedDisaster.description}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Localização:</span>
                      <span className="text-right text-xs">{selectedDisaster.location.name || "Coordenadas"}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium">Coordenadas:</span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {formatCoordinates(selectedDisaster.location.coordinates)}
                      </span>
                    </div>

                    {selectedDisaster.magnitude && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Magnitude:</span>
                        <span className="font-bold text-orange-600">{selectedDisaster.magnitude.toFixed(1)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="font-medium">Pessoas Afetadas:</span>
                      <span className="font-semibold text-blue-600">
                        ~{new Intl.NumberFormat("pt-BR").format(getEstimatedAffected(selectedDisaster))}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium">Data/Hora:</span>
                      <span className="text-xs text-right">{formatTimestamp(selectedDisaster.date)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(formatCoordinates(selectedDisaster.location.coordinates))
                      }}
                    >
                      <Navigation className="h-3 w-3 mr-2" />
                      Copiar Coordenadas
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => openInGoogleMaps(selectedDisaster)}
                    >
                      <MapPin className="h-3 w-3 mr-2" />
                      Abrir no Google Maps
                    </Button>

                    {selectedDisaster.url && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={selectedDisaster.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-2" />
                          Ver Fonte Original
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Google Map */}
          <div className="lg:col-span-3">
            <Card className="h-[700px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Google Maps - Localização Precisa</span>
                    </CardTitle>
                    <CardDescription>
                      Mapa interativo com coordenadas reais dos desastres naturais em tempo real
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Tempo Real
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {filteredDisasters.length} Eventos
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-full p-0">
                <GoogleMap
                  disasters={filteredDisasters}
                  selectedDisaster={selectedDisaster}
                  onDisasterSelect={setSelectedDisaster}
                  className="h-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

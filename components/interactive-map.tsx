"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Satellite,
  MapIcon,
  Navigation,
  ExternalLink,
  AlertTriangle,
  Zap,
  Wind,
  Waves,
  Thermometer,
  Mountain,
  Snowflake,
  Sun,
} from "lucide-react"
import type { DisasterEvent } from "@/lib/disaster-api"

interface InteractiveMapProps {
  disasters: DisasterEvent[]
  selectedDisaster: DisasterEvent | null
  onDisasterSelect: (disaster: DisasterEvent | null) => void
  className?: string
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

const severityColors = {
  low: "bg-green-500 border-green-600",
  medium: "bg-yellow-500 border-yellow-600",
  high: "bg-orange-500 border-orange-600",
  critical: "bg-red-500 border-red-600",
}

const severityLabels = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
  critical: "Crítico",
}

export default function InteractiveMap({
  disasters,
  selectedDisaster,
  onDisasterSelect,
  className,
}: InteractiveMapProps) {
  const [mapStyle, setMapStyle] = useState<"terrain" | "satellite" | "street">("terrain")
  const [zoom, setZoom] = useState(2)
  const [center, setCenter] = useState({ lat: 20, lng: 0 })
  const mapRef = useRef<HTMLDivElement>(null)

  // Simular diferentes estilos de mapa
  const mapStyles = {
    terrain: "bg-gradient-to-br from-green-200 via-yellow-100 to-blue-200",
    satellite: "bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900",
    street: "bg-gradient-to-br from-gray-100 via-white to-gray-200",
  }

  const getMarkerPosition = (disaster: DisasterEvent) => {
    const lat = disaster.location.coordinates[0]
    const lng = disaster.location.coordinates[1]

    // Converter coordenadas geográficas para posição no mapa (simplificado)
    const x = ((lng + 180) / 360) * 100
    const y = ((90 - lat) / 180) * 100

    return {
      x: Math.max(2, Math.min(98, x)),
      y: Math.max(2, Math.min(98, y)),
    }
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

  const zoomIn = () => setZoom(Math.min(10, zoom + 1))
  const zoomOut = () => setZoom(Math.max(1, zoom - 1))
  const resetView = () => {
    setZoom(2)
    setCenter({ lat: 20, lng: 0 })
    onDisasterSelect(null)
  }

  const focusOnDisaster = (disaster: DisasterEvent) => {
    setCenter({
      lat: disaster.location.coordinates[0],
      lng: disaster.location.coordinates[1],
    })
    setZoom(6)
    onDisasterSelect(disaster)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-20 space-y-2">
        <Card className="p-2">
          <div className="flex flex-col space-y-2">
            <Button variant="outline" size="sm" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={zoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetView}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card className="p-2">
          <Select value={mapStyle} onValueChange={(value: "terrain" | "satellite" | "street") => setMapStyle(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="terrain">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4" />
                  <span>Terreno</span>
                </div>
              </SelectItem>
              <SelectItem value="satellite">
                <div className="flex items-center space-x-2">
                  <Satellite className="h-4 w-4" />
                  <span>Satélite</span>
                </div>
              </SelectItem>
              <SelectItem value="street">
                <div className="flex items-center space-x-2">
                  <MapIcon className="h-4 w-4" />
                  <span>Ruas</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 right-4 z-20">
        <Card className="p-3">
          <div className="text-sm font-medium mb-2">Severidade dos Eventos</div>
          <div className="space-y-2">
            {Object.entries(severityColors).map(([severity, colorClass]) => (
              <div key={severity} className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${colorClass} ${severity === "critical" ? "animate-pulse" : ""}`}
                />
                <span className="text-xs">{severityLabels[severity as keyof typeof severityLabels]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Coordinates Display */}
      <div className="absolute bottom-4 left-4 z-20">
        <Card className="p-2">
          <div className="text-xs text-gray-600">
            <div>Zoom: {zoom}x</div>
            <div>
              Centro: {center.lat.toFixed(2)}°, {center.lng.toFixed(2)}°
            </div>
            <div className="text-xs text-gray-500 mt-1">{disasters.length} eventos ativos</div>
          </div>
        </Card>
      </div>

      {/* Data Sources */}
      <div className="absolute bottom-4 right-4 z-20">
        <Card className="p-2">
          <div className="text-xs font-medium mb-1">Fontes de Dados</div>
          <div className="text-xs text-gray-600 space-y-0.5">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>NASA EONET</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>USGS</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Map */}
      <div
        ref={mapRef}
        className={`w-full h-full ${mapStyles[mapStyle]} rounded-lg overflow-hidden relative transition-all duration-300`}
        style={{ transform: `scale(${1 + (zoom - 2) * 0.1})` }}
      >
        {/* World Map Overlay */}
        <div className="absolute inset-0">
          {mapStyle === "terrain" && (
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1000')] bg-cover bg-center opacity-30" />
          )}
          {mapStyle === "satellite" && (
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1000')] bg-cover bg-center opacity-50 filter brightness-75" />
          )}
          {mapStyle === "street" && (
            <div className="absolute inset-0">
              {/* Grid lines for street view */}
              <svg className="w-full h-full opacity-20">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#666" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          )}
        </div>

        {/* Disaster Markers */}
        {disasters.map((disaster) => {
          const Icon = disasterIcons[disaster.category as keyof typeof disasterIcons] || AlertTriangle
          const position = getMarkerPosition(disaster)
          const isSelected = selectedDisaster?.id === disaster.id

          return (
            <div
              key={disaster.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                isSelected ? "z-30 scale-125" : "z-10 hover:scale-110"
              }`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              onClick={() => focusOnDisaster(disaster)}
            >
              <div className="relative">
                {/* Pulse animation for critical disasters */}
                {disaster.severity === "critical" && (
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                )}

                {/* Selection ring */}
                {isSelected && (
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse opacity-50 scale-150" />
                )}

                {/* Marker */}
                <div
                  className={`relative w-8 h-8 ${severityColors[disaster.severity]} rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all duration-200`}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>

                {/* Detailed Tooltip for selected disaster */}
                {isSelected && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-white p-4 rounded-lg shadow-xl border min-w-[300px] max-w-[400px]">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{disaster.title}</h3>
                          <p className="text-sm text-gray-600">{disaster.location.name || disaster.description}</p>
                        </div>
                        <Badge
                          className={`${
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
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Coordenadas:</span>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {formatCoordinates(disaster.location.coordinates)}
                          </span>
                        </div>

                        {disaster.magnitude && (
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Magnitude:</span>
                            <span className="font-bold text-orange-600">{disaster.magnitude.toFixed(1)}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="font-medium">Pessoas Afetadas:</span>
                          <span className="font-semibold text-blue-600">
                            ~{new Intl.NumberFormat("pt-BR").format(getEstimatedAffected(disaster))}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-medium">Data/Hora:</span>
                          <span className="text-gray-600">{new Date(disaster.date).toLocaleString("pt-BR")}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-medium">Fonte:</span>
                          <Badge variant="outline">{disaster.source}</Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigator.clipboard.writeText(formatCoordinates(disaster.location.coordinates))
                          }}
                        >
                          <Navigation className="h-3 w-3 mr-1" />
                          Copiar Coordenadas
                        </Button>

                        {disaster.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={disaster.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Ver Detalhes
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-white" />
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* No disasters message */}
        {disasters.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
              <p className="text-gray-600">
                Não há desastres naturais ativos no momento ou que correspondam aos filtros aplicados.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ZoomIn, ZoomOut, RotateCcw, Satellite, MapIcon, AlertTriangle, TreesIcon as Terrain } from "lucide-react"
import type { DisasterEvent } from "@/lib/disaster-api"

interface GoogleMapProps {
  disasters: DisasterEvent[]
  selectedDisaster: DisasterEvent | null
  onDisasterSelect: (disaster: DisasterEvent | null) => void
  className?: string
}

const disasterIcons = {
  earthquake: "⚡",
  hurricane: "🌀",
  flood: "🌊",
  wildfire: "🔥",
  tornado: "🌪️",
  heatwave: "☀️",
  volcano: "🌋",
  drought: "🏜️",
  dust: "💨",
  landslide: "⛰️",
  ice: "🧊",
  snow: "❄️",
  water: "💧",
  other: "⚠️",
}

const severityColors = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#f97316",
  critical: "#ef4444",
}

const severityLabels: { [key: string]: string } = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
  critical: "Crítico",
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function GoogleMap({ disasters, selectedDisaster, onDisasterSelect, className }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [mapType, setMapType] = useState<"roadmap" | "satellite" | "terrain">("roadmap")
  const [isLoaded, setIsLoaded] = useState(false)

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

  // Carregar Google Maps API
  useEffect(() => {
    if (window.google) {
      setIsLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_API_KEY}&libraries=geometry,places`
    script.async = true
    script.defer = true
    script.onload = () => setIsLoaded(true)
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  // Inicializar mapa
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return

    const googleMap = new window.google.maps.Map(mapRef.current, {
      zoom: 2,
      center: { lat: 20, lng: 0 },
      mapTypeId: mapType,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    setMap(googleMap)
  }, [isLoaded, mapType])

  // Atualizar marcadores quando disasters mudam
  useEffect(() => {
    if (!map || !window.google) return

    // Limpar marcadores existentes
    markers.forEach((marker) => marker.setMap(null))

    const newMarkers = disasters.map((disaster) => {
      const position = {
        lat: disaster.location.coordinates[0],
        lng: disaster.location.coordinates[1],
      }

      // Criar ícone customizado
      const icon = {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: disaster.severity === "critical" ? 12 : 8,
        fillColor: severityColors[disaster.severity],
        fillOpacity: 0.8,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      }

      const marker = new window.google.maps.Marker({
        position,
        map,
        icon,
        title: disaster.title,
        animation: disaster.severity === "critical" ? window.google.maps.Animation.BOUNCE : null,
      })

      // InfoWindow com detalhes
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="max-width: 300px; padding: 10px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 20px; margin-right: 8px;">${disasterIcons[disaster.category as keyof typeof disasterIcons] || "⚠️"}</span>
              <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${disaster.title}</h3>
            </div>
            
            <p style="margin: 4px 0; color: #666; font-size: 14px;">${disaster.location.name || disaster.description}</p>
            
            <div style="margin: 8px 0; font-size: 12px;">
              <div style="margin: 2px 0;"><strong>Coordenadas:</strong> ${formatCoordinates(disaster.location.coordinates)}</div>
              ${disaster.magnitude ? `<div style="margin: 2px 0;"><strong>Magnitude:</strong> ${disaster.magnitude.toFixed(1)}</div>` : ""}
              <div style="margin: 2px 0;"><strong>Pessoas Afetadas:</strong> ~${new Intl.NumberFormat("pt-BR").format(getEstimatedAffected(disaster))}</div>
              <div style="margin: 2px 0;"><strong>Data:</strong> ${new Date(disaster.date).toLocaleString("pt-BR")}</div>
              <div style="margin: 2px 0;"><strong>Fonte:</strong> ${disaster.source}</div>
            </div>
            
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
              <span style="
                background: ${severityColors[disaster.severity]}; 
                color: white; 
                padding: 2px 8px; 
                border-radius: 12px; 
                font-size: 11px; 
                font-weight: bold;
              ">
                ${severityLabels[disaster.severity]}
              </span>
              ${
                disaster.url
                  ? `<a href="${disaster.url}" target="_blank" style="color: #2563eb; text-decoration: none; font-size: 12px;">Ver Detalhes →</a>`
                  : ""
              }
            </div>
          </div>
        `,
      })

      marker.addListener("click", () => {
        // Fechar outras InfoWindows
        markers.forEach((m) => {
          if (m.infoWindow) {
            m.infoWindow.close()
          }
        })

        infoWindow.open(map, marker)
        onDisasterSelect(disaster)

        // Centralizar no marcador
        map.panTo(position)
        if (map.getZoom() < 6) {
          map.setZoom(6)
        }
      })

      marker.infoWindow = infoWindow

      return marker
    })

    setMarkers(newMarkers)
  }, [map, disasters, onDisasterSelect])

  // Focar no desastre selecionado
  useEffect(() => {
    if (!map || !selectedDisaster) return

    const position = {
      lat: selectedDisaster.location.coordinates[0],
      lng: selectedDisaster.location.coordinates[1],
    }

    map.panTo(position)
    if (map.getZoom() < 6) {
      map.setZoom(6)
    }

    // Encontrar e abrir InfoWindow do marcador selecionado
    const selectedMarker = markers.find((marker) => {
      const markerPos = marker.getPosition()
      return Math.abs(markerPos.lat() - position.lat) < 0.001 && Math.abs(markerPos.lng() - position.lng) < 0.001
    })

    if (selectedMarker && selectedMarker.infoWindow) {
      // Fechar outras InfoWindows
      markers.forEach((m) => {
        if (m.infoWindow && m !== selectedMarker) {
          m.infoWindow.close()
        }
      })
      selectedMarker.infoWindow.open(map, selectedMarker)
    }
  }, [selectedDisaster, map, markers])

  const zoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1)
    }
  }

  const zoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1)
    }
  }

  const resetView = () => {
    if (map) {
      map.setCenter({ lat: 20, lng: 0 })
      map.setZoom(2)
      onDisasterSelect(null)
      // Fechar todas as InfoWindows
      markers.forEach((marker) => {
        if (marker.infoWindow) {
          marker.infoWindow.close()
        }
      })
    }
  }

  const changeMapType = (newType: "roadmap" | "satellite" | "terrain") => {
    setMapType(newType)
    if (map) {
      map.setMapTypeId(newType)
    }
  }

  if (!isLoaded) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando Google Maps...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
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
          <Select value={mapType} onValueChange={changeMapType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roadmap">
                <div className="flex items-center space-x-2">
                  <MapIcon className="h-4 w-4" />
                  <span>Mapa</span>
                </div>
              </SelectItem>
              <SelectItem value="satellite">
                <div className="flex items-center space-x-2">
                  <Satellite className="h-4 w-4" />
                  <span>Satélite</span>
                </div>
              </SelectItem>
              <SelectItem value="terrain">
                <div className="flex items-center space-x-2">
                  <Terrain className="h-4 w-4" />
                  <span>Terreno</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="p-3">
          <div className="text-sm font-medium mb-2">Severidade dos Eventos</div>
          <div className="space-y-2">
            {Object.entries(severityColors).map(([severity, color]) => (
              <div key={severity} className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${severity === "critical" ? "animate-pulse" : ""}`}
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs">{severityLabels[severity as keyof typeof severityLabels]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Coordinates Display */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="p-2">
          <div className="text-xs text-gray-600">
            <div className="font-medium mb-1">Google Maps</div>
            <div>{disasters.length} eventos ativos</div>
            <div className="text-xs text-gray-500 mt-1">Clique nos marcadores para detalhes</div>
          </div>
        </Card>
      </div>

      {/* Data Sources */}
      <div className="absolute bottom-4 right-4 z-10">
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

      {/* Google Map Container */}
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* No disasters message */}
      {disasters.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
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
  )
}

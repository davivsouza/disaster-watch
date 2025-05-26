// NASA EONET API para eventos naturais
const EONET_API_BASE = "https://eonet.gsfc.nasa.gov/api/v3"
// USGS Earthquake API
const USGS_API_BASE = "https://earthquake.usgs.gov/earthquakes/feed/v1.0"

export interface DisasterEvent {
  id: string
  title: string
  description: string
  category: string
  location: {
    coordinates: [number, number]
    name?: string
  }
  date: string
  severity: "low" | "medium" | "high" | "critical"
  source: string
  url?: string
  magnitude?: number
  affectedArea?: string
}

export interface EarthquakeEvent {
  id: string
  properties: {
    mag: number
    place: string
    time: number
    updated: number
    tz: number
    url: string
    detail: string
    felt: number
    cdi: number
    mmi: number
    alert: string
    status: string
    tsunami: number
    sig: number
    net: string
    code: string
    ids: string
    sources: string
    types: string
    nst: number
    dmin: number
    rms: number
    gap: number
    magType: string
    type: string
    title: string
  }
  geometry: {
    type: string
    coordinates: [number, number, number]
  }
}

export interface EONETEvent {
  id: string
  title: string
  description: string
  link: string
  categories: Array<{
    id: string
    title: string
  }>
  sources: Array<{
    id: string
    url: string
  }>
  geometry: Array<{
    magnitudeValue?: number
    magnitudeUnit?: string
    date: string
    type: string
    coordinates: [number, number]
  }>
}

// Mapear categorias EONET para nossos tipos
const categoryMapping: Record<string, string> = {
  wildfires: "wildfire",
  severeStorms: "hurricane",
  floods: "flood",
  earthquakes: "earthquake",
  volcanoes: "volcano",
  drought: "drought",
  dustHaze: "dust",
  landslides: "landslide",
  manmade: "other",
  seaLakeIce: "ice",
  snow: "snow",
  tempExtremes: "heatwave",
  waterColor: "water",
}

// Determinar severidade baseada no tipo e magnitude
function determineSeverity(category: string, magnitude?: number): "low" | "medium" | "high" | "critical" {
  if (category === "earthquake" && magnitude) {
    if (magnitude >= 7.0) return "critical"
    if (magnitude >= 6.0) return "high"
    if (magnitude >= 4.0) return "medium"
    return "low"
  }

  if (category === "wildfire") return "high"
  if (category === "hurricane") return "critical"
  if (category === "flood") return "medium"
  if (category === "volcano") return "high"

  return "medium"
}

// Buscar terremotos da USGS
export async function fetchEarthquakes(): Promise<DisasterEvent[]> {
  try {
    const response = await fetch(`${USGS_API_BASE}/summary/significant_week.geojson`)
    const data = await response.json()

    return data.features.map((earthquake: EarthquakeEvent): DisasterEvent => {
      const magnitude = earthquake.properties.mag
      const coordinates: [number, number] = [
        earthquake.geometry.coordinates[1], // latitude
        earthquake.geometry.coordinates[0], // longitude
      ]

      return {
        id: earthquake.id,
        title: `Terremoto M${magnitude.toFixed(1)}`,
        description: earthquake.properties.place,
        category: "earthquake",
        location: {
          coordinates,
          name: earthquake.properties.place,
        },
        date: new Date(earthquake.properties.time).toISOString(),
        severity: determineSeverity("earthquake", magnitude),
        source: "USGS",
        url: earthquake.properties.url,
        magnitude,
        affectedArea: earthquake.properties.place,
      }
    })
  } catch (error) {
    console.error("Erro ao buscar terremotos:", error)
    return []
  }
}

// Buscar eventos da NASA EONET
export async function fetchNASAEvents(): Promise<DisasterEvent[]> {
  try {
    const response = await fetch(`${EONET_API_BASE}/events?limit=50&days=30`)
    const data = await response.json()

    return data.events.map((event: EONETEvent): DisasterEvent => {
      const category = event.categories[0]?.id || "other"
      const mappedCategory = categoryMapping[category] || "other"
      const geometry = event.geometry[event.geometry.length - 1] // Pegar a geometria mais recente

      const coordinates: [number, number] = [
        geometry.coordinates[1] || 0, // latitude
        geometry.coordinates[0] || 0, // longitude
      ]

      return {
        id: event.id,
        title: event.title,
        description: event.description || event.title,
        category: mappedCategory,
        location: {
          coordinates,
          name: event.title,
        },
        date: geometry.date,
        severity: determineSeverity(mappedCategory, geometry.magnitudeValue),
        source: "NASA EONET",
        url: event.link,
        magnitude: geometry.magnitudeValue,
        affectedArea: event.title,
      }
    })
  } catch (error) {
    console.error("Erro ao buscar eventos NASA:", error)
    return []
  }
}

// Buscar todos os desastres
export async function fetchAllDisasters(): Promise<DisasterEvent[]> {
  try {
    const [earthquakes, nasaEvents] = await Promise.all([fetchEarthquakes(), fetchNASAEvents()])

    const allEvents = [...earthquakes, ...nasaEvents]

    // Ordenar por data (mais recentes primeiro)
    return allEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Erro ao buscar desastres:", error)
    return []
  }
}

// Buscar estatísticas
export async function fetchDisasterStats() {
  const disasters = await fetchAllDisasters()

  const stats = {
    totalEvents: disasters.length,
    criticalEvents: disasters.filter((d) => d.severity === "critical").length,
    highEvents: disasters.filter((d) => d.severity === "high").length,
    countries: new Set(
      disasters.map((d) => {
        const place = d.location.name || d.description
        // Extrair país do nome do local (simplificado)
        const parts = place.split(",")
        return parts[parts.length - 1]?.trim() || "Desconhecido"
      }),
    ).size,
    byCategory: disasters.reduce(
      (acc, disaster) => {
        acc[disaster.category] = (acc[disaster.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  }

  return stats
}

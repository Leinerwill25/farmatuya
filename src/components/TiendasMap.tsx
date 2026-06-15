'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

interface Tienda {
  id: string
  nombre: string
  direccion?: string
  horario?: string
  ubicacion_mapa?: string
  lat?: number
  lng?: number
}

interface Props {
  tiendas: Tienda[]
  selectedId: string | null
  onSelect: (id: string) => void
}

// Custom marker with FarmaTuya logo
const createCustomIcon = (selected: boolean) =>
  L.divIcon({
    className: '',
    html: `
      <div style="
        position: relative;
        width: ${selected ? '52px' : '44px'};
        height: ${selected ? '62px' : '54px'};
        transition: all 0.2s ease;
        filter: drop-shadow(0 4px 10px rgba(0,0,0,0.35));
      ">
        <!-- Pin body -->
        <div style="
          width: 100%;
          height: ${selected ? '52px' : '44px'};
          background: ${selected ? '#39a900' : '#ffffff'};
          border: 3px solid ${selected ? '#2d8300' : '#0F3D93'};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          position: absolute;
          top: 0; left: 0;
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.12);
        "></div>
        <!-- Logo container (counter-rotate to keep logo upright) -->
        <div style="
          position: absolute;
          top: 4px; left: 4px;
          width: ${selected ? '38px' : '30px'};
          height: ${selected ? '38px' : '30px'};
          border-radius: 50% 50% 50% 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-45deg);
        ">
          <img
            src="/IMG_2070.PNG"
            alt="FarmaTuya"
            style="
              width: 90%;
              height: 90%;
              object-fit: contain;
              transform: rotate(45deg);
              mix-blend-mode: multiply;
            "
          />
        </div>
      </div>
    `,
    iconSize: [selected ? 52 : 44, selected ? 62 : 54],
    iconAnchor: [selected ? 26 : 22, selected ? 62 : 54],
    popupAnchor: [0, -58],
  })

export default function TiendasMap({ tiendas, selectedId, onSelect }: Props) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Venezuela center
    const map = L.map(containerRef.current, {
      center: [8.0, -66.0],
      zoom: 6,
      zoomControl: false,
    })

    // OpenStreetMap tiles (100% free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Custom zoom control position
    L.control.zoom({ position: 'topleft' }).addTo(map)

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Add/update markers when tiendas change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clear old markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current.clear()

    if (tiendas.length === 0) return

    const bounds: [number, number][] = []

    tiendas.forEach(tienda => {
      if (!tienda.lat || !tienda.lng) return

      const isSelected = tienda.id === selectedId
      const marker = L.marker([tienda.lat, tienda.lng], {
        icon: createCustomIcon(isSelected),
      })

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; min-width: 200px; padding: 4px;">
          <p style="font-size: 13px; font-weight: 900; color: #0F3D93; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px;">
            ${tienda.nombre}
          </p>
          ${tienda.direccion ? `
            <p style="font-size: 11px; color: #64748b; margin: 0 0 4px; line-height: 1.5;">
              📍 ${tienda.direccion}
            </p>
          ` : ''}
          ${tienda.horario ? `
            <p style="font-size: 11px; color: #94a3b8; margin: 0 0 10px;">
              🕐 ${tienda.horario}
            </p>
          ` : ''}
          ${tienda.ubicacion_mapa ? `
            <a href="${tienda.ubicacion_mapa}" target="_blank" rel="noreferrer"
               style="display: inline-block; background: #39a900; color: white; font-size: 11px; font-weight: 700;
                      padding: 6px 12px; border-radius: 8px; text-decoration: none;">
              Ver en Google Maps →
            </a>
          ` : ''}
        </div>
      `

      marker.bindPopup(popupContent, { maxWidth: 260 })

      marker.on('click', () => {
        onSelect(tienda.id)
        marker.openPopup()
      })

      marker.addTo(map)
      markersRef.current.set(tienda.id, marker)
      bounds.push([tienda.lat, tienda.lng])
    })

    // Fit map to all markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
    }
  }, [tiendas, onSelect, selectedId])

  // Pan/zoom to selected marker
  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedId) return

    const tienda = tiendas.find(t => t.id === selectedId)
    if (!tienda?.lat || !tienda?.lng) return

    map.flyTo([tienda.lat, tienda.lng], 15, { duration: 1 })

    // Update marker icons
    markersRef.current.forEach((marker, id) => {
      marker.setIcon(createCustomIcon(id === selectedId))
    })

    // Open popup
    const marker = markersRef.current.get(selectedId)
    if (marker) setTimeout(() => marker.openPopup(), 500)
  }, [selectedId, tiendas])

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[450px]"
      style={{ zIndex: 0 }}
    />
  )
}

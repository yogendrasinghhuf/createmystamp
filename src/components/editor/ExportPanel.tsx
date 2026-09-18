// src/components/editor/ExportPanel.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProject } from '../../store/useStampStore'
import { getCleanSvgString } from '../../lib/svgSerialize'
import { downloadSvg } from '../../lib/exportSvg'
import { exportSvgToPngBlob, downloadBlob } from '../../lib/exportPng'
import { BRAND } from '../../config/brand'
import Button from '../ui/Button'
import Select from '../ui/Select'

const PX_PER_MM = 8 // baseline raster density before scale multiplier

interface ExportPanelProps {
  layout?: 'stacked' | 'row'
}

export default function ExportPanel({ layout = 'stacked' }: ExportPanelProps) {
  const project = useProject()
  const [format, setFormat] = useState<'png' | 'svg'>('png')
  const [scale, setScale] = useState<'1' | '2' | '3'>('2')
  const [transparent, setTransparent] = useState(true)
  const [busy, setBusy] = useState(false)

  async function handleExport() {
    setBusy(true)
    try {
      const svgString = getCleanSvgString(project.dimensions)
      const filenameBase = `${BRAND.name.toLowerCase()}-stamp-${project.id.slice(0, 6)}`

      if (format === 'svg') {
        downloadSvg(svgString, `${filenameBase}.svg`)
      } else {
        const padding = 10
        const widthMm = project.dimensions.width + padding * 2
        const heightMm = project.dimensions.height + padding * 2
        const multiplier = Number(scale)
        const widthPx = Math.round(widthMm * PX_PER_MM * multiplier)
        const heightPx = Math.round(heightMm * PX_PER_MM * multiplier)
        const blob = await exportSvgToPngBlob(svgString, widthPx, heightPx, transparent)
        downloadBlob(blob, `${filenameBase}@${scale}x.png`)
      }
    } finally {
      setBusy(false)
    }
  }

  if (layout === 'row') {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Select
          label="Format"
          value={format}
          options={[
            { label: 'PNG', value: 'png' },
            { label: 'SVG (vector)', value: 'svg' },
          ]}
          onChange={(value) => setFormat(value as 'png' | 'svg')}
          compact
        />
        {format === 'png' && (
          <>
            <Select
              label="Scale"
              value={scale}
              options={[
                { label: '1x', value: '1' },
                { label: '2x', value: '2' },
                { label: '3x', value: '3' },
              ]}
              onChange={(value) => setScale(value as '1' | '2' | '3')}
              compact
            />
            <label className="flex items-center gap-1.5 whitespace-nowrap text-xs text-ink/70">
              <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} />
              Transparent
            </label>
          </>
        )}
        <Link
          to="/add-to-pdf"
          className="ml-auto whitespace-nowrap rounded-lg bg-stamp-blue px-3 py-2 text-sm font-medium text-white shadow-soft transition-colors hover:bg-stamp-blue-dark"
        >
          Add to My PDF
        </Link>
        <Button onClick={handleExport} disabled={busy}>
          {busy ? 'Exporting…' : 'Download'}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Format"
        value={format}
        options={[
          { label: 'PNG', value: 'png' },
          { label: 'SVG (vector)', value: 'svg' },
        ]}
        onChange={(value) => setFormat(value as 'png' | 'svg')}
      />
      {format === 'png' && (
        <>
          <Select
            label="Scale"
            value={scale}
            options={[
              { label: '1x', value: '1' },
              { label: '2x', value: '2' },
              { label: '3x', value: '3' },
            ]}
            onChange={(value) => setScale(value as '1' | '2' | '3')}
          />
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} />
            Transparent background
          </label>
        </>
      )}
      <Button onClick={handleExport} disabled={busy}>
        {busy ? 'Exporting…' : 'Download'}
      </Button>
    </div>
  )
}

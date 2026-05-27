'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileDown, Loader2 } from 'lucide-react'
import { GenerationOutput } from '@/types'
import { GenerateInput } from '@/lib/validations'
import { toast } from 'sonner'

interface Props {
  output: GenerationOutput
  input?: Partial<GenerateInput>
}

export function PDFExport({ output, input }: Props) {
  const [loading, setLoading] = useState(false)

  async function exportPDF() {
    setLoading(true)
    try {
      const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])

      const container = document.createElement('div')
      container.style.cssText = [
        'position:fixed', 'left:-9999px', 'top:0',
        'width:794px', 'background:#ffffff',
        'padding:40px', 'font-family:Arial,Helvetica,sans-serif',
        'color:#000000', 'line-height:1.6', 'font-size:13px',
      ].join(';')
      container.innerHTML = buildHTML(output, input)
      document.body.appendChild(container)

      const canvas = await html2canvas(container, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })
      document.body.removeChild(container)

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * pageWidth) / canvas.width
      const imgData = canvas.toDataURL('image/jpeg', 0.9)

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        pdf.addPage()
        position = -(imgHeight - heightLeft)
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')
      pdf.save(`kontent-${date}.pdf`)
      toast.success('PDF сохранён!')
    } catch (e) {
      console.error(e)
      toast.error('Ошибка при создании PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={exportPDF} disabled={loading}>
      {loading
        ? <Loader2 className="w-3 h-3 mr-2 animate-spin" />
        : <FileDown className="w-3 h-3 mr-2" />}
      {loading ? 'Создаю PDF...' : 'Экспорт PDF'}
    </Button>
  )
}

function buildHTML(output: GenerationOutput, input?: Partial<GenerateInput>) {
  const date = new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })

  return `
    <div style="max-width:714px;">
      <div style="border-bottom:3px solid #000;padding-bottom:16px;margin-bottom:28px;">
        <h1 style="font-size:22px;font-weight:bold;margin:0 0 4px 0;">AI Revenue Content OS</h1>
        <p style="font-size:11px;color:#888;margin:0;">
          ${date}${input?.niche ? ` &nbsp;|&nbsp; Ниша: ${input.niche}` : ''}
          ${input?.offer ? ` &nbsp;|&nbsp; ${input.offer}` : ''}
        </p>
      </div>

      ${section('Instagram пост', [
        field('Хук', output.instagram_post.hook),
        field('Усиление боли', output.instagram_post.pain_agitation),
        field('Ценность', output.instagram_post.value_body),
        field('Призыв к действию', output.instagram_post.cta),
        field('Хэштеги', output.instagram_post.hashtags.map(h => `#${h.replace('#', '')}`).join(' ')),
      ])}

      ${section('Telegram пост', [
        ...output.telegram_post.structure.map((s, i) => field(`Блок ${i + 1}`, s)),
        field('CTA', output.telegram_post.cta),
      ])}

      ${section('Stories — 5 слайдов', output.stories.map((s, i) =>
        field(['Хук', 'Проблема', 'Инсайт', 'Решение', 'CTA'][i] ?? `Слайд ${i + 1}`, s)
      ))}

      ${section('Сценарий Reels', [
        field('Хук (0–3 сек)', output.reels_script.hook),
        ...output.reels_script.scenes.map((s, i) => field(`Сцена ${i + 1}`, s)),
        field('CTA', output.reels_script.cta),
      ])}

      ${section('10 вирусных хуков', output.viral_hooks.map((h, i) => field(`${i + 1}.`, h)))}

      ${section('Стратегия конверсии', [
        field('Главный триггер', output.conversion_strategy.primary_trigger),
        field('Психологические рычаги', output.conversion_strategy.psychological_levers.map(l => `• ${l}`).join('\n')),
        field('Механизм CTA', output.conversion_strategy.cta_mechanism),
      ])}
    </div>
  `
}

function section(title: string, fields: string[]) {
  return `
    <div style="margin-bottom:24px;page-break-inside:avoid;">
      <h2 style="font-size:13px;font-weight:bold;background:#f3f4f6;padding:8px 12px;border-radius:4px;margin:0 0 10px 0;">${title}</h2>
      ${fields.join('')}
    </div>
  `
}

function field(label: string, text: string) {
  return `
    <div style="margin-bottom:8px;">
      <span style="font-size:10px;font-weight:bold;color:#666;text-transform:uppercase;letter-spacing:0.5px;">${label}</span>
      <p style="font-size:12px;margin:3px 0 0 0;white-space:pre-wrap;">${escapeHtml(text)}</p>
    </div>
  `
}

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

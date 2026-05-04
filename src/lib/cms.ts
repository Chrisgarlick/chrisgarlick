import { getCMSClient } from '@kritano/cms/astro'

export function cms() {
  return getCMSClient()
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getYear(date: string | Date | null | undefined): number {
  if (!date) return new Date().getFullYear()
  return new Date(date).getFullYear()
}

/**
 * Convert TipTap JSON to HTML.
 * Workaround: CMS pre-renders body.html for top-level richText but not for richText inside blocks.
 * Remove this once the CMS fixes block richText rendering.
 */
export function tiptapToHtml(doc: any): string {
  if (!doc) return ''
  if (typeof doc === 'string') return doc
  if (doc.html) return doc.html

  const renderNode = (node: any): string => {
    if (!node) return ''
    if (node.type === 'text') {
      let text = escapeHtml(node.text || '')
      if (node.marks) {
        for (const mark of node.marks) {
          if (mark.type === 'bold') text = `<strong>${text}</strong>`
          if (mark.type === 'italic') text = `<em>${text}</em>`
          if (mark.type === 'code') text = `<code>${text}</code>`
          if (mark.type === 'link') text = `<a href="${escapeHtml(mark.attrs?.href || '')}">${text}</a>`
        }
      }
      return text
    }

    const children = (node.content || []).map(renderNode).join('')

    switch (node.type) {
      case 'doc': return children
      case 'paragraph': return `<p>${children}</p>`
      case 'heading': return `<h${node.attrs?.level || 2}>${children}</h${node.attrs?.level || 2}>`
      case 'bulletList': return `<ul>${children}</ul>`
      case 'orderedList': return `<ol>${children}</ol>`
      case 'listItem': return `<li>${children}</li>`
      case 'blockquote': return `<blockquote>${children}</blockquote>`
      case 'codeBlock': return `<pre><code>${children}</code></pre>`
      case 'horizontalRule': return '<hr>'
      case 'hardBreak': return '<br>'
      default: return children
    }
  }

  return renderNode(doc)
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function estimateReadTime(html: string | undefined | null): number {
  if (!html) return 1
  const text = html.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

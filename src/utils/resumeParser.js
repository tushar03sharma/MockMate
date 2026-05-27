// pdf parsing without any library
// honestly this was a pain to figure out, pdfs store text in weird ways
// this works for normal text pdfs (word, google docs exports etc)
// does NOT work for scanned pdfs - would need something like pdf.js for that
// TODO: maybe switch to pdf.js later if people complain

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB, seems reasonable

export function validatePDF(file) {
  if (!file) return { ok: false, error: 'No file selected.' }

  const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

  if (!isPDF) {
    return { ok: false, error: 'Only PDF files are supported. Please upload a .pdf file.' }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      ok: false,
      error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max size is 5 MB.`,
    }
  }

  return { ok: true }
}

// pdfs have these escape sequences in text, need to clean them up
function unescapePDF(s) {
  return s
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\')
    .replace(/\\[0-7]{3}/g, '') // remove octal escapes
}

// pdfs have BT...ET blocks for text, this extracts from one block
// took me forever to understand the pdf spec lol
function extractFromBlock(block) {
  const parts = []

  // handle (text) Tj format
  const tjRe = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*Tj/g
  let m
  while ((m = tjRe.exec(block)) !== null) {
    const t = unescapePDF(m[1]).trim()
    if (t) parts.push(t)
  }

  // handle [(text) -spacing (text)] TJ format
  const tjArrRe = /\[([^\]]*)\]\s*TJ/g
  while ((m = tjArrRe.exec(block)) !== null) {
    const inner = m[1]
    const strRe = /\(([^)\\]*(?:\\.[^)\\]*)*)\)/g
    let ms
    while ((ms = strRe.exec(inner)) !== null) {
      const t = unescapePDF(ms[1]).trim()
      if (t) parts.push(t)
    }
  }

  return parts
}

// fallback - just look for readable text in the raw bytes
// not perfect but better than nothing
function tryReadableText(raw) {
  const parts = []
  const re = /[\x20-\x7E]{8,}/g
  let m
  while ((m = re.exec(raw)) !== null) {
    const t = m[0].trim()
    if (/[aeiouAEIOU]/.test(t) && t.split(' ').length > 1) {
      parts.push(t)
    }
  }
  return parts
}

export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer()

  // latin1 decoding works better for pdf raw bytes than utf-8
  // learned this the hard way after getting garbage output
  const decoder = new TextDecoder('iso-8859-1')
  const raw = decoder.decode(arrayBuffer)

  const allParts = []

  // try to get text from BT/ET blocks first
  const btEtRe = /BT[\s\S]{0,5000}?ET/g
  let m
  while ((m = btEtRe.exec(raw)) !== null) {
    allParts.push(...extractFromBlock(m[0]))
  }

  // if we didn't get much, try the fallback
  if (allParts.length < 15) {
    console.log('bt/et parsing got less than 15 parts, trying fallback')
    const fallback = tryReadableText(raw)
    const seen = new Set(allParts)
    for (const p of fallback) {
      if (!seen.has(p)) allParts.push(p)
    }
  }

  const text = allParts
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim()

  console.log('extracted text length:', text.length)

  if (!text || text.length < 50) {
    throw new Error(
      'Couldnt read text from this PDF. Make sure its not a scanned PDF.'
    )
  }

  return text
}

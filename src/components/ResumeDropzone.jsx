import React, { useRef, useState } from 'react'
import { validatePDF } from '../utils/resumeParser'

// ─── Icons ─────────────────────────────────────────────────────────────────────
function UploadIcon({ className = 'w-12 h-12' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function PDFIcon() {
  return (
    <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5"/>
      <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5"/>
      <text x="6" y="18" fontSize="5" fill="currentColor" fontWeight="bold">PDF</text>
    </svg>
  )
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/**
 * ResumeDropzone — drag-and-drop PDF upload area.
 *
 * Props:
 *   onFile(file: File) — called when a valid PDF is selected
 *   isProcessing — shows progress bar when true
 *   progress — 0-100 number for the progress bar
 *   processingLabel — string shown under progress bar
 */
export default function ResumeDropzone({ onFile, isProcessing, progress = 0, processingLabel = '' }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState(null)

  function handleFile(file) {
    if (!file) return
    const validation = validatePDF(file)
    if (!validation.ok) {
      setError(validation.error)
      setSelectedFile(null)
      return
    }
    setError(null)
    setSelectedFile(file)
    onFile(file)
  }

  // ── Drag handlers ────────────────────────────────────────────────────────────
  function onDragOver(e) {
    e.preventDefault()
    setIsDragging(true)
  }
  function onDragLeave(e) {
    e.preventDefault()
    setIsDragging(false)
  }
  function onDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    handleFile(file)
  }

  // ── File input ───────────────────────────────────────────────────────────────
  function onInputChange(e) {
    const file = e.target.files?.[0]
    handleFile(file)
    // reset so same file can be re-selected
    e.target.value = ''
  }

  // ── Processing state ─────────────────────────────────────────────────────────
  if (isProcessing) {
    return (
      <div className="w-full rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 p-10 flex flex-col items-center gap-5">
        {/* File name reminder */}
        {selectedFile && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <PDFIcon />
            <span className="font-medium text-gray-700 dark:text-gray-200">{selectedFile.name}</span>
            <span>· {formatBytes(selectedFile.size)}</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full max-w-sm">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-2 bg-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step label */}
        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">
          {processingLabel || 'Processing…'}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative w-full rounded-2xl border-2 border-dashed cursor-pointer
          transition-all duration-200 p-10 flex flex-col items-center gap-4
          ${isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 scale-[1.01] shadow-lg shadow-indigo-100 dark:shadow-indigo-950'
            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20'
          }
        `}
      >
        {/* Upload icon */}
        <div className={`rounded-full p-4 transition-colors duration-200 ${
          isDragging ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          <UploadIcon className={`w-10 h-10 transition-colors duration-200 ${
            isDragging ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-500'
          }`} />
        </div>

        {/* Text */}
        {selectedFile ? (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <PDFIcon />
              <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                {selectedFile.name}
              </span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatBytes(selectedFile.size)} · Click to change
            </span>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
              {isDragging ? 'Drop your PDF here' : 'Drag & drop your resume'}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              or <span className="text-indigo-500 dark:text-indigo-400 font-medium">click to browse</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
              PDF only · Max 5 MB
            </p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={onInputChange}
          id="resume-file-input"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 animate-fadeIn">
          <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}

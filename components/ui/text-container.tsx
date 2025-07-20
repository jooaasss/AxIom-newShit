'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface TextContainerProps {
  title?: string
  content: string
  maxLength?: number
  showSlider?: boolean
  showCopyButton?: boolean
  className?: string
  responseTime?: string
}

export function TextContainer({
  title = 'Generated Text',
  content,
  maxLength = 1000,
  showSlider = false,
  showCopyButton = true,
  className = '',
  responseTime
}: TextContainerProps) {
  const [copied, setCopied] = useState(false)

  const displayedContent = content
  const isContentTruncated = false

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success('Text copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy text')
    }
  }



  return (
    <Card className={`w-full ${className}`}>
      {(title || showCopyButton) && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            {title && <CardTitle className="text-lg font-semibold">{title}</CardTitle>}
            <div className="flex items-center gap-2 ml-auto">
              {responseTime && (
                <Badge variant="outline" className="text-sm">
                  {responseTime}
                </Badge>
              )}
              <Badge variant="secondary" className="text-sm">
                {content.length} chars
              </Badge>
              {showCopyButton && (
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-md hover:bg-muted transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent>
        <div className="whitespace-pre-wrap text-sm leading-relaxed p-4 bg-muted/30 rounded-md border-muted/50 border min-h-[100px]">
          {displayedContent}
        </div>
      </CardContent>
    </Card>
  )
}
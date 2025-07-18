import OpenAI from 'openai'
import { calculateTokens, estimateTextCost, estimateImageCost } from './utils'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Text Generation
export interface TextGenerationOptions {
  model?: 'gpt-4-turbo-preview' | 'gpt-3.5-turbo'
  maxTokens?: number
  temperature?: number
  topP?: number
  presencePenalty?: number
  frequencyPenalty?: number
}

export interface TextGenerationResult {
  content: string
  tokens: number
  cost: number
  model: string
}

export async function generateText(
  prompt: string,
  options: TextGenerationOptions = {}
): Promise<TextGenerationResult> {
  try {
    const {
      model = 'gpt-4-turbo-preview',
      maxTokens = 1000,
      temperature = 0.7,
      topP = 1,
      presencePenalty = 0,
      frequencyPenalty = 0,
    } = options

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      presence_penalty: presencePenalty,
      frequency_penalty: frequencyPenalty,
    })

    const content = response.choices[0]?.message?.content || ''
    const tokens = response.usage?.total_tokens || calculateTokens(prompt + content)
    const cost = estimateTextCost(tokens, model)

    return {
      content,
      tokens,
      cost,
      model,
    }
  } catch (error) {
    console.error('Text generation error:', error)
    throw new Error('Failed to generate text')
  }
}

// Code Generation
export async function generateCode(
  prompt: string,
  language: string = 'javascript',
  options: TextGenerationOptions = {}
): Promise<TextGenerationResult> {
  const codePrompt = `Generate ${language} code for the following request. Only return the code without explanations:\n\n${prompt}`
  
  return generateText(codePrompt, {
    ...options,
    temperature: 0.3, // Lower temperature for more consistent code
  })
}

// Image Generation
export interface ImageGenerationOptions {
  model?: 'dall-e-3' | 'dall-e-2'
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792'
  quality?: 'standard' | 'hd'
  style?: 'vivid' | 'natural'
  n?: number
}

export interface ImageGenerationResult {
  imageUrl: string
  cost: number
  model: string
}

export async function generateImage(
  prompt: string,
  options: ImageGenerationOptions = {}
): Promise<ImageGenerationResult> {
  try {
    const {
      model = 'dall-e-3',
      size = '1024x1024',
      quality = 'standard',
      style = 'vivid',
      n = 1,
    } = options

    const response = await openai.images.generate({
      model,
      prompt,
      size: size as any,
      quality: model === 'dall-e-3' ? quality : undefined,
      style: model === 'dall-e-3' ? style : undefined,
      n,
    })

    const imageUrl = response.data?.[0]?.url || ''
    const cost = estimateImageCost(model, size, quality)

    return {
      imageUrl,
      cost,
      model,
    }
  } catch (error) {
    console.error('Image generation error:', error)
    throw new Error('Failed to generate image')
  }
}

// Website Generation
export async function generateWebsite(
  description: string,
  options: TextGenerationOptions = {}
): Promise<TextGenerationResult> {
  const websitePrompt = `Create a complete, modern, responsive HTML website based on this description: ${description}

Requirements:
- Use modern HTML5, CSS3, and vanilla JavaScript
- Include responsive design with mobile-first approach
- Use semantic HTML elements
- Include proper meta tags and SEO optimization
- Add smooth animations and transitions
- Use a modern color scheme and typography
- Make it fully functional and interactive
- Include comments explaining the code structure

Return only the complete HTML code with embedded CSS and JavaScript.`

  return generateText(websitePrompt, {
    ...options,
    maxTokens: 4000,
    temperature: 0.4,
  })
}

// Prompt Improvement
export async function improvePrompt(
  originalPrompt: string,
  context?: string
): Promise<TextGenerationResult> {
  const improvementPrompt = `Improve the following prompt to get better AI-generated results. Make it more specific, detailed, and effective while maintaining the original intent:

Original prompt: "${originalPrompt}"
${context ? `\nContext: ${context}` : ''}

Return only the improved prompt without explanations.`

  return generateText(improvementPrompt, {
    model: 'gpt-4-turbo-preview',
    maxTokens: 500,
    temperature: 0.3,
  })
}

// Content Analysis
export async function analyzeContent(
  content: string,
  analysisType: 'sentiment' | 'summary' | 'keywords' | 'readability' = 'summary'
): Promise<TextGenerationResult> {
  const prompts = {
    sentiment: `Analyze the sentiment of the following content and provide a detailed sentiment analysis with score (positive/negative/neutral) and reasoning:\n\n${content}`,
    summary: `Provide a concise summary of the following content, highlighting the main points and key takeaways:\n\n${content}`,
    keywords: `Extract the most important keywords and phrases from the following content. List them in order of relevance:\n\n${content}`,
    readability: `Analyze the readability of the following content and provide suggestions for improvement:\n\n${content}`,
  }

  return generateText(prompts[analysisType], {
    model: 'gpt-4-turbo-preview',
    maxTokens: 800,
    temperature: 0.3,
  })
}

// Translation
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<TextGenerationResult> {
  const translationPrompt = `Translate the following text ${sourceLanguage !== 'auto' ? `from ${sourceLanguage}` : ''} to ${targetLanguage}. Maintain the original tone and context:\n\n${text}`

  return generateText(translationPrompt, {
    model: 'gpt-4-turbo-preview',
    maxTokens: Math.max(500, calculateTokens(text) * 2),
    temperature: 0.2,
  })
}

// Content Rewriting
export async function rewriteContent(
  content: string,
  style: 'formal' | 'casual' | 'professional' | 'creative' | 'academic' = 'professional'
): Promise<TextGenerationResult> {
  const rewritePrompt = `Rewrite the following content in a ${style} style while maintaining the original meaning and key information:\n\n${content}`

  return generateText(rewritePrompt, {
    model: 'gpt-4-turbo-preview',
    maxTokens: Math.max(800, calculateTokens(content) * 1.5),
    temperature: 0.5,
  })
}
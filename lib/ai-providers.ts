import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { CohereClient } from 'cohere-ai'
import { HfInference } from '@huggingface/inference'
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference'
import { AzureKeyCredential } from '@azure/core-auth'
import { calculateTokens, estimateTextCost } from './utils'

// Provider types
export type AIProvider = 'openai' | 'groq' | 'huggingface' | 'gemini' | 'cohere' | 'grok' | 'deepseek' | 'github'

export interface TextGenerationOptions {
  provider?: AIProvider
  model?: string
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
  provider: AIProvider
}

export interface ImageGenerationOptions {
  provider?: AIProvider
  model?: string
  size?: string
  quality?: string
  style?: string
  n?: number
}

export interface ImageGenerationResult {
  imageUrl: string
  cost: number
  model: string
  provider: AIProvider
}

// Initialize providers
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

const groq = process.env.GROQ_API_KEY ? new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
}) : null

const gemini = process.env.GOOGLE_GEMINI_API_KEY ? new GoogleGenerativeAI(
  process.env.GOOGLE_GEMINI_API_KEY
) : null

const cohere = process.env.COHERE_API_KEY ? new CohereClient({
  token: process.env.COHERE_API_KEY,
}) : null

const huggingface = process.env.HUGGING_FACE_API_KEY ? new HfInference(
  process.env.HUGGING_FACE_API_KEY
) : null

const grok = process.env.GROK_API_KEY ? new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: 'https://api.x.ai/v1',
}) : null

const deepseek = process.env.DEEPSEEK_API_KEY ? new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
}) : null

const github = process.env.GITHUB_TOKEN ? ModelClient(
  'https://models.inference.ai.azure.com',
  new AzureKeyCredential(process.env.GITHUB_TOKEN)
) : null

// Provider configurations
const PROVIDER_CONFIGS = {
  openai: {
    textModels: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    imageModels: ['dall-e-3', 'dall-e-2'],
    defaultTextModel: 'gpt-4o-mini',
    defaultImageModel: 'dall-e-3',
  },
  groq: {
    textModels: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    imageModels: [],
    defaultTextModel: 'llama-3.1-70b-versatile',
    defaultImageModel: null,
  },
  gemini: {
    textModels: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
    imageModels: ['imagen-3.0-generate-001'],
    defaultTextModel: 'gemini-1.5-flash',
    defaultImageModel: 'imagen-3.0-generate-001',
  },
  cohere: {
    textModels: ['command-r-plus', 'command-r', 'command'],
    imageModels: [],
    defaultTextModel: 'command-r',
    defaultImageModel: null,
  },
  huggingface: {
    textModels: ['meta-llama/Llama-2-70b-chat-hf', 'microsoft/DialoGPT-large', 'facebook/blenderbot-400M-distill', 'Qwen/Qwen2.5-Coder-32B-Instruct'],
    imageModels: ['stabilityai/stable-diffusion-xl-base-1.0', 'runwayml/stable-diffusion-v1-5'],
    defaultTextModel: 'Qwen/Qwen2.5-Coder-32B-Instruct',
    defaultImageModel: 'stabilityai/stable-diffusion-xl-base-1.0',
  },
  grok: {
    textModels: ['grok-beta'],
    imageModels: [],
    defaultTextModel: 'grok-beta',
    defaultImageModel: null,
  },
  deepseek: {
    textModels: ['deepseek-chat', 'deepseek-coder'],
    imageModels: [],
    defaultTextModel: 'deepseek-chat',
    defaultImageModel: null,
  },
  github: {
    textModels: ['meta-llama/Llama-3.2-11B-Vision-Instruct', 'meta-llama/Llama-3.2-90B-Vision-Instruct', 'meta-llama/Llama-3.2-3B-Instruct'],
    imageModels: [],
    defaultTextModel: 'meta-llama/Llama-3.2-3B-Instruct',
    defaultImageModel: null,
  },
}

// OpenAI Text Generation
async function generateTextOpenAI(
  prompt: string,
  options: TextGenerationOptions
): Promise<TextGenerationResult> {
  if (!openai) throw new Error('OpenAI API key not configured')
  
  const model = options.model || PROVIDER_CONFIGS.openai.defaultTextModel
  
  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: options.maxTokens || 1000,
    temperature: options.temperature || 0.7,
    top_p: options.topP || 1,
    presence_penalty: options.presencePenalty || 0,
    frequency_penalty: options.frequencyPenalty || 0,
  })

  const content = response.choices[0]?.message?.content || ''
  const tokens = response.usage?.total_tokens || calculateTokens(prompt + content)
  const cost = estimateTextCost(tokens, model)

  return {
    content,
    tokens,
    cost,
    model,
    provider: 'openai',
  }
}

// Groq Text Generation
async function generateTextGroq(
  prompt: string,
  options: TextGenerationOptions
): Promise<TextGenerationResult> {
  if (!groq) throw new Error('Groq API key not configured')
  
  const model = options.model || PROVIDER_CONFIGS.groq.defaultTextModel
  
  const response = await groq.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: options.maxTokens || 1000,
    temperature: options.temperature || 0.7,
    top_p: options.topP || 1,
  })

  const content = response.choices[0]?.message?.content || ''
  const tokens = response.usage?.total_tokens || calculateTokens(prompt + content)
  const cost = 0 // Groq is often free or very low cost

  return {
    content,
    tokens,
    cost,
    model,
    provider: 'groq',
  }
}

// Gemini Text Generation
async function generateTextGemini(
  prompt: string,
  options: TextGenerationOptions
): Promise<TextGenerationResult> {
  if (!gemini) throw new Error('Google Gemini API key not configured')
  
  const model = options.model || PROVIDER_CONFIGS.gemini.defaultTextModel
  const genAI = gemini.getGenerativeModel({ model })
  
  const result = await genAI.generateContent(prompt)
  const response = await result.response
  const content = response.text()
  
  const tokens = calculateTokens(prompt + content)
  const cost = estimateTextCost(tokens, model)

  return {
    content,
    tokens,
    cost,
    model,
    provider: 'gemini',
  }
}

// Cohere Text Generation
async function generateTextCohere(
  prompt: string,
  options: TextGenerationOptions
): Promise<TextGenerationResult> {
  if (!cohere) throw new Error('Cohere API key not configured')
  
  const model = options.model || PROVIDER_CONFIGS.cohere.defaultTextModel
  
  const response = await cohere.chat({
    model,
    message: prompt,
    maxTokens: options.maxTokens || 1000,
    temperature: options.temperature || 0.7,
    p: options.topP || 1,
  })

  const content = response.text || ''
  const tokens = calculateTokens(prompt + content)
  const cost = estimateTextCost(tokens, model)

  return {
    content,
    tokens,
    cost,
    model,
    provider: 'cohere',
  }
}

// Hugging Face Text Generation using Chat Completions API
async function generateTextHuggingFace(
  prompt: string,
  options: TextGenerationOptions
): Promise<TextGenerationResult> {
  if (!process.env.HUGGING_FACE_API_KEY) throw new Error('HUGGING_FACE_API_KEY not configured')
  
  const model = options.model || 'Qwen/Qwen2.5-Coder-32B-Instruct:featherless-ai'
  console.log('generateTextHuggingFace called with model:', model)
  
  // Add timeout to prevent hanging
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
  
  try {
    const requestBody = {
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: model,
      max_tokens: options.maxTokens || 500,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 1,
    }
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2))
    
    const response = await fetch(
      'https://router.huggingface.co/v1/chat/completions',
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(requestBody),
        signal: controller.signal
      }
    )

    clearTimeout(timeoutId)
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('HuggingFace API error:', response.status, errorText)
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Hugging Face API key.')
      }
      
      if (response.status === 504) {
        throw new Error('HuggingFace API timeout. The model may be loading or overloaded. Please try again.')
      }
      
      throw new Error(`HuggingFace API error! status: ${response.status}, message: ${errorText}`)
    }
    
    const result = await response.json()
    console.log('HuggingFace API response:', JSON.stringify(result, null, 2))
    
    let content = result.choices?.[0]?.message?.content || ''
    
    // Remove extra quotes that might wrap the entire response
    content = content.replace(/^["'`]+|["'`]+$/g, '')
    
    // Remove quotes around code blocks if they exist
    content = content.replace(/^["'`]([\s\S]*)["'`]$/g, '$1')
    
    const tokens = result.usage?.total_tokens || calculateTokens(prompt + content)
    const cost = 0 // Many HF models are free

    return {
      content,
      tokens,
      cost,
      model,
      provider: 'huggingface',
    }
  } catch (error: any) {
    clearTimeout(timeoutId)
    console.error('Hugging Face API error:', error)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    
    if (error.name === 'AbortError') {
      console.log('Request was aborted due to timeout')
      throw new Error('Request timeout. Please try again with a shorter message.')
    }
    
    throw new Error(`Hugging Face generation failed: ${error.message}`)
  }
}

// Specialized Code Generation with Qwen
export async function generateCode(
  prompt: string,
  options: TextGenerationOptions = {}
): Promise<TextGenerationResult> {
  if (!process.env.HUGGING_FACE_API_KEY) throw new Error('Hugging Face API key not configured')
  
  try {
    const qwenClient = new HfInference(process.env.HUGGING_FACE_API_KEY)
    // Use a simpler, more reliable model for testing
    const model = 'microsoft/DialoGPT-medium'
    
    // Simple prompt formatting for code generation
    const codePrompt = `Generate code for: ${prompt}`
    
    const response = await qwenClient.textGeneration({
      model,
      inputs: codePrompt,
      parameters: {
        max_new_tokens: options.maxTokens || 256,
        temperature: options.temperature || 0.7,
        top_p: options.topP || 0.9,
      },
    })

    let content = response.generated_text || ''
    
    // Remove the original prompt from the response
    if (content.includes(codePrompt)) {
      content = content.replace(codePrompt, '').trim()
    }
    
    const tokens = calculateTokens(prompt + content)
    const cost = 0 // Hugging Face models are typically free

    return {
      content: content.trim() || 'Code generation completed successfully.',
      tokens,
      cost,
      model,
      provider: 'huggingface',
    }
  } catch (error) {
    console.error('Code generation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Code generation failed: ${errorMessage}`)
  }
}

// Grok Text Generation
async function generateTextGrok(
  prompt: string,
  options: TextGenerationOptions
): Promise<TextGenerationResult> {
  if (!grok) throw new Error('Grok API key not configured')
  
  const model = options.model || PROVIDER_CONFIGS.grok.defaultTextModel
  
  const response = await grok.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: options.maxTokens || 1000,
    temperature: options.temperature || 0.7,
    top_p: options.topP || 1,
  })

  const content = response.choices[0]?.message?.content || ''
  const tokens = response.usage?.total_tokens || calculateTokens(prompt + content)
  const cost = estimateTextCost(tokens, model)

  return {
    content,
    tokens,
    cost,
    model,
    provider: 'grok',
  }
}

// DeepSeek Text Generation
async function generateTextDeepSeek(
  prompt: string,
  options: TextGenerationOptions
): Promise<TextGenerationResult> {
  if (!deepseek) throw new Error('DeepSeek API key not configured')
  
  const model = options.model || PROVIDER_CONFIGS.deepseek.defaultTextModel
  
  const response = await deepseek.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: options.maxTokens || 1000,
    temperature: options.temperature || 0.7,
    top_p: options.topP || 1,
  })

  const content = response.choices[0]?.message?.content || ''
  const tokens = response.usage?.total_tokens || calculateTokens(prompt + content)
  const cost = estimateTextCost(tokens, model)

  return {
    content,
    tokens,
    cost,
    model,
    provider: 'deepseek',
  }
}

// GitHub Models Text Generation
async function generateTextGithub(
  prompt: string,
  options: TextGenerationOptions
): Promise<TextGenerationResult> {
  if (!process.env.GITHUB_TOKEN) throw new Error('GitHub token not configured')
  
  const model = options.model || PROVIDER_CONFIGS.github.defaultTextModel
  
  try {
    const response = await fetch('https://models.github.ai/inference/chat/completions', {
      method: 'POST',
      headers: {
         'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
         'Content-Type': 'application/json',
         'Accept': 'application/vnd.github+json',
         'X-GitHub-Api-Version': '2022-11-28',
       },
      body: JSON.stringify({
         model: model,
        messages: [
          { role: 'system', content: 'You are a helpful coding assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7,
        top_p: options.topP || 1.0,
        max_tokens: options.maxTokens || 1000
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API error response:', response.status, errorText)
      
      if (response.status === 401) {
        throw new Error('GitHub token is invalid or expired. Please check your GITHUB_TOKEN.')
      }
      
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    const content = result.choices[0]?.message?.content || ''
    const tokens = result.usage?.total_tokens || calculateTokens(prompt + content)
    const cost = 0 // GitHub Models are currently free

    return {
      content,
      tokens,
      cost,
      model,
      provider: 'github',
    }
  } catch (error: any) {
    console.error('GitHub Models API error:', error)
    throw new Error(`GitHub Models generation failed: ${error.message}`)
  }
}

// Main text generation function
export async function generateText(
  prompt: string,
  options: TextGenerationOptions = {}
): Promise<TextGenerationResult> {
  const provider = options.provider || 'openai'
  
  switch (provider) {
    case 'openai':
      return generateTextOpenAI(prompt, options)
    case 'groq':
      return generateTextGroq(prompt, options)
    case 'gemini':
      return generateTextGemini(prompt, options)
    case 'cohere':
      return generateTextCohere(prompt, options)
    case 'huggingface':
      return generateTextHuggingFace(prompt, options)
    case 'grok':
      return generateTextGrok(prompt, options)
    case 'deepseek':
      return generateTextDeepSeek(prompt, options)
    case 'github':
      return generateTextGithub(prompt, options)
    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}

// OpenAI Image Generation
async function generateImageOpenAI(
  prompt: string,
  options: ImageGenerationOptions
): Promise<ImageGenerationResult> {
  if (!openai) throw new Error('OpenAI API key not configured')
  
  const model = options.model || PROVIDER_CONFIGS.openai.defaultImageModel
  
  const response = await openai.images.generate({
    model,
    prompt,
    size: (options.size as any) || '1024x1024',
    quality: (options.quality as any) || 'standard',
    style: (options.style as any) || 'vivid',
    n: options.n || 1,
  })

  const imageUrl = response.data?.[0]?.url || ''
  const cost = model === 'dall-e-3' ? 0.04 : 0.02

  return {
    imageUrl,
    cost,
    model,
    provider: 'openai',
  }
}

// Hugging Face Image Generation
async function generateImageHuggingFace(
  prompt: string,
  options: ImageGenerationOptions
): Promise<ImageGenerationResult> {
  if (!huggingface) throw new Error('Hugging Face API key not configured')
  
  const model = options.model || PROVIDER_CONFIGS.huggingface.defaultImageModel
  
  const response = await huggingface.textToImage({
    model,
    inputs: prompt,
  })

  // Convert blob to base64 URL
  const arrayBuffer = await (response as unknown as Blob).arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const imageUrl = `data:image/png;base64,${base64}`
  
  return {
    imageUrl,
    cost: 0, // Many HF models are free
    model,
    provider: 'huggingface',
  }
}

// Main image generation function
export async function generateImage(
  prompt: string,
  options: ImageGenerationOptions = {}
): Promise<ImageGenerationResult> {
  const provider = options.provider || 'openai'
  
  switch (provider) {
    case 'openai':
      return generateImageOpenAI(prompt, options)
    case 'huggingface':
      return generateImageHuggingFace(prompt, options)
    default:
      throw new Error(`Image generation not supported for provider: ${provider}`)
  }
}

// Get available models for a provider
export function getProviderModels(provider: AIProvider, type: 'text' | 'image') {
  const config = PROVIDER_CONFIGS[provider]
  return type === 'text' ? config.textModels : config.imageModels
}

// Get AI provider instance
export function getAIProvider(provider: AIProvider) {
  console.log('getAIProvider called with provider:', provider)
  console.log('QWEN_API_KEY exists:', !!process.env.QWEN_API_KEY)
  
  switch (provider) {
    case 'openai':
      return openai ? {
        generateText: async (options: { model: string; messages: any[]; maxTokens?: number; temperature?: number }) => {
          const response = await openai.chat.completions.create({
            model: options.model,
            messages: options.messages,
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature || 0.7,
          })
          return {
            content: response.choices[0]?.message?.content || '',
            usage: response.usage,
            cost: estimateTextCost(response.usage?.total_tokens || 0, options.model)
          }
        }
      } : null
    case 'groq':
      return groq ? {
        generateText: async (options: { model: string; messages: any[]; maxTokens?: number; temperature?: number }) => {
          const response = await groq.chat.completions.create({
            model: options.model,
            messages: options.messages,
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature || 0.7,
          })
          return {
            content: response.choices[0]?.message?.content || '',
            usage: response.usage,
            cost: 0
          }
        }
      } : null
    case 'cohere':
      return cohere ? {
        generateText: async (options: { model: string; messages: any[]; maxTokens?: number; temperature?: number }) => {
          try {
            const model = options.model || 'command-r'
            
            // Convert messages to a single prompt for Cohere
            const prompt = options.messages
              .map(msg => {
                if (msg.role === 'user') {
                  return `User: ${msg.content}`
                } else if (msg.role === 'assistant') {
                  return `Assistant: ${msg.content}`
                } else if (msg.role === 'system') {
                  return `System: ${msg.content}`
                }
                return msg.content
              })
              .join('\n\n')
            
            console.log('Cohere API call with prompt:', prompt.substring(0, 200) + '...')
            
            const response = await cohere.generate({
              model,
              prompt,
              maxTokens: options.maxTokens || 1000,
              temperature: options.temperature || 0.7,
              p: 1,
            })
            
            const content = response.generations[0]?.text || ''
            console.log('Cohere API response:', content.substring(0, 200) + '...')
            
            const tokens = calculateTokens(prompt + content)
            
            return {
              content,
              usage: { total_tokens: tokens, prompt_tokens: calculateTokens(prompt), completion_tokens: calculateTokens(content) },
              cost: estimateTextCost(tokens, model)
            }
          } catch (error: any) {
            console.error('Cohere API error:', error)
            console.error('Error details:', error.message, error.status, error.statusText)
            
            throw new Error(`Cohere API error: ${error.message || 'Unknown error occurred'}`)
          }
        }
      } : null
    case 'gemini':
      return gemini ? {
        generateText: async (options: { model: string; messages: any[]; maxTokens?: number; temperature?: number }) => {
          try {
            const model = options.model || 'gemini-1.5-flash'
            const genAI = gemini.getGenerativeModel({ model })
            
            // Convert messages to a properly formatted prompt for Gemini
            const prompt = options.messages
              .filter(msg => msg.role !== 'system')
              .map(msg => {
                if (msg.role === 'user') {
                  return `User: ${msg.content}`
                } else if (msg.role === 'assistant') {
                  return `Assistant: ${msg.content}`
                }
                return msg.content
              })
              .join('\n\n')
            
            // Add system prompt if exists
            const systemMessage = options.messages.find(msg => msg.role === 'system')
            const finalPrompt = systemMessage 
              ? `${systemMessage.content}\n\n${prompt}`
              : prompt
            
            console.log('Gemini API call with prompt:', finalPrompt.substring(0, 200) + '...')
            
            const result = await genAI.generateContent(finalPrompt)
            const response = await result.response
            const content = response.text()
            
            console.log('Gemini API response:', content.substring(0, 200) + '...')
            
            const tokens = calculateTokens(finalPrompt + content)
            
            return {
              content,
              usage: { total_tokens: tokens, prompt_tokens: calculateTokens(finalPrompt), completion_tokens: calculateTokens(content) },
              cost: estimateTextCost(tokens, model)
            }
          } catch (error: any) {
            console.error('Gemini API error:', error)
            console.error('Error details:', error.message, error.status, error.statusText)
            
            if (error.status === 503) {
              throw new Error('Gemini API is temporarily unavailable. Please try again in a few moments.')
            }
            
            if (error.message?.includes('API_KEY')) {
              throw new Error('Invalid Gemini API key. Please check your configuration.')
            }
            
            throw new Error(`Gemini API error: ${error.message || 'Unknown error occurred'}`)
          }
        }
      } : null
    case 'huggingface':
      return process.env.QWEN_API_KEY ? {
        generateText: async (options: { model: string; messages: any[]; maxTokens?: number; temperature?: number }) => {
          console.log('HuggingFace API call with model:', options.model)
          
          const requestBody = {
            messages: options.messages,
            model: options.model || 'Qwen/Qwen2.5-Coder-32B-Instruct:featherless-ai',
            max_tokens: options.maxTokens || 500,
            temperature: options.temperature || 0.7,
          }
          
          console.log('Request body:', JSON.stringify(requestBody, null, 2))
          
          // Add timeout to prevent hanging
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout
          
          try {
            const response = await fetch(
              'https://router.huggingface.co/v1/chat/completions',
              {
                headers: {
                  'Authorization': `Bearer ${process.env.QWEN_API_KEY}`,
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(requestBody),
                signal: controller.signal
              }
            )
            
            clearTimeout(timeoutId)
            console.log('Response status:', response.status)
            
            if (!response.ok) {
              const errorText = await response.text()
              console.error('HuggingFace API error:', response.status, errorText.substring(0, 500))
              
              if (response.status === 504) {
                throw new Error('HuggingFace API timeout. The model may be loading or overloaded. Please try again.')
              }
              
              throw new Error(`HuggingFace API error! status: ${response.status}`)
            }
            
            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('Invalid response format from HuggingFace API')
            }
            
            const result = await response.json()
            console.log('HuggingFace API success:', result.choices?.[0]?.message?.content?.substring(0, 100))
            
            let content = result.choices?.[0]?.message?.content || ''
            
            // Remove extra quotes that might wrap the entire response
            content = content.replace(/^["'`]+|["'`]+$/g, '')
            
            // Remove quotes around code blocks if they exist
            content = content.replace(/^["'`]([\s\S]*)["'`]$/g, '$1')
            
            return {
              content,
              usage: result.usage || { total_tokens: 0, prompt_tokens: 0, completion_tokens: 0 },
              cost: 0
            }
          } catch (error: any) {
            clearTimeout(timeoutId)
            console.error('HuggingFace API error:', error)
            console.error('Error name:', error.name)
            console.error('Error message:', error.message)
            
            if (error.name === 'AbortError') {
              console.log('Request was aborted due to timeout')
              throw new Error('Время ожидания истекло. Попробуйте еще раз с более коротким сообщением.')
            }
            
            if (error.message.includes('504')) {
              throw new Error('Сервер HuggingFace временно недоступен. Модель может загружаться. Попробуйте через несколько минут.')
            }
            
            throw new Error(`Ошибка нейросети: ${error.message || 'Неизвестная ошибка. Попробуйте еще раз.'}`)
          }
        }
      } : null
    case 'deepseek':
      return deepseek ? {
        generateText: async (options: { model: string; messages: any[]; maxTokens?: number; temperature?: number }) => {
          const response = await deepseek.chat.completions.create({
            model: options.model,
            messages: options.messages,
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature || 0.7,
          })
          return {
            content: response.choices[0]?.message?.content || '',
            usage: response.usage,
            cost: estimateTextCost(response.usage?.total_tokens || 0, options.model)
          }
        }
      } : null
    default:
      return null
  }
}

// Get all available providers
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = []
  
  if (process.env.OPENAI_API_KEY) providers.push('openai')
  if (process.env.GROQ_API_KEY) providers.push('groq')
  if (process.env.GOOGLE_GEMINI_API_KEY) providers.push('gemini')
  if (process.env.COHERE_API_KEY) providers.push('cohere')
  if (process.env.QWEN_API_KEY) providers.push('huggingface')
  if (process.env.GROK_API_KEY) providers.push('grok')
  if (process.env.DEEPSEEK_API_KEY) providers.push('deepseek')
  if (process.env.GITHUB_TOKEN) providers.push('github')
  
  return providers
}

// Provider info for UI
export const PROVIDER_INFO = {
  openai: {
    name: 'OpenAI',
    description: 'GPT-4 and DALL-E models',
    icon: '🤖',
    color: 'from-green-500 to-blue-500',
  },
  groq: {
    name: 'Groq',
    description: 'Ultra-fast LLaMA and Mixtral models',
    icon: '⚡',
    color: 'from-orange-500 to-red-500',
  },
  gemini: {
    name: 'Google Gemini',
    description: 'Google\'s advanced AI models',
    icon: '💎',
    color: 'from-blue-500 to-purple-500',
  },
  cohere: {
    name: 'Cohere',
    description: 'Enterprise-grade language models',
    icon: '🧠',
    color: 'from-purple-500 to-pink-500',
  },
  huggingface: {
    name: 'Hugging Face',
    description: 'Open-source AI models',
    icon: '🤗',
    color: 'from-yellow-500 to-orange-500',
  },
  grok: {
    name: 'Grok',
    description: 'xAI\'s conversational AI',
    icon: '🚀',
    color: 'from-gray-500 to-black',
  },
  deepseek: {
    name: 'DeepSeek',
    description: 'Advanced reasoning and coding models',
    icon: '🔍',
    color: 'from-blue-600 to-indigo-600',
  },
  github: {
    name: 'GitHub Models',
    description: 'GitHub AI models via Azure',
    icon: '🐙',
    color: 'from-gray-700 to-gray-900',
  },
}
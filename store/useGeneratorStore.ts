import { create } from 'zustand'
import { GenerateInput } from '@/lib/validations'
import { Generation } from '@/types'

interface GeneratorState {
  input: Partial<GenerateInput>
  output: Generation | null
  isGenerating: boolean
  error: string | null
  setInput: (input: Partial<GenerateInput>) => void
  setOutput: (output: Generation | null) => void
  setGenerating: (v: boolean) => void
  setError: (e: string | null) => void
  reset: () => void
}

export const useGeneratorStore = create<GeneratorState>((set) => ({
  input: {},
  output: null,
  isGenerating: false,
  error: null,
  setInput: (input) => set((s) => ({ input: { ...s.input, ...input } })),
  setOutput: (output) => set({ output }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  reset: () => set({ input: {}, output: null, isGenerating: false, error: null }),
}))

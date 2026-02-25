'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useGenerateToken } from '@/lib/api-hooks'
import { Zap, Copy, Check } from 'lucide-react'

interface TokenGenerationFormProps {
  onTokenGenerated?: (token: string) => void
}

export function TokenGenerationForm({
  onTokenGenerated,
}: TokenGenerationFormProps) {

  const [generatedToken, setGeneratedToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const form = useForm({
    defaultValues: {
      duration: '20',
      late_after: '10',
    },
  })

  const { generate, loading } = useGenerateToken()

  async function onSubmit(values: {
    duration: string
    late_after: string
  }) {
    setGeneratedToken(null)

    const result = await generate({
      duration: parseInt(values.duration),
      late_after: parseInt(values.late_after),
    })

    if (result) {
  form.reset()
  setGeneratedToken(result.token_code)
  onTokenGenerated?.(result.token_code)
}
  }

  function handleCopy() {
    if (!generatedToken) return
    navigator.clipboard.writeText(generatedToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 space-y-6">

        <div className="flex items-center gap-2">
          <Zap className="text-orange-500" size={24} />
          <h2 className="text-2xl font-bold">Generate New Token</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validity Duration (Minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    How long should this token remain valid?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="late_after"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Late After (Minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Students marked late after this duration.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Generating...</span>
                </div>
              ) : (
                'Generate Token'
              )}
            </Button>
          </form>
        </Form>

        {/* Result Section */}
        <AnimatePresence>
          {generatedToken && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-gray-500">Generated Token</p>
                <p className="text-2xl font-mono font-bold text-orange-600 tracking-widest">
                  {generatedToken}
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

      </Card>
    </motion.div>
  )
}
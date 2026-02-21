import { supabase } from '@/lib/supabase'

export interface BillingSummary {
  planName: string
  planAmount: string
  usage?: {
    agentRuntime?: { used: number; limit: number }
    apiCalls?: { used: number; limit: number }
  }
}

export async function fetchBillingSummary(): Promise<BillingSummary> {
  if (!supabase) {
    return { planName: 'Pro', planAmount: '$29/month' }
  }
  const { data, error } = await supabase.functions.invoke<{ data: BillingSummary }>('billing')
  if (error) throw new Error(error.message)
  return data?.data ?? { planName: 'Pro', planAmount: '$29/month' }
}

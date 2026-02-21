export interface TermsofService {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface TermsRevision {
  version: string
  date: string
  summary: string
}

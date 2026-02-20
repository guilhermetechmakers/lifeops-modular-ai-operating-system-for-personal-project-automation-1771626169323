/**
 * Artifact API - S3-compatible object storage integration
 * Signed URLs for run artifacts, diffs, logs, exports.
 * Per-tenant access via Edge Function.
 */

const OBJECT_STORAGE_BASE = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL
  ? `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/object-storage`
  : undefined

export interface ArtifactSignedUrl {
  key: string
  url: string
  type: string
  filename: string
}

export interface RunArtifactMeta {
  id: string
  artifact_type: string
  filename: string
  size_bytes?: number
  created_at: string
}

async function artifactFetch<T>(body: object, token?: string): Promise<T> {
  if (!OBJECT_STORAGE_BASE) {
    return { data: { urls: [], artifacts: [] } } as T
  }
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const res = await fetch(OBJECT_STORAGE_BASE, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? res.statusText)
  }
  return res.json()
}

/**
 * Get signed URLs for run artifacts (logs, diffs, artifacts, exports)
 */
export async function getRunArtifactUrls(
  runId: string,
  artifactTypes?: ('logs' | 'diff' | 'artifact' | 'export')[],
  token?: string
): Promise<ArtifactSignedUrl[]> {
  const res = await artifactFetch<{ data: { urls: ArtifactSignedUrl[] } }>(
    {
      action: 'get_signed_urls',
      run_id: runId,
      artifact_types: artifactTypes,
    },
    token
  )
  return res.data?.urls ?? []
}

/**
 * List artifacts for a run (metadata only)
 */
export async function listRunArtifacts(
  runId: string,
  token?: string
): Promise<RunArtifactMeta[]> {
  const res = await artifactFetch<{ data: { artifacts: RunArtifactMeta[] } }>(
    { action: 'list_artifacts', run_id: runId },
    token
  )
  return res.data?.artifacts ?? []
}

/**
 * Export artifact - get signed download URL for a specific file
 */
export async function exportArtifact(
  runId: string,
  artifactType: 'logs' | 'diff' | 'artifact' | 'export',
  filename: string,
  token?: string
): Promise<{ url: string; filename: string }> {
  const res = await artifactFetch<{ data: { url: string; filename: string } }>(
    {
      action: 'export_artifact',
      run_id: runId,
      artifact_type: artifactType,
      filename,
    },
    token
  )
  if (!res.data) throw new Error('Export failed')
  return res.data
}

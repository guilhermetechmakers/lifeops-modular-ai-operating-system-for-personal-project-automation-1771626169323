import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ChevronRight, FileText } from 'lucide-react'
import { TermsText, AcceptAgreeCTA, RevisionHistory } from '@/components/terms-of-service'
import {
  fetchTermsAccepted,
  fetchRevisionHistory,
  acceptTerms,
} from '@/api/terms-of-service'
import { ErrorState } from '@/components/ui/loading-states'

export default function TermsofService() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Terms of Service — LifeOps'
    return () => {
      document.title = prevTitle
    }
  }, [])

  const {
    data: acceptedTerms = [],
    isLoading: isLoadingAccepted,
  } = useQuery({
    queryKey: ['terms-accepted'],
    queryFn: fetchTermsAccepted,
    retry: 1,
  })

  const {
    data: revisions = [],
    isLoading: isLoadingRevisions,
    isError: isErrorRevisions,
    refetch: refetchRevisions,
  } = useQuery({
    queryKey: ['terms-revisions'],
    queryFn: fetchRevisionHistory,
    retry: 1,
  })

  const acceptMutation = useMutation({
    mutationFn: () => acceptTerms(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms-accepted'] })
      toast.success('Terms of Service accepted successfully.')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to record acceptance.')
    },
  })

  const hasAccepted = acceptedTerms.length > 0

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <nav
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="flex items-center gap-1.5 text-foreground font-medium">
            <FileText className="h-4 w-4" />
            Terms of Service
          </span>
        </nav>

        <header className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Legal terms governing use of LifeOps, acceptable use policy, and liability limits.
          </p>
        </header>

        <div className="space-y-8">
          <section className="animate-fade-in-up [animation-fill-mode:both]">
            <TermsText />
          </section>

          <section className="animate-fade-in-up [animation-delay:0.05s] [animation-fill-mode:both]">
            <AcceptAgreeCTA
              onAccept={async () => {
                await acceptMutation.mutateAsync()
              }}
              isAccepted={hasAccepted}
              isLoading={isLoadingAccepted}
            />
          </section>

          <section className="animate-fade-in-up [animation-delay:0.1s] [animation-fill-mode:both]">
            {isErrorRevisions ? (
              <ErrorState
                title="Could not load revision history"
                message="Revision history could not be loaded. Showing default version."
                onRetry={() => refetchRevisions()}
              />
            ) : null}
            <RevisionHistory
              revisions={revisions}
              isLoading={isLoadingRevisions}
            />
          </section>
        </div>

        <footer className="mt-16 border-t border-border pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to Home
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}

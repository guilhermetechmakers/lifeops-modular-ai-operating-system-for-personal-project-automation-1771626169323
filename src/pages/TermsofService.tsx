import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MainNav } from '@/components/layout/main-nav'
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
import { Skeleton } from '@/components/ui/skeleton'

function TermsPageSkeleton() {
  return (
    <div
      className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8"
      role="status"
      aria-label="Loading terms of service"
    >
      <nav className="mb-8 flex items-center gap-2" aria-hidden>
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-32" />
      </nav>
      <header className="mb-10 space-y-2">
        <Skeleton className="h-10 w-72 sm:h-12 sm:w-96" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </header>
      <div className="space-y-8">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
      <span className="sr-only">Loading terms of service content...</span>
    </div>
  )
}

export default function TermsofService() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const prevTitle = document.title
    const prevDesc = document.querySelector('meta[name="description"]')?.getAttribute('content')
    document.title = 'Terms of Service — LifeOps'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Legal terms governing use of LifeOps, acceptable use policy, and liability limits.'
      )
    }
    return () => {
      document.title = prevTitle
      if (metaDesc && prevDesc) metaDesc.setAttribute('content', prevDesc)
    }
  }, [])

  const {
    data: acceptedTerms = [],
    isLoading: isLoadingAccepted,
    isError: isErrorAccepted,
    refetch: refetchAccepted,
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
  const isInitialLoad = isLoadingRevisions || isLoadingAccepted

  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-background">
        <TermsPageSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainNav />
      <div className="flex-1 mx-auto max-w-4xl w-full px-4 py-8 sm:px-6 lg:px-8">
        <nav
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground"
          aria-label="Breadcrumb navigation"
        >
          <Link
            to="/"
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            aria-label="Navigate to home page"
          >
            Home
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          <span className="flex items-center gap-1.5 text-foreground font-medium">
            <FileText className="h-4 w-4" aria-hidden />
            Terms of Service
          </span>
        </nav>

        <header className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
            Terms of Service
          </h1>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            Legal terms governing use of LifeOps, acceptable use policy, and liability limits.
          </p>
        </header>

        <div className="space-y-8">
          <section
            className="animate-fade-in-up [animation-fill-mode:both]"
            aria-labelledby="terms-heading"
          >
            <TermsText />
          </section>

          <section
            className="animate-fade-in-up [animation-delay:0.05s] [animation-fill-mode:both]"
            aria-labelledby="accept-heading"
          >
            {isErrorAccepted ? (
              <ErrorState
                title="Could not load acceptance status"
                message="We could not verify whether you have accepted the terms. You can still accept below."
                onRetry={() => refetchAccepted()}
                retryLabel="Retry"
                retryAriaLabel="Retry loading acceptance status"
              />
            ) : null}
            <AcceptAgreeCTA
              onAccept={async () => {
                await acceptMutation.mutateAsync()
              }}
              isAccepted={hasAccepted}
              isLoading={isLoadingAccepted}
            />
          </section>

          <section
            className="animate-fade-in-up [animation-delay:0.1s] [animation-fill-mode:both]"
            aria-labelledby="revisions-heading"
          >
            {isErrorRevisions ? (
              <ErrorState
                title="Could not load revision history"
                message="Revision history could not be loaded. Showing default version."
                onRetry={() => refetchRevisions()}
                retryLabel="Retry"
                retryAriaLabel="Retry loading revision history"
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
              className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
              aria-label="Navigate back to home page"
            >
              ← Back to Home
            </Link>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/terms-of-service"
                className="text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                aria-current="page"
                aria-label="Terms of Service (current page)"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                aria-label="Navigate to Privacy Policy"
              >
                Privacy Policy
              </Link>
              <Link
                to="/cookies"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                aria-label="Navigate to Cookie Policy"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

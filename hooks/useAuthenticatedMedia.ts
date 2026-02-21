import {useEffect, useState} from 'react'
import {useAuthStore} from '@/store/useAuthStore'

export const useAuthenticatedMedia = (mediaUrl: string | undefined) => {
  const [resolvedUrl, setResolvedUrl] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    const resolveUrl = async () => {
      if (!mediaUrl || !mediaUrl.startsWith('https://api.risus.io')) {
        setResolvedUrl(mediaUrl)
        return
      }

      if (!accessToken) {
        // Don't try to fetch if not logged in
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(mediaUrl, {
          method: 'HEAD', // Use HEAD to be efficient, we only need the final URL
          headers: {
            Authorization: `Token ${accessToken}`
          },
          redirect: 'follow' // This is the default, but being explicit is good
        })

        if (response.ok) {
          // response.url will be the URL after any redirects
          setResolvedUrl(response.url)
        } else {
          setError(`Failed to fetch media. Status: ${response.status}`)
        }
      } catch (e: any) {
        setError(e.message || 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    resolveUrl()
  }, [mediaUrl, accessToken])

  return {resolvedUrl, isLoading, error}
}

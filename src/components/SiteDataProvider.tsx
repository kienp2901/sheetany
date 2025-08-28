"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { siteServiceApi, type SiteData } from "@/services/api/siteServiceApi"

interface SiteDataContextValue {
  siteData: SiteData | null
  loading: boolean
  error: unknown | null
}

const SiteDataContext = createContext<SiteDataContextValue>({ siteData: null, loading: true, error: null })

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown | null>(null)
  const didFetchRef = useRef(false)

  useEffect(() => {
    if (didFetchRef.current) return
    didFetchRef.current = true

    const fetchSiteData = async () => {
      try {
        const response = await siteServiceApi.getSiteData()
        if (response.status) {
          setSiteData(response.data)
        } else {
          setError(new Error("Failed to load site data"))
        }
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSiteData()
  }, [])

  return <SiteDataContext.Provider value={{ siteData, loading, error }}>{children}</SiteDataContext.Provider>
}

export function useSiteData() {
  return useContext(SiteDataContext)
}



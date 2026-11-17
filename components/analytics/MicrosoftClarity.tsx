'use client'

import { useEffect } from 'react'
import { COOKIE_CONSENT_ACCEPTED_EVENT, hasOptionalCookieConsent } from '@/lib/cookieConsent'

function installClarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
  if (!projectId || !hasOptionalCookieConsent()) return
  if (document.getElementById('microsoft-clarity')) return
  const script = document.createElement('script')
  script.id = 'microsoft-clarity'
  script.text = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${projectId}");
  `
  document.head.appendChild(script)
}

export default function MicrosoftClarity() {
  useEffect(() => {
    installClarity()
    window.addEventListener(COOKIE_CONSENT_ACCEPTED_EVENT, installClarity)
    return () => window.removeEventListener(COOKIE_CONSENT_ACCEPTED_EVENT, installClarity)
  }, [])

  return null
}

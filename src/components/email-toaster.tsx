import { useEffect } from 'react'

import { Toaster, toast } from '@/components/ui/toast'

interface Props {
  email: string
}

export function EmailToaster({ email }: Props) {
  useEffect(() => {
    const onCopied = () => toast.add({ title: 'Email copied', type: 'success', timeout: 2000 })
    const onFailed = () => toast.add({ title: email, timeout: 2000 })

    document.addEventListener('email-copied', onCopied)
    document.addEventListener('email-copy-failed', onFailed)

    return () => {
      document.removeEventListener('email-copied', onCopied)
      document.removeEventListener('email-copy-failed', onFailed)
    }
  }, [email])

  return <Toaster limit={1} timeout={2000} />
}

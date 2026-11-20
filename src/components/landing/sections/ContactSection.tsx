import * as React from "react"
import ContactWithGlobe from "@/components/ui/contact-with-globe"

interface ContactSectionProps {
  email?: string
  copied?: boolean
  onCopyEmail?: () => void
}

export function ContactSection({
  email = "hello@overstory.studio",
  copied = false,
  onCopyEmail,
}: ContactSectionProps) {
  return (
    <ContactWithGlobe
      email={email}
      copied={copied}
      onCopyEmail={onCopyEmail}
    />
  )
}

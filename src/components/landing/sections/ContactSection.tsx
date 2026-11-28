import * as React from "react"
import type { ComponentProps } from "react"
import type ContactWithGlobeType from "@/components/ui/contact-with-globe"

const ContactWithGlobe = React.lazy(() => import("@/components/ui/contact-with-globe"))

type ContactSectionProps = ComponentProps<typeof ContactWithGlobeType>

export function ContactSection(props: ContactSectionProps) {
  return (
    <React.Suspense
      fallback={
        <section
          id="contact"
          data-sec="contact"
          style={{ minHeight: 520, background: "var(--ovs-forest, #0e1a10)" }}
          aria-hidden="true"
        />
      }
    >
      <ContactWithGlobe {...props} />
    </React.Suspense>
  )
}

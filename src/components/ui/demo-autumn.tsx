"use client"

import OverstoryStudioLanding from "@/components/ui/overstory-studio-landing"

export default function DemoAutumn() {
  return (
    <OverstoryStudioLanding
      brand="Apex Growth"
      season="autumn"
      seed={23}
      status="Now booking new client projects for this quarter"
      hero={{ lead: "We Build High-Impact", words: ["Websites", "E-Commerce", "Software", "Campaigns"], tail: "That Scale." }}
      email="hello@apexdigital.agency"
      footer={{ city: "San Francisco", timeZone: "America/Los_Angeles", note: "Websites · E-Commerce · Software · Digital Marketing." }}
      onBook={() => {
        if (typeof window !== "undefined") window.alert("Consultation request received! Our team will reach out within 24 hours.")
      }}
    />
  )
}

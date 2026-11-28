import * as React from "react"
import { GrowingTree, Kicker, Split } from "../ui-primitives"
import { OvsStep } from "../types"

interface ProcessSectionProps {
  kicker: string
  title: string
  steps: OvsStep[]
  seed: number
  uid: string
}

export function ProcessSection({ kicker, title, steps, seed, uid }: ProcessSectionProps) {
  return (
    <section className="ovs-sec ovs-process" data-process data-sec="process" aria-labelledby={uid + "pr"}>
      <div className="ovs-wrap">
        <Kicker n="06" text={kicker} />
        <span id={uid + "pr"}>
          <Split text={title} className="ovs-h2 ovs-h2-wide" />
        </span>
        <div className="ovs-proc-grid">
          <div className="ovs-tree-col">
            <div className="ovs-tree-stick">
              <GrowingTree seed={seed} />
            </div>
          </div>
          <ol className="ovs-steps">
            {steps.map((s, i) => (
              <li key={s.name} className="ovs-step">
                <p className="ovs-step-k">
                  <span>0{i + 1}</span>
                  <b>{s.name}</b>
                  <em>{s.when}</em>
                </p>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

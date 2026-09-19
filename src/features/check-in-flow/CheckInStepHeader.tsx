import { ArrowButton } from '@/shared/ui'
import './CheckInStepHeader.css'

/** Shared top bar for check-in wizard steps: a back arrow beside the step
 * title. Moving forward is the footer's Next button, so the right side stays
 * an empty spacer that keeps the title centred. */
export const CheckInStepHeader = ({ title, onBack }: { title: string; onBack?: () => void }) => (
  <div className="check-in-step-header">
    <ArrowButton direction="left" disabled={!onBack} onClick={onBack} />
    <h2>{title}</h2>
    <span className="check-in-step-header__spacer" aria-hidden="true" />
  </div>
)

import { ArrowButton } from '@/shared/ui'
import './CheckInStepHeader.css'

/** Shared top bar for check-in wizard steps: back/forward arrows around a
 * step title, so each step doesn't hardcode its own nav buttons/links. */
export const CheckInStepHeader = ({
  title,
  onBack,
  onForward,
}: {
  title: string
  onBack?: () => void
  onForward?: () => void
}) => (
  <div className="check-in-step-header">
    <ArrowButton direction="left" disabled={!onBack} onClick={onBack} />
    <h2>{title}</h2>
    <ArrowButton direction="right" disabled={!onForward} onClick={onForward} />
  </div>
)

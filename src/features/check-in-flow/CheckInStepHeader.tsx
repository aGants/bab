import { ArrowButton } from '@/shared/ui'

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
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
    <ArrowButton direction="left" disabled={!onBack} onClick={onBack} />
    <h2 style={{ margin: 0 }}>{title}</h2>
    <ArrowButton direction="right" disabled={!onForward} onClick={onForward} />
  </div>
)

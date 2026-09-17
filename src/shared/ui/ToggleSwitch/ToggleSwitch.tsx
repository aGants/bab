import './ToggleSwitch.css'

type ToggleSwitchOption<T extends string> = {
  value: T
  label: string
}

export const ToggleSwitch = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly [ToggleSwitchOption<T>, ToggleSwitchOption<T>]
  value: T
  onChange: (value: T) => void
}) => {
  const activeIndex = options[0].value === value ? 0 : 1

  return (
    <div className="toggle-switch" data-active-index={activeIndex}>
      <div className="toggle-switch__thumb" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="toggle-switch__option"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

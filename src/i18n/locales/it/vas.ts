import type { CheckInIntensity } from '@/entities/check-in/types'
import type { VasLevel } from '../../types'

/** Descrizioni in linguaggio semplice della scala VAS (scala analogica visiva),
 * adattate ad atlete adolescenti — una per livello di intensità. */
export const vas: Record<CheckInIntensity, VasLevel> = {
  0: {
    label: 'Per niente',
    description: 'Il tuo corpo è a suo agio e senza dolore.',
  },
  1: {
    label: 'Appena percettibile',
    description:
      'Puoi sentire qualcosa se ti concentri, ma è così lieve che potresti dimenticartene facilmente.',
  },
  2: {
    label: 'Lieve',
    description: 'Lo noti ogni tanto. Non cambia quello che stai facendo né come ti muovi.',
  },
  3: {
    label: 'Lieve+',
    description:
      'C’è. Ne sei consapevole, ma non ti impedisce di fare niente. Gestibile.',
  },
  4: {
    label: 'Moderato',
    description:
      'Attira la tua attenzione. Ti ritrovi ad adattare il modo in cui ti muovi o a pensarci durante le pause.',
  },
  5: {
    label: 'Moderato+',
    description:
      'È difficile ignorarlo. Riesci ancora ad allenarti, ma ti ritrovi a compensare: cambi tecnica, favorisci un lato o eviti certi movimenti.',
  },
  6: {
    label: 'Moderato-forte',
    description:
      'Influisce su ciò che riesci a fare. Rallenti, ti trattieni o interrompi gli esercizi prima del previsto a causa sua.',
  },
  7: {
    label: 'Forte',
    description:
      'Domina la tua attenzione. Ti impedisce di muoverti normalmente e ti fa fermare o modificare molto quello che stai facendo.',
  },
  8: {
    label: 'Molto forte',
    description:
      'Difficile fare qualsiasi cosa. È difficile concentrarsi su altro. Il tuo corpo sta mandando un segnale fortissimo per attirare la tua attenzione.',
  },
  9: {
    label: 'Intenso',
    description: 'Quasi insopportabile. Il tuo corpo chiede attenzione e sostegno.',
  },
  10: {
    label: 'Il peggiore possibile',
    description:
      'Il peggior dolore che tu possa immaginare. Il tuo corpo chiede sostegno e attenzione immediati.',
  },
}

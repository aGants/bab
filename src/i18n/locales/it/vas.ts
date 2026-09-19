import type { CheckInIntensity } from '@/entities/check-in/types'
import type { VasLevel } from '../../types'

/** Descrizioni in linguaggio semplice della scala VAS (scala analogica visiva),
 * adattate ad atlete adolescenti — una per livello di intensità. */
export const vas: Record<CheckInIntensity, VasLevel> = {
  0: {
    label: 'Niente',
    description: `Il tuo corpo si sente bene e senza dolore.`,
  },
  1: {
    label: 'Appena percettibile',
    description:
      `Puoi sentire qualcosa se ci fai caso, ma è così leggero che potresti facilmente dimenticartene.`,
  },
  2: {
    label: 'Lieve',
    description:
      `Lo noti ogni tanto, ma non impatta quello che stai facendo o come ti muovi.`,
  },
  3: {
    label: 'Lieve+',
    description:
      `C'è. Ne sei consapevole, ma non ti impedisce di fare nulla. Gestibile.`,
  },
  4: {
    label: 'Moderato',
    description:
      `Sta attirando la tua attenzione. Ti ritrovi ad aggiustare il modo in cui ti muovi o a pensarci durante le pause.`,
  },
  5: {
    label: 'Moderato+',
    description:
      `È difficile da ignorare. Riesci ancora ad allenarti ma ti ritrovi a compensare: cambiando tecnica, utilizzando di più un lato, o evitando certi movimenti.`,
  },
  6: {
    label: 'Moderato-alto',
    description:
      `Sta condizionando quello che riesci a fare. Ti fa rallentare, trattenere o interrompere gli esercizi.`,
  },
  7: {
    label: 'Forte',
    description:
      `Sta dominando la tua attenzione. Ti impedisce di allenarti normalmente e ti costringe a fermarti o a modificare in modo significativo quello che stai facendo.`,
  },
  8: {
    label: 'Molto forte',
    description:
      `Difficile fare quasi qualsiasi cosa. È difficile concentrarsi su altro. Il tuo corpo ti sta mandando un segnale molto forte per attirare la tua attenzione.`,
  },
  9: {
    label: 'Intenso',
    description:
      `Quasi insopportabile. Il tuo corpo sta chiedendo attenzione e supporto.`,
  },
  10: {
    label: 'Il peggiore possibile',
    description:
      `Il peggior dolore che tu possa immaginare. Il tuo corpo sta chiedendo supporto e attenzione immediati.`,
  },
}

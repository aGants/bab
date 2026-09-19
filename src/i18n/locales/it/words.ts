import type { CategoryId, WordId } from '@/entities/word'
import type { WordText } from '../../types'

// Traduzione italiana, rivolta a te con il "tu". L'app è pensata solo per ragazze, quindi
// tutto ciò che si accorda con chi legge sta al femminile ("ti sei scaldata"). Le parole-sensazione
// stanno al femminile singolare (o sono nomi), perché compaiono anche da sole, ad esempio in
// "Sensazione: …"; "la zona" è il riferimento per i pronomi ("quando la muovi").

export const categories: Record<CategoryId, string> = {
  muscle: 'Segnali muscolari',
  pain: 'Tipi di dolore',
  cycle: 'Ciclo e ormoni',
  energy: 'Energia e carburante',
}

export const words: Record<WordId, WordText> = {
  // Segnali muscolari
  strong: {
    word: 'forte',
    tagline: 'Nota quanta carica hai',
    metaphor: 'Il tuo corpo ha potenza da dare.',
    description:
      'Una sensazione di forza può voler dire che i muscoli si sentono potenti, capaci e pronti a dare il massimo.',
    feelsLike:
      'Le gambe prima di uno scatto, quando le senti solide, potenti e pronte a spingerti in avanti.',
    recommendation:
      'Il tuo corpo è pronto. Riscaldati bene e goditi l’allenamento. Ricorda questa sensazione per confrontarla con i giorni più duri.',
  },
  light: {
    word: 'leggera',
    tagline: 'Nota quanto sono fluidi i tuoi movimenti',
    metaphor: 'Come se la gravità avesse mollato la presa.',
    description:
      'Il tuo corpo si sente agile, fluido e libero di muoversi. Senza tensione, come se la gravità avesse mollato la presa.',
    feelsLike:
      'Saltellare sulle punte dei piedi e sentire il corpo muoversi con facilità: fresco, fluido ed elastico.',
    recommendation:
      'Ottimo segno: il recupero è andato bene. È un buon giorno per la velocità, per il lavoro tecnico o per qualsiasi cosa richieda freschezza.',
  },
  sore: {
    word: 'indolenzita',
    tagline: 'Nota quanto è sensibile',
    metaphor: 'Il conto del giorno dopo.',
    description:
      'Il conto che i muscoli presentano 24–48 ore dopo un lavoro nuovo o più intenso. Una sensazione profonda, persistente e difficile da localizzare, come un fastidio costante e diffuso. Spesso riguarda più di una parte del corpo. Si estende a tutto il muscolo, di solito da entrambi i lati, peggio al primo movimento e meglio quando ti sei scaldata.',
    feelsLike: 'Più sensibile e dolente del solito quando la tocchi, la muovi o la usi.',
    recommendation:
      'Normale dopo un lavoro intenso o nuovo. Aiutano movimento leggero, stretching e foam roller. Se è da un lato solo o dura più di 3 giorni, parlane con il tuo allenatore, il medico, un genitore o chi si prende cura di te.',
  },
  achy: {
    word: 'dolorante',
    tagline: 'Nota quanto è profondo',
    metaphor: 'Il ronzio di una radio che non riesci a spegnere.',
    description:
      'Una sensazione profonda e un po’ pesante, diffusa nei muscoli più che in un punto preciso. Sorda e vaga, senza contorni netti. Spesso riguarda più parti del corpo insieme.',
    feelsLike:
      'Una sensazione sorda e profonda che non se ne va. Un muscolo che dice: “Oggi ho fatto tanto e voglio che tu lo sappia.”',
    recommendation:
      'I tuoi muscoli stanno elaborando molto. Fai stretching, bevi, mangia bene e dormi a sufficienza. Se continua a tornare, confronta il tuo recupero con il tuo allenatore.',
  },
  tight: {
    word: 'tesa',
    tagline: 'Nota cosa succede quando la muovi',
    metaphor: 'Come un muscolo tirato e accorciato.',
    description:
      'Una sensazione di tensione può far sentire una parte del corpo contratta, limitata, come se non avesse la sua solita libertà di movimento.',
    feelsLike:
      'Qualcosa di teso che limita il movimento e ti trattiene. Come cercare di allungare un elastico che non vuole più allungarsi.',
    recommendation:
      'Oggi fai stretching e riscaldamento un po’ più a lungo. Se la tensione è sempre nello stesso punto, parlane con il tuo allenatore o fisioterapista.',
  },
  stiff: {
    word: 'rigida',
    tagline: 'Dagli il tempo di sciogliersi',
    metaphor: 'Una cerniera incastrata.',
    description:
      'Una parte del corpo rigida può essere più difficile da muovere o da estendere del tutto rispetto al solito. Può peggiorare nei primi minuti del mattino o dopo un po’ di immobilità, e sciogliersi con movimenti dolci, riscaldamento o cambiando posizione.',
    feelsLike:
      'Un blocco che si apre con un movimento dolce. Le gambe quando scendi dal letto dopo aver dormito a lungo nella stessa posizione.',
    recommendation:
      'Normale, soprattutto al mattino o dopo un po’ di immobilità. Di solito passa con movimenti dolci e riscaldamento.',
  },
  unstable: {
    word: 'instabile',
    tagline: 'Evita di forzare',
    metaphor: 'La gamba traballante di un tavolo.',
    description:
      'Una parte del corpo sembra traballante, tremante o meno sicura del solito. I muscoli che la tengono stabile non stanno al passo con quello che chiedi, di solito con la stanchezza, negli atterraggi o nei cambi di direzione. Potrebbe cedere e non essere affidabile sotto carico.',
    feelsLike:
      'Non ti fidi del tutto che ti sostenga o si muova come ti aspetti. Come salire su una sedia con una gamba allentata.',
    recommendation:
      'In questo momento il tuo corpo non riesce a fidarsi del tutto di questa zona. Non forzare. Riduci il carico e avvisa il tuo allenatore. Se cede, fatti valutare.',
  },
  // Tipi di dolore
  crampy: {
    word: 'crampi',
    tagline: 'Nota il ritmo',
    metaphor: 'Come se qualcosa dentro si stringesse e si rilassasse.',
    description:
      'Una sensazione di crampi spesso arriva a ondate, con una stretta che cresce, resta per un paio di secondi, si allenta e può tornare.',
    feelsLike:
      'Chiudere il pugno, tenerlo stretto per un momento, poi lasciarlo aprire, solo che la stretta è dentro il tuo corpo.',
    recommendation:
      'Una stretta che arriva a ondate. Se è nella pancia e intorno al ciclo, movimento leggero e calore possono aiutare. Se è in un muscolo (come il polpaccio o il piede), fermati, allungalo dolcemente e bevi acqua. I crampi muscolari spesso indicano disidratazione o muscoli affaticati. Se i crampi ti fermano spesso dall’allenamento, parlane con un medico, con l’allenatore o con chi si prende cura di te.',
  },
  gripping: {
    word: 'a morsa',
    tagline: 'Nota quanto dura',
    metaphor: 'Una mano che non molla.',
    description:
      'Una stretta costante in un punto preciso. Ti costringe a mantenere una certa posizione e ti ritrovi a proteggerlo. Spesso è un muscolo che protegge qualcosa.',
    feelsLike:
      'Una forte sensazione di stretta, come se qualcosa dentro il tuo corpo afferrasse o serrasse.',
    recommendation:
      'Qualcosa si contrae per proteggere una zona. Non forzare. Riposa, applica calore leggero e, se non passa in un giorno o due, chiedi aiuto.',
  },
  sharp: {
    word: 'acuta',
    tagline: 'Riesci a indicare esattamente dove la senti?',
    metaphor: 'Un taglietto di carta.',
    description:
      'Improvvisa e precisa: puoi indicare con un dito il punto esatto. Può arrivare in un momento specifico del movimento. Una sensazione acuta ti fa cambiare quello che stai facendo.',
    feelsLike: 'Una sensazione rapida e appuntita che ti fa notare subito quel punto.',
    recommendation:
      'Interrompi il movimento che l’ha causato. Se riesci a indicare il punto esatto con un dito, è un’informazione importante. Non rimetterlo alla prova: segnalalo al tuo allenatore e chiedi aiuto se ritorna.',
  },
  stabbing: {
    word: 'lancinante',
    tagline: 'Fermati e ascolta',
    metaphor: 'Una fitta improvvisa come un ago.',
    description:
      'Una sensazione lancinante è appuntita e penetrante, come se qualcosa ti avesse punto o infilzato per un attimo da dentro. Se “acuto” dice “non così”, lancinante dice “per niente”.',
    feelsLike:
      'Una fitta rapida come un ago che ti fa fermare e notare esattamente dove è successo.',
    recommendation:
      'È il segnale di stop più forte del tuo corpo. Ferma ogni attività su quella zona. Avvisa il tuo allenatore e un adulto di fiducia. Fatti valutare da un fisioterapista o da un medico: non provare a tirare dritto.',
  },
  burning: {
    word: 'bruciante',
    tagline: 'Nota se svanisce',
    metaphor: 'Un fiammifero, non un incendio.',
    description:
      'Una sensazione calda e pungente dentro un muscolo, che può crescere durante uno sforzo intenso. Quando dipende dall’aver lavorato duro, di solito passa poco dopo che rallenti o ti fermi.',
    feelsLike:
      'Le cosce su una lunga rampa di scale. Cresce mentre sali e si calma quando arrivi in cima.',
    recommendation:
      'Sensazione comune durante uno sforzo intenso, che dovrebbe svanire nel giro di qualche minuto dopo che ti fermi. Se non svanisce, o compare a bassa intensità o a riposo, fermati e segnalalo al tuo allenatore.',
  },
  tingling: {
    word: 'formicolio',
    tagline: 'Osserva le piccole scintille',
    metaphor: 'Una bibita frizzante sotto la pelle.',
    description:
      'Spesso è un nervo schiacciato o irritato. Alcune ragazze possono avvertire formicolio a mani o piedi prima del ciclo.',
    feelsLike:
      'Il piede “addormentato” quando ci resti seduta sopra troppo a lungo. Una sensazione frizzante che corre lungo una linea.',
    recommendation:
      'Spesso è un nervo schiacciato. Cambia posizione e allenta ciò che stringe (scarpe, lacci, cinghie). Se succede sempre nello stesso punto, parlane con il tuo staff o con i tuoi genitori.',
  },
  numb: {
    word: 'intorpidita',
    tagline: 'Nota cosa è cambiato',
    metaphor: 'Il volume portato a zero.',
    description:
      'L’intorpidimento significa che senti meno del solito, o quasi niente. Tatto, pressione o temperatura possono sembrare attutiti o lontani.',
    feelsLike:
      'Come se una parte del corpo fosse andata in silenzio. Capisci che la stai toccando, ma solo debolmente, come la pelle dietro un guanto o uno strato di vestiti.',
    recommendation:
      'Se è breve e dovuto a una posizione mantenuta a lungo, muoviti piano finché passa. Se succede durante l’esercizio, si estende o non passa, fermati e fatti valutare. L’intorpidimento durante lo sport merita sempre un controllo.',
  },
  // Ciclo e ormoni
  bloated: {
    word: 'gonfia',
    tagline: 'Nota se viene da dentro',
    metaphor: 'Un palloncino che si gonfia lentamente.',
    description:
      'Una sensazione di pienezza, pressione o tensione dall’interno. La parte del corpo può sembrare più tesa o gonfia senza che nulla cambi in modo visibile.',
    feelsLike:
      'Come se la pancia si fosse gonfiata dall’interno. Una sensazione di tensione e pressione che la posizione seduta può peggiorare.',
    recommendation:
      'Molto comune intorno al ciclo. Bevi tanta acqua (aiuta!) e indossa vestiti comodi.',
  },
  tender: {
    word: 'sensibile',
    tagline: 'Nota se il tocco peggiora la sensazione',
    metaphor: 'Un livido che non si vede.',
    description:
      'Una parte del corpo è più sensibile o dolorante del solito quando viene toccata, premuta o urtata, anche se non c’è stato nessun infortunio.',
    feelsLike: 'La manopola della sensibilità del tuo corpo è stata alzata.',
    recommendation:
      'La sensibilità senza infortunio può essere comune prima del ciclo. Indossa abiti che sostengono.',
  },
  nauseous: {
    word: 'nauseata',
    tagline: 'Nota se arriva a ondate',
    metaphor: 'Una barca che dondola.',
    description: 'Una sensazione di nausea e disagio che può andare e venire a ondate.',
    feelsLike:
      'Quella sensazione ondeggiante e sgradevole in un lungo viaggio in auto, in cui tutto sembra muoversi un po’ troppo.',
    recommendation:
      'Bevi acqua a piccoli sorsi. Mangia qualcosa di leggero e semplice. Non allenarti a stomaco vuoto. Se succede spesso insieme a giramenti di testa o tremori, controlla come ti alimenti.',
  },
  swollen: {
    word: 'tumefatta',
    tagline: 'Nota il cambiamento',
    metaphor: 'Un palloncino d’acqua sotto la pelle.',
    description:
      'Come se ci fosse più spazio occupato. Una zona gonfia può sembrare più piena, più tesa o più pesante del solito. A volte la differenza si vede; a volte la senti soprattutto.',
    feelsLike: 'Un dito quando l’anello che porti è diventato all’improvviso troppo stretto.',
    recommendation:
      'Se è da entrambi i lati e intorno al ciclo: normale ritenzione di liquidi. Se è da un lato solo e dopo un infortunio: ghiaccio, tieni la parte sollevata e chiedi aiuto.',
  },
  hot: {
    word: 'calda',
    tagline: 'Caldo da dentro o da fuori?',
    metaphor: 'Il retro di un portatile acceso da tanto.',
    description:
      'Una sensazione di calore può essere superficiale, come una pelle più calda del solito al tatto, o più profonda dentro il corpo. Il dolore caldo è una sensazione di bruciore profondo che si diffonde nei tessuti come un liquido bollente.',
    feelsLike: 'Un fuoco sordo e pesante che sembra sciogliere i muscoli da dentro.',
    recommendation:
      'Bevi più acqua per idratarti e fai pause all’ombra (se sei al sole). Se hai molto caldo insieme a giramenti di testa, confusione, o hai smesso di sudare, chiedi aiuto subito.',
  },
  // Energia e carburante
  heavy: {
    word: 'pesante',
    tagline: 'Nota quanta fatica richiede ogni cosa',
    metaphor: 'La gravità è stata alzata.',
    description:
      'Tutto il corpo si sente appesantito, pigro e lento a rispondere. Ogni movimento costa più fatica del solito, come se la gravità fosse stata aumentata.',
    feelsLike:
      'Muoversi nell’acqua fino alla vita. Gambe, braccia e persino la testa sembrano fatte di qualcosa di più pesante del solito.',
    recommendation:
      'Oggi tutto costa più fatica. Il tuo corpo potrebbe aver bisogno di più carburante, sonno o recupero. Prova ad andarci piano e osserva cosa succede. Se questa sensazione si presenta spesso, parlane con il tuo allenatore.',
  },
  dizzy: {
    word: 'stordita',
    tagline: 'Fermati. Lascia che il mondo ti raggiunga',
    metaphor: 'Una trottola che rallenta.',
    description:
      'La stanza si inclina, l’equilibrio vacilla o tutto sembra leggermente fuori asse. Può arrivare all’improvviso, in un lampo.',
    feelsLike:
      'Alzarti di scatto dal letto e vedere il pavimento inclinarsi per un secondo o due.',
    recommendation:
      'Fermati e siediti. Bevi acqua e mangia qualcosa. Aspetta che passi del tutto prima di tornare ad allenarti. Se continua a succedere, parlane con un medico.',
  },
  headachy: {
    word: 'mal di testa',
    tagline: 'Nota dove si trova la pressione',
    metaphor: 'Una fascia troppo stretta.',
    description:
      'Pressione, pulsazioni o dolore intorno alla fronte, alle tempie o alla nuca.',
    feelsLike:
      'Una fascia di pressione che ti stringe la testa, o un tonfo sordo dietro gli occhi che si fa più forte quando ti pieghi in avanti.',
    recommendation:
      'Bevi acqua, riposa in un posto tranquillo e, se puoi, stai lontano dagli schermi. Può essere comune anche intorno al ciclo.',
  },
  foggy: {
    word: 'annebbiata',
    tagline: 'Nota se i pensieri sono più lenti',
    metaphor: 'Una finestra appannata.',
    description:
      'Il cervello sembra confuso, lento o scollegato. Decisioni che di solito sono istantanee richiedono più tempo, perdi segnali che di solito cogli, o ti ritrovi a fissare il vuoto.',
    feelsLike:
      'Leggere la stessa frase tre volte senza riuscire a capirla. Conoscere la risposta ma non riuscire a raggiungerla.',
    recommendation:
      'Il tuo cervello potrebbe aver bisogno di più carburante, acqua o sonno. Se succede spesso, parlane con chi ti sostiene.',
  },
  shaky: {
    word: 'tremante',
    tagline: 'Nota se il tuo corpo ha bisogno di carburante',
    metaphor: 'Un telefono al 3% di batteria.',
    description:
      'Un tremore interno o una sensazione di instabilità: il tuo sistema ti dice che sta finendo le energie.',
    feelsLike: 'La sensazione tremolante e vuota che ti fa sentire debole e instabile',
    recommendation:
      'Il tuo corpo potrebbe aver bisogno di più energia per sostenerti. Ricordati di fare il pieno di carburante prima e dopo l’allenamento, soprattutto se questa sensazione continua a presentarsi.',
  },
}

import mercuryoLogo from '../assets/exchange-form/mercuryo.svg'
import visaLogo from '../assets/exchange-form/visa.svg'
import masterCardLogo from '../assets/exchange-form/master-card.svg'
import simplexLogo from '../assets/exchange-form/simplex.svg'
import sepaLogo from '../assets/exchange-form/sepa.svg'

const providers = [
    {
      name: 'mercuryo',
      logo: mercuryoLogo,
      payments: [visaLogo, masterCardLogo],
    },
    {
      name: 'simplex',
      logo: simplexLogo,
      payments: [visaLogo, masterCardLogo, sepaLogo],
    },
  ] as const;
  
  export type ProviderName = (typeof providers)[number]['name'];

  export default providers;
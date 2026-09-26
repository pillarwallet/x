enum VIEW_TYPE {
  EXCHANGE = 1,
  FAQ = 2,
  RECIPIENT = 3,
  CONFIRM = 4,
  SUCCESS = 5,
  CANCELLED = 6,
  ERROR= 7,
}

interface IViewSettings {
  id: VIEW_TYPE
  name: string
  view: string
  backView: VIEW_TYPE | null
}

const VIEWS_SETTINGS: Record<keyof typeof VIEW_TYPE, IViewSettings> = {
  EXCHANGE: {
    id: VIEW_TYPE.EXCHANGE,
    name: 'Exchange',
    view: 'exchangeView',
    backView: null
  },
  FAQ: {
    id: VIEW_TYPE.FAQ,
    name: 'FAQ',
    view: 'faqView',
    backView: VIEW_TYPE.EXCHANGE
  },
  RECIPIENT: {
    id: VIEW_TYPE.RECIPIENT,
    name: 'Recipient',
    view: 'recipientView',
    backView: VIEW_TYPE.EXCHANGE
  },
  CONFIRM: {
    id: VIEW_TYPE.CONFIRM,
    name: 'Confirm',
    view: 'confirmView',
    backView: VIEW_TYPE.CONFIRM
  },
  SUCCESS: {
    id: VIEW_TYPE.SUCCESS,
    name: 'Success',
    view: 'confirmView',
    backView: VIEW_TYPE.CONFIRM
  },
  CANCELLED: {
    id: VIEW_TYPE.CANCELLED,
    name: 'Cancelled',
    view: 'cancelledView',
    backView: VIEW_TYPE.CONFIRM
  },
  ERROR: {
    id: VIEW_TYPE.ERROR,
    name: 'Error',
    view: 'errorView',
    backView: VIEW_TYPE.ERROR
  }
}

export {
  VIEWS_SETTINGS,
  VIEW_TYPE,
}
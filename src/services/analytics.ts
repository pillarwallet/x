import { logEvent as logFirebaseAnalyticsEvent, AnalyticsCallOptions } from '@firebase/analytics';

// services
import { firebaseAnalytics } from './firebase';

export const logEvent = (
  eventName: string,
  eventParams?: { [key: string]: string | number },
  options?: AnalyticsCallOptions
) => {
  logFirebaseAnalyticsEvent(firebaseAnalytics, eventName, eventParams, options);
}

export type ScreenName =
  | 'home' | 'scan' | 'detail' | 'add' | 'trends' | 'alerts';

export type Go = (screen: ScreenName, medicineId?: string) => void;

import { GovernmentSupport } from './gov-support.model';

export interface Citizen {
  dependantQty: number;
  govSupport: GovernmentSupport[];
  hasJob: boolean;
  hasOtherSupport: boolean;
  isSingle: boolean;
  lastPaycheckQty: number;
}

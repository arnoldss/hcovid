import { GovernmentSupport } from './gov-support.model';

export interface Citizen {
  birthDate: Date;
  birthStateId: number;
  dependantQty: number;
  firstname: string;
  govSupport: GovernmentSupport[];
  hasJob: boolean;
  hasOtherSupport: boolean;
  isSingle: boolean;
  maternalLastname: string;
  lastPaycheckQty: number;
  paternalLastname: string;
}

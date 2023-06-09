import { Injectable } from '@nestjs/common';

const detectionRegex = {
  // SSN: /(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)/g,
  email:
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g,
  phone:
    /\(?\+[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\w{1,10}\s?\d{1,6})?/g,
  //   name: /TODO/, // TODO
  //   address: /TODO/, // TODO
  //   ip: /TODO/, // TODO
  credit_card:
    /(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})/g,
};

export type PIICategory =
  | 'SSN'
  | 'name'
  | 'email'
  | 'phone'
  | 'address'
  | 'ip'
  | 'credit_card';

export interface IPIIInstance {
  category: PIICategory;
  string: string;
}

@Injectable()
export class PiiDetectorService {
  async detectPII(input: string): Promise<IPIIInstance[]> {
    const results: Record<string, IPIIInstance> = {};
    for (const [category, regex] of Object.entries(detectionRegex)) {
      let match;
      while ((match = regex.exec(input)) !== null) {
        results[match[0]] = {
          category: category as any,
          string: match[0],
        };
      }
    }
    return Object.values(results);
  }
}

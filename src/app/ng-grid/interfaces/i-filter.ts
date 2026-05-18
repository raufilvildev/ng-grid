export interface IFilter {
  equalsTo?: any;
  doesNotEqualsTo?: any;
  notIn?: any[];
  startsWith?: string;
  doesNotStartWith?: string;
  endsWith?: string;
  doesNotEndWith?: string;
  contains?: string;
  doesNotContain?: string;
  isEmpty?: boolean;
  isNotEmpty?: boolean;
  greaterThan?: number | string; // string -> Date
  lessThan?: number | string; // string -> Date
  greaterThanOrEqualTo?: number | string; // string -> Date
  lessThanOrEqualTo?: number | string; // string -> Date
  isBetween?:
    | { lowerBound?: number; upperBound?: number }
    | { lowerBound?: string; upperBound?: string }; // string -> Date
  isNotBetween?:
    | { lowerBound?: number; upperBound?: number }
    | { lowerBound?: string; upperBound?: string }; // string -> Date
  isNull?: boolean;
  isNotNull?: boolean;
}

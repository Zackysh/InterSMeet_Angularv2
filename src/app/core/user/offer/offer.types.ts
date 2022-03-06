export interface Offer {
  offerId: number;
  applicants: Applicant[];
  applicantCount: number;
  name: string;
  description: string;
  schedule: string;
  salary: number;
  deadLine: Date;
}

export interface Applicant {
  studentId: number;
  status: ApplicantStatus;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  provinceId: number;
  location: string;
  birthDate: Date;
  degreeId: number;
  averageGrades: number;
  avatarId: number;
}

export enum ApplicantStatus {
  pending = 'Pending',
  accepted = 'Accepted',
  denied = 'Denied',
}

export interface OfferPagination {
  page: number;
  size: number;
  skipExpired?: boolean;
  privateData?: boolean;
  search?: string;
  // @ Filters
  degreeId?: number;
  familyId?: number;
  levelId?: number;
  // @ Salary
  min?: number;
  max?: number;
}

export interface OfferPaginationResponse {
  pagination: OfferPagination;
  results: Offer[];
  total: number;
}

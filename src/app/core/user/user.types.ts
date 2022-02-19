export interface User {
  // @ User data
  companyId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  provinceId: number;
  location: string;
  languageId: number;
  emailVerified: boolean;
  // @ Company data
  companyName: string;
  address: string;
}

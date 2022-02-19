export interface User {
  // @ User data
  userId: string;
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

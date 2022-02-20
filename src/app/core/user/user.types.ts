export interface User {
  // @ User data
  companyId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  provinceId: number;
  languageId: number;
  location: string;
  emailVerified: boolean;
  // @ Company data
  companyName: string;
  address: string;
}

export interface Province {
  provinceId: number;
  name: string;
}

export interface Language {
  languageId: number;
  name: string;
}

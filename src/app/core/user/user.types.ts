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
  description?: string;
  web?: string;
  backgroundUrl?: string;
  logoUrl?: string;
}

export class UpdateUser {
  updateUserDto: {
    username: string;
    emaiL: string;
    firstName: string;
    lastName: string;
    provinceId: number;
    languageId: number;
    location: string;
  };
  address: string;
  companyName: string;
  description: string;
  web: string;
  backgroundUrl: string;
  logoUrl: string;

  static fromUser(user: User): UpdateUser {
    return {
      updateUserDto: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        emaiL: user.email,
        location: user.location,
        languageId: user.languageId,
        provinceId: user.provinceId,
      },
      address: user.address,
      companyName: user.companyName,
      description: user.description,
      backgroundUrl: user.backgroundUrl,
      logoUrl: user.logoUrl,
      web: user.web,
    };
  }
}

export interface PublicUser {
  companyId: number;
  address: string;
  companyName: string;
  description?: string;
  web?: string;
  backgroundUrl?: string;
  logoUrl?: string;
  // @ User data
  username: string;
  email: string;
  provinceId: number;
  location: string;
}

export interface Province {
  provinceId: number;
  name: string;
}

export interface Degree {
  degreeId: number;
  name: string;
  levelId: number;
  familyId: number;
}
export interface Level {
  levelId: number;
  name: string;
}
export interface Family {
  familyId: number;
  name: string;
}

export interface Language {
  languageId: number;
  name: string;
}

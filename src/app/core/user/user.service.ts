import { ApplicantStatus } from 'app/core/user/offer/offer.types';
import {
  Degree,
  Language,
  Level,
  PublicUser,
  UpdateUser,
  Family,
} from './user.types';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { Province, User } from 'app/core/user/user.types';
import { Applicant, Offer } from './offer/offer.types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  set user(value: User) {
    this._user.next(value);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  findUserOffers(): Observable<Offer[]> {
    return this._httpClient.get<Offer[]>('core/offers/my-offers');
  }

  findApplicantCount(userId: number): Observable<number> {
    return this._httpClient.get<number>(`core/companies/applicants/${userId}`);
  }

  findAllProvinces(): Observable<Province[]> {
    return this._httpClient.get<Province[]>('core/users/provinces');
  }

  findAllLevels(): Observable<Level[]> {
    return this._httpClient.get<Level[]>('core/students/levels');
  }

  findAllFamilies(): Observable<Family[]> {
    return this._httpClient.get<Family[]>('core/students/families');
  }

  findAllDegrees(): Observable<Degree[]> {
    return this._httpClient.get<Degree[]>('core/students/degrees');
  }

  findAllLanguages(): Observable<Language[]> {
    return this._httpClient.get<Language[]>('core/users/languages');
  }

  /** Get the current logged in user data */
  get(): Observable<User> {
    return this._httpClient
      .get<User>('core/companies/profile')
      .pipe(tap((user) => this._user.next(user)));
  }

  findPublicProfile(username: string): Observable<PublicUser> {
    return this._httpClient.get<User>(`core/companies/profile/${username}`);
  }

  updateApplicationStatus(
    offerId: number,
    studentId: number,
    status: ApplicantStatus
  ): Observable<Applicant> {
    return this._httpClient.put<Applicant>(
      `core/offers/applications/update-status/${offerId}/${studentId}`,
      { status }
    );
  }

  update(user: User): Observable<User> {
    return this._httpClient
      .put<{ accessToken: string; refreshToken: string; user: User }>(
        'core/companies/update-profile',
        UpdateUser.fromUser(user)
      )
      .pipe(
        map((response) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          this._user.next(response.user);
          return response.user;
        })
      );
  }
}

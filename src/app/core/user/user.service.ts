import { Language } from './user.types';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { Province, User } from 'app/core/user/user.types';

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

  findAllProvinces(): Observable<Province[]> {
    return this._httpClient.get<Province[]>('core/users/provinces');
  }

  findAllLanguages(): Observable<Language[]> {
    return this._httpClient.get<Language[]>('core/users/languages');
  }

  /** Get the current logged in user data */
  get(): Observable<User> {
    return this._httpClient.get<User>('core/companies/profile').pipe(
      tap((user) => {
        this._user.next(user);
      })
    );
  }

  update(user: User): Observable<any> {
    return this._httpClient.patch<User>('api/common/user', { user }).pipe(
      map((response) => {
        this._user.next(response);
      })
    );
  }
}

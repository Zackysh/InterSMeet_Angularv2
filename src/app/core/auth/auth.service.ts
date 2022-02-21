import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { User } from '../user/user.types';

@Injectable()
export class AuthService {
  private _authenticated: boolean = false;

  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get refreshToken(): string {
    return localStorage.getItem('refreshToken') ?? '';
  }

  set refreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get mailVerified(): boolean {
    return JSON.parse(localStorage.getItem('mailVerified')) === true;
  }

  set mailVerified(verified: boolean) {
    localStorage.setItem('mailVerified', `${verified}`);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------
  // @ Email
  // -----------------------------------------------------------------------------------------------------

  emailVerification(accessToken: string, code: string): Observable<any> {
    return this._httpClient
      .post(
        `core/users/confirm-email/${code}`,
        {},
        { headers: { authorization: accessToken } }
      )
      .pipe(
        catchError(() => of(false)),
        switchMap((err?: boolean) => {
          if (err !== false) {
            this.mailVerified = true;
            return of(true);
          }
          return of(false);
        })
      );
  }

  /**
   * Send email verification code.
   *
   * @returns true if email is sent
   * @returns false if email was already verified
   */
  sendMailVerificationCode(): Observable<any> {
    return this._httpClient
      .post(
        'core/users/send-confirm-email',
        {},
        { headers: { authorization: this.accessToken } }
      )
      .pipe(
        catchError(() =>
          // already verified
          of(false)
        ),
        switchMap((err) => {
          if (err !== false) {
            return of(true);
          }
          return of(false);
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this._httpClient.post('api/auth/forgot-password', email);
  }

  resetPassword(password: string): Observable<any> {
    return this._httpClient.post('api/auth/reset-password', password);
  }

  signIn(credentials: {
    email: string;
    password: string;
  }): Observable<User | number> {
    return this._httpClient
      .post('core/users/sign-in/company', credentials, {})
      .pipe(
        catchError((error: HttpErrorResponse) => of(error.status)),
        switchMap(
          (response: {
            accessToken: string;
            refreshToken: string;
            user: User;
          }) => {
            if (typeof response === 'number') {
              return of(response);
            }
            this.accessToken = response.accessToken;
            this.refreshToken = response.refreshToken;
            this._authenticated = true;
            this._userService.user = response.user;

            this.mailVerified = response.user.emailVerified ? true : false;

            // Return a new observable with the response
            return of(response.user);
          }
        )
      );
  }

  signOut(): Observable<any> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('mailVerified');
    this._authenticated = false;

    return of(true);
  }

  signUp(user: User): Observable<any> {
    const userSignUpDto = { ...user };
    return this._httpClient.post('core/users/sign-up/company', {
      userSignUpDto,
      ...user,
    });
  }

  checkUsername(username: string): Observable<boolean> {
    return this._httpClient
      .post(`core/users/check/username/?username=${username}`, {})
      .pipe(
        catchError(() => of(false)),
        switchMap((err) => of(err !== false))
      );
  }

  checkEmail(email: string): Observable<boolean> {
    return this._httpClient
      .post(`core/users/check/email/?email=${email}`, {})
      .pipe(
        catchError(() => of(false)),
        switchMap((err) => of(err !== false))
      );
  }

  /** Check the authentication status */
  check(): Observable<boolean> {
    if (this._authenticated && this.mailVerified) {
      return of(true);
    }

    return of(this.accessToken && this.mailVerified ? true : false);
  }
}

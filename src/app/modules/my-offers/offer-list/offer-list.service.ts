import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApplicantStatus,
  Offer,
  OfferPagination,
  OfferPaginationResponse,
} from 'app/core/user/offer/offer.types';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OfferService {
  selectedOfferChanged: BehaviorSubject<any> = new BehaviorSubject(null);
  private _offers: BehaviorSubject<Offer[]> = new BehaviorSubject(null);
  private _offersLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _offer: BehaviorSubject<Offer> = new BehaviorSubject(null);
  private _pagination: BehaviorSubject<OfferPaginationResponse> =
    new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get offers$(): Observable<Offer[]> {
    return this._offers.asObservable();
  }

  get offersLoading$(): Observable<boolean> {
    return this._offersLoading.asObservable();
  }

  get offer$(): Observable<Offer> {
    return this._offer.asObservable();
  }

  get pagination$(): Observable<OfferPaginationResponse> {
    return this._pagination.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  // @ API

  offerPagination(pagination: OfferPagination): Observable<Offer[]> {
    this._offersLoading.next(true);

    let params = new HttpParams();

    params = params.append('page', `${pagination.page}`);
    params = params.append('size', `${pagination.size}`);
    params = params.append('privateData', 'true');
    params =
      pagination.skipExpired !== undefined
        ? params.append('skipExpired', `${pagination.skipExpired}`)
        : params;
    params = pagination.degreeId
      ? params.append('degreeId', `${pagination.degreeId}`)
      : params;
    params = pagination.familyId
      ? params.append('familyId', `${pagination.familyId}`)
      : params;
    params = pagination.levelId
      ? params.append('levelId', `${pagination.levelId}`)
      : params;
    params = pagination.search
      ? params.append('search', `${pagination.search}`)
      : params;
    params = pagination.min
      ? params.append('min', `${pagination.min}`)
      : params;
    params = pagination.max
      ? params.append('max', `${pagination.max}`)
      : params;

    return this._httpClient
      .get<OfferPaginationResponse>('core/offers/pagination', { params })
      .pipe(
        tap((response) => {
          this._offers.next(response.results);
          this._pagination.next(response);
          this._offersLoading.next(false);
        }),
        switchMap((response) => of(response.results))
      );
  }

  findOfferById(id: number): Observable<Offer> {
    return this._offers.pipe(
      take(1),
      map((offers) => {
        const offer = offers.find((item) => item.offerId === id) || null;

        this._offer.next(offer);
        return offer;
      }),
      switchMap((offer) => {
        if (!offer) {
          return throwError(
            () => 'Could not found offer with id of ' + id + '!'
          );
        }

        return of(offer);
      })
    );
  }

  createOffer(offer: Offer): Observable<Offer> {
    return this._httpClient
      .post<Offer>('core/offers', offer)
      .pipe(tap((res) => this._offers.next([...this._offers.value, res])));
  }

  updateOffer(offerId: number, offer: Offer): Observable<Offer> {
    return this._httpClient
      .put<Offer>(`core/offers/${offerId}`, offer)
      .pipe(tap((res) => this.updateOffer$(offerId, res, true)));
  }

  removeOffer(offerId: number): Observable<Offer> {
    return this._httpClient.delete<Offer>(`core/offers/${offerId}`).pipe(
      tap(() => {
        this._offer.next(null);
        this._offers.next(
          this._offers.value.filter((o) => o.offerId !== offerId)
        );
      })
    );
  }

  // @ State

  updateOffer$(offerId: number, offer: Offer, onList = false): void {
    this._offer.next(offer);
    if (onList) {
      this._offers.next(
        this._offers.value.map((o) => (o.offerId !== offerId ? o : offer))
      );
    }
  }

  resetOffer(): void {
    this._offer.next(null);
  }

  updateApplicantStatus(
    offerId: number,
    studentId: number,
    status: ApplicantStatus
  ): void {
    // eslint-disable-next-line no-debugger
    debugger;
    const offer = this._offers.value.find((o) => o.offerId === offerId);

    if (offer) {
      offer.applicants = offer.applicants.map((a) =>
        a.studentId === studentId ? { ...a, status } : a
      );

      this._offers.next(
        this._offers.value.map((o) => (o.offerId === offerId ? offer : o))
      );
    }
  }
}

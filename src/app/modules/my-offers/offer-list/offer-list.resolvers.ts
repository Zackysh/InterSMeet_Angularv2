import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Offer } from 'app/core/user/offer/offer.types';
import { Observable } from 'rxjs';
import { OfferService } from './offer-list.service';

@Injectable({
  providedIn: 'root',
})
export class OffersResolver implements Resolve<any> {
  constructor(private _offerService: OfferService) {}

  resolve(): Observable<Offer[]> | any {
    return this._offerService.offerPagination({
      page: 0,
      size: 15,
      privateData: true,
    });
  }
}

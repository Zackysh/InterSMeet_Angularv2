import { FormHelper } from 'app/shared/form.helper';
import { OfferPagination } from './../../../../core/user/offer/offer.types';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Offer } from 'app/core/user/offer/offer.types';
import { OfferListComponent } from 'app/modules/my-offers/offer-list/offer-list.component';
import { OfferService } from 'app/modules/my-offers/offer-list/offer-list.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'offer-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferListListComponent implements OnInit, OnDestroy {
  @ViewChild('offerList') offerList: ElementRef;

  offers: Offer[];
  offersLoading: boolean = false;
  pagination: OfferPagination;
  totalCount: number = 0;
  lastPage: number = 0;
  startIndex: number = 0;
  lastIndex: number = 0;
  selectedOffer: Offer;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public offerListComponent: OfferListComponent,
    private _offerService: OfferService,
    private _formHelper: FormHelper,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  expired(date: Date): boolean {
    const deadline = this._formHelper.formatDate(date);
    const current = this._formHelper.formatDate(new Date());

    return deadline <= current;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._offerService.offers$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((offers: Offer[]) => {
        this.offers = offers;

        this._changeDetectorRef.markForCheck();
      });

    this._offerService.offersLoading$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((offersLoading: boolean) => {
        this.offersLoading = offersLoading;

        if (this.offerList && !offersLoading) {
          // Reset the offer list element scroll position to top
          this.offerList.nativeElement.scrollTo(0, 0);
        }

        this._changeDetectorRef.markForCheck();
      });

    // Pagination
    this._offerService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.pagination = res.pagination;
        this.totalCount = res.total;
        this.lastPage = Math.ceil(res.total / res.pagination.size);
        // start index
        this.startIndex =
          (res.pagination.page + 1) * res.pagination.size -
          (res.pagination.size - 1);
        // last index
        const last = (res.pagination.page + 1) * res.pagination.size;
        this.lastIndex = last <= this.totalCount ? last : this.totalCount;

        this._changeDetectorRef.markForCheck();
      });

    // Selected offer
    this._offerService.offer$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((offer: Offer) => {
        this.selectedOffer = offer;
        this._changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  sizeChange(value: string): void {
    this._offerService
      .offerPagination({
        ...this.pagination,
        page: 0,
        size: +value ? +value : 15,
      })
      .subscribe();
  }

  nextPage(): void {
    if (this.pagination.page < this.lastPage - 1) {
      this._offerService
        .offerPagination({
          ...this.pagination,
          page: this.pagination.page + 1,
        })
        .subscribe();
    }
  }

  previousPage(): void {
    if (this.pagination.page > 0) {
      this._offerService
        .offerPagination({
          ...this.pagination,
          page: this.pagination.page - 1,
        })
        .subscribe();
    }
  }

  onOfferSelected(offer: Offer): void {
    // Update offer on the server
    this._offerService.updateOffer$(offer.offerId, offer);

    // Execute the offerSelected observable
    this._offerService.selectedOfferChanged.next(offer);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}

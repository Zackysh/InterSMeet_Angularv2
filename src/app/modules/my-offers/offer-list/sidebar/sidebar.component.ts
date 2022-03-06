import { Degree, Level, Family } from './../../../../core/user/user.types';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OfferPagination } from 'app/core/user/offer/offer.types';
import { Subject, takeUntil } from 'rxjs';
import { OfferFormComponent } from '../form/offer-form.component';
import { OfferService } from '../offer-list.service';
import { UserService } from 'app/core/user/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'offer-list-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferListSidebarComponent implements OnInit, OnDestroy {
  pagination: OfferPagination;
  degrees: Degree[];
  levels: Level[];
  families: Family[];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _matDialog: MatDialog,
    private _offerService: OfferService,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // Pagination
    this._offerService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.pagination = res.pagination;
        this._changeDetectorRef.markForCheck();
      });

    this._userService
      .findAllDegrees()
      .subscribe((degrees) => (this.degrees = degrees));
    this._userService
      .findAllLevels()
      .subscribe((levels) => (this.levels = levels));
    this._userService
      .findAllFamilies()
      .subscribe((families) => (this.families = families));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  addOffer(): void {
    this._offerService.resetOffer();
    const dialogRef = this._matDialog.open(OfferFormComponent);

    dialogRef.afterClosed().subscribe((result) => {});
  }

  skipExpiredChange(value: boolean): void {
    this._offerService
      .offerPagination({
        ...this.pagination,
        skipExpired: value,
      })
      .subscribe();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
}

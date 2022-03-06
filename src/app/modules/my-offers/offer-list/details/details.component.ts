import { FormHelper } from 'app/shared/form.helper';
import { Applicant } from './../../../../core/user/offer/offer.types';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ApplicantStatus, Offer } from 'app/core/user/offer/offer.types';
import { OfferService } from 'app/modules/my-offers/offer-list/offer-list.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { OfferFormComponent } from '../form/offer-form.component';
import { ApplicantDetailsComponent } from '../applicant-details/applicant-details.component';
import { formatDate } from '@angular/common';

@Component({
  selector: 'offer-details',
  templateUrl: './details.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('infoDetailsPanelOrigin')
  private _infoDetailsPanelOrigin: MatButton;
  @ViewChild('infoDetailsPanel') private _infoDetailsPanel: TemplateRef<any>;

  offer: Offer;
  private _overlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _offerService: OfferService,
    private _overlay: Overlay,
    private _matDialog: MatDialog,
    private _formHelper: FormHelper,
    private _viewContainerRef: ViewContainerRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  get expired(): boolean {
    const deadline = this._formHelper.formatDate(this.offer.deadLine);
    const current = this._formHelper.formatDate(new Date());
    return deadline <= current;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._offerService.offer$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((offer: Offer) => {
        this.offer = offer;
        this._changeDetectorRef.markForCheck();
      });

    this._offerService.selectedOfferChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {});
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  openInfoDetailsPanel(): void {
    // Create the overlay
    this._overlayRef = this._overlay.create({
      backdropClass: '',
      hasBackdrop: true,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(
          this._infoDetailsPanelOrigin._elementRef.nativeElement
        )
        .withFlexibleDimensions(true)
        .withViewportMargin(16)
        .withLockedPosition(true)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom',
          },
        ]),
    });

    // Create a portal from the template
    const templatePortal = new TemplatePortal(
      this._infoDetailsPanel,
      this._viewContainerRef
    );

    // Attach the portal to the overlay
    this._overlayRef.attach(templatePortal);

    this._changeDetectorRef.markForCheck();

    // Subscribe to the backdrop click
    this._overlayRef.backdropClick().subscribe(() => {
      // If overlay exists and attached...
      if (this._overlayRef && this._overlayRef.hasAttached()) {
        // Detach it
        this._overlayRef.detach();
      }

      // If template portal exists and attached...
      if (templatePortal && templatePortal.isAttached) {
        // Detach it
        templatePortal.detach();
      }

      this._changeDetectorRef.markForCheck();
    });
  }

  edit(): void {
    const dialogRef = this._matDialog.open(OfferFormComponent);

    dialogRef.afterClosed().subscribe(() => {});
  }

  toggleApplicant(applicant: Applicant): void {
    const dialogRef = this._matDialog.open(ApplicantDetailsComponent, {
      data: { applicant, offerId: this.offer.offerId },
    });

    dialogRef.afterClosed().subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  remove(): void {
    this._offerService
      .removeOffer(this.offer.offerId)
      .subscribe(() => Swal.fire('Offer deleted!', '', 'success'));
  }

  resetOffer(): void {
    this._offerService.resetOffer();
  }

  pendingApplicants(): number {
    return this.offer.applicants.filter(
      (a) => a.status === ApplicantStatus.pending
    ).length;
  }

  acceptedApplicants(): number {
    return this.offer.applicants.filter(
      (a) => a.status === ApplicantStatus.accepted
    ).length;
  }

  deniedApplicants(): number {
    return this.offer.applicants.filter(
      (a) => a.status === ApplicantStatus.denied
    ).length;
  }

  getAvatarUrl(avatarId: number): string {
    return `core/students/avatar/${avatarId}`;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}

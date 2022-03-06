import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Applicant, ApplicantStatus } from 'app/core/user/offer/offer.types';
import { UserService } from 'app/core/user/user.service';
import Swal from 'sweetalert2';
import { OfferService } from '../offer-list.service';

@Component({
  selector: 'offer-form',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ApplicantDetailsComponent implements OnInit {
  applicant: Applicant;
  offerId: number;
  minDate: Date;
  province: string;
  degree: string;

  constructor(
    public matDialogRef: MatDialogRef<ApplicantDetailsComponent>,
    private _userService: UserService,
    private _offerService: OfferService,
    @Inject(MAT_DIALOG_DATA)
    public data: { applicant: Applicant; offerId: number }
  ) {
    this.applicant = data.applicant;
    this.offerId = data.offerId;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // province
    this._userService
      .findAllProvinces()
      .subscribe(
        (p) =>
          (this.province = p.find(
            (pr) => pr.provinceId === this.applicant.provinceId
          ).name)
      );
    // province
    this._userService
      .findAllDegrees()
      .subscribe(
        (p) =>
          (this.degree = p.find(
            (pr) => pr.degreeId === this.applicant.degreeId
          ).name)
      );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  close(): void {
    this.matDialogRef.close();
  }

  accept(): void {
    this._userService
      .updateApplicationStatus(
        this.offerId,
        this.applicant.studentId,
        ApplicantStatus.accepted
      )
      .subscribe(() => {
        this._offerService.updateApplicantStatus(
          this.offerId,
          this.applicant.studentId,
          ApplicantStatus.accepted
        );
        Swal.fire('Applicant status set to "accepted"', '', 'success');
      });
  }
  deny(): void {
    this._userService
      .updateApplicationStatus(
        this.offerId,
        this.applicant.studentId,
        ApplicantStatus.denied
      )
      .subscribe(() => {
        this._offerService.updateApplicantStatus(
          this.offerId,
          this.applicant.studentId,
          ApplicantStatus.denied
        );
        Swal.fire('Applicant status set to "denied"', '', 'success');
      });
  }
  pending(): void {
    this._userService
      .updateApplicationStatus(
        this.offerId,
        this.applicant.studentId,
        ApplicantStatus.pending
      )
      .subscribe(() => {
        this._offerService.updateApplicantStatus(
          this.offerId,
          this.applicant.studentId,
          ApplicantStatus.pending
        );
        Swal.fire('Applicant status set to "pending"', '', 'success');
      });
  }
}

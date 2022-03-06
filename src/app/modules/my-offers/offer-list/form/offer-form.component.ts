import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Offer } from 'app/core/user/offer/offer.types';
import Swal from 'sweetalert2';
import { OfferService } from '../offer-list.service';

@Component({
  selector: 'offer-form',
  templateUrl: './offer-form.component.html',
  styleUrls: ['./offer-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferFormComponent implements OnInit {
  offerForm: FormGroup;
  editMode = false;
  offer: Offer;
  minDate: Date;

  quillModules: any = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  constructor(
    public matDialogRef: MatDialogRef<OfferFormComponent>,
    private _offerService: OfferService,
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  get salary$(): string {
    return this.offerForm.value.salary;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.offerForm = this._formBuilder.group({
      name: ['', Validators.required],
      description: ['', [Validators.required]],
      schedule: [''],
      salary: ['0', [Validators.required]],
      deadLine: ['', [Validators.required]],
    });

    this.offerForm.disable();

    this._offerService.offer$.subscribe((o) => {
      this.offer = o;
      this.offerForm.enable();

      if (o) {
        this.offerForm.patchValue(o);
        this.editMode = true;
        this.minDate = new Date(2022, 1, 1);
      } else {
        this.offerForm.reset();
        this.editMode = false;

        this.minDate = new Date();
        this.minDate.setDate(this.minDate.getDate() + 1);
      }

      this._changeDetectorRef.markForCheck();
    });

    this._changeDetectorRef.markForCheck();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  formatLabel(value: number): string | number {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  discard(): void {
    this.matDialogRef.close();
  }

  create(): void {
    this._offerService.createOffer(this.offerForm.value).subscribe(() => {
      Swal.fire('Offer created!', '', 'success');
      this.matDialogRef.close();
    });
  }

  update(): void {
    this._offerService
      .updateOffer(this.offer.offerId, this.offerForm.value)
      .subscribe(() => {
        Swal.fire('Offer updated!', '', 'success');
        this.matDialogRef.close();
      });
  }
}

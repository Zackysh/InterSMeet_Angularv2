import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'settings-plan-billing',
  templateUrl: './plan-billing.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPlanBillingComponent implements OnInit {
  planBillingForm: FormGroup;
  plans: any[];

  /**
   * Constructor
   */
  constructor(private _formBuilder: FormBuilder) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.planBillingForm = this._formBuilder.group({
      plan: ['team'],
      cardHolder: [''],
      cardNumber: [''],
      cardExpiration: [''],
      cardCVC: [''],
      country: ['es'],
      zip: [''],
    });

    // Setup the plans
    this.plans = [
      {
        value: 'basic',
        label: 'BASIC',
        details: 'Post offers & contact with your applicants.',
        price: '0',
      },
      {
        value: 'team',
        label: 'TEAM',
        details:
          'In addition, search and contact with any student registered in our platform.',
        price: '9',
      },
    ];
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}

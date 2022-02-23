import { Language, Province } from './../../../../core/user/user.types';
import { combineLatest, Observable, of, switchMap } from 'rxjs';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import Swal from 'sweetalert2';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'settings-account',
  templateUrl: './account.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAccountComponent implements OnInit {
  accountForm: FormGroup;
  user: User;
  provinces: Province[];
  languages: Language[];

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // Create the form
    this.accountForm = this._formBuilder.group({
      // @ Public
      username: ['', Validators.required],
      companyName: ['', Validators.required],
      description: [''],
      address: ['', Validators.required],
      location: ['', Validators.required],
      backgroundUrl: [''],
      logoUrl: [''],
      web: [''],
      provinceId: ['', Validators.required],
      // @ Private
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],
      languageId: ['', Validators.required],
    });

    combineLatest([
      this._userService.get(),
      this._userService.findAllProvinces(),
      this._userService.findAllLanguages(),
    ]).subscribe(([user, provinces, languages]) => {
      this.user = user;
      this.provinces = provinces;
      this.languages = languages;

      this.accountForm.patchValue(user);
    });
  }

  submit(): void {
    this.#asyncValidation().subscribe(async (res) => {
      if (res === true) {
        if (
          this.user.email !== this.accountForm.value.email &&
          !(await Swal.fire({
            title: 'You are about to update your e-mail.',
            text: 'If you do so, you will have to verify your new e-mail next time you sign-in.',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#EF4444',
            // Buttons text
            confirmButtonText: 'Continue',
            cancelButtonText: 'Cancel',
          }).then((result) => result.isConfirmed))
        ) {
          return;
        }

        if (this.accountForm.invalid) {
          this.accountForm.markAllAsTouched();
          this._changeDetectorRef.markForCheck();
          return;
        }

        this._userService.update(this.accountForm.value).subscribe(() => {
          Swal.fire('Profile update!', '', 'success');
        });
      }
    });
  }

  #asyncValidation(): Observable<boolean> {
    return combineLatest([
      this._authService.checkUsername(this.accountForm.value.username),
      this._authService.checkEmail(this.accountForm.value.email),
    ]).pipe(
      switchMap((res) => {
        if (!res[0]) {
          this.accountForm.enable();
          Swal.fire('Username not available, try another!', '', 'warning');
        }
        if (!res[1]) {
          this.accountForm.enable();
          Swal.fire('Email not available, try another!', '', 'warning');
        }
        return of(res[0] && res[1]);
      })
    );
  }
}

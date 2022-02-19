import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'auth-sign-in',
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuthSignInComponent implements OnInit {
  @ViewChild('signInNgForm') signInNgForm: NgForm;
  signInForm: FormGroup;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      credential: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  signIn(): void {
    if (this.signInForm.invalid) {
      return;
    }

    this.signInForm.disable();

    this._authService
      .signIn(this.signInForm.value)
      .subscribe((response: any) => {
        this.signInForm.enable();
        if (response === null) {
          // already signed-in
          this._navigateHome();
        } else if (response.companyId) {
          this._navigateHome();
        } else if (response === 401) {
          // wrong password
          const ctrl = this.signInForm.get('password');
          ctrl.setErrors({ ...ctrl.errors, 'wrong-password': true });
        } else if (response === 404) {
          // user not found
          const ctrl = this.signInForm.get('credential');
          ctrl.setErrors({ ...ctrl.errors, 'user-not-found': true });
        }
      });
  }

  _navigateHome(): void {
    const redirectURL =
      this._activatedRoute.snapshot.queryParamMap.get('redirectURL') ||
      '/signed-in-redirect';

    // Navigate to the redirect url
    this._router.navigateByUrl(redirectURL);
  }
}

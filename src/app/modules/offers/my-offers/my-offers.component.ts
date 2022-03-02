import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Offer } from 'app/core/user/offer/offer.types';
import { UserService } from 'app/core/user/user.service';
import { Province, PublicUser } from 'app/core/user/user.types';
import { combineLatest, of, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'profile',
  templateUrl: './my-offers.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffersComponent implements OnInit {
  user: PublicUser;
  offers: Offer[];
  province: Province;
  applicantCount: number;

  // Offer fallback images in case company urls are broken
  logoUrlBroken = false;
  backgroundUrlBroken = false;

  _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    combineLatest([
      this._userService.get(),
      this._userService.findAllProvinces(),
      this._userService.findUserOffers(),
    ])
      .pipe(
        switchMap(([user, provinces, offers]) =>
          combineLatest([
            of(user),
            of(provinces),
            of(offers),
            this._userService.findApplicantCount(user.companyId),
          ])
        )
      )
      .subscribe(([user, provinces, offers, applicantCount]) => {
        this.user = user;
        this.province = provinces.find((p) => p.provinceId === user.provinceId);
        this.offers = offers;
        this.applicantCount = applicantCount;

        this._changeDetectorRef.markForCheck();
      });
  }

  logoBroken(): void {
    console.log('logo broken');
    this.logoUrlBroken = true;
  }

  backgroundBroken(): void {
    console.log('background broken');
    this.backgroundUrlBroken = true;
  }
}

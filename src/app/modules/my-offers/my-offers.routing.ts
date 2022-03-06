import { Route } from '@angular/router';
import { OffersComponent } from 'app/modules/my-offers/my-offers.component';

export const profileRoutes: Route[] = [
  {
    path: '',
    component: OffersComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('app/modules/my-offers/offer-list/offer-list.module').then(
            (m) => m.OfferListModule
          ),
      },
    ],
  },
];

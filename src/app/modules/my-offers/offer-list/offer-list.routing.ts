import { OffersResolver } from './offer-list.resolvers';
import { Route } from '@angular/router';
import { OfferDetailsComponent } from 'app/modules/my-offers/offer-list/details/details.component';
import { OfferListListComponent } from 'app/modules/my-offers/offer-list/list/list.component';
import { OfferListComponent } from 'app/modules/my-offers/offer-list/offer-list.component';

export const offerListRoutes: Route[] = [
  {
    path: '',
    component: OfferListComponent,
    children: [
      {
        path: '',
        resolve: {
          offer: OffersResolver,
        },
        component: OfferListListComponent,
        children: [
          {
            path: '',
            component: OfferDetailsComponent,
            children: [
              {
                path: ':id',
              },
            ],
          },
        ],
      },
    ],
  },
];

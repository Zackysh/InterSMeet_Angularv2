import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseScrollResetModule } from '@fuse/directives/scroll-reset';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { OfferDetailsComponent } from 'app/modules/my-offers/offer-list/details/details.component';
import { OfferListListComponent } from 'app/modules/my-offers/offer-list/list/list.component';
import { OfferListComponent } from 'app/modules/my-offers/offer-list/offer-list.component';
import { offerListRoutes } from 'app/modules/my-offers/offer-list/offer-list.routing';
import { OfferListSidebarComponent } from 'app/modules/my-offers/offer-list/sidebar/sidebar.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { QuillModule } from 'ngx-quill';
import { MatRippleModule } from '@angular/material/core';
import { OfferFormComponent } from './form/offer-form.component';
import { MatSliderModule } from '@angular/material/slider';
import { ApplicantDetailsComponent } from './applicant-details/applicant-details.component';

@NgModule({
  declarations: [
    OfferListComponent,
    OfferDetailsComponent,
    OfferListListComponent,
    OfferListSidebarComponent,
    OfferFormComponent,
    ApplicantDetailsComponent,
  ],
  imports: [
    RouterModule.forChild(offerListRoutes),
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatRippleModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    MatSliderModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    QuillModule.forRoot(),
    FuseFindByKeyPipeModule,
    FuseNavigationModule,
    FuseScrollbarModule,
    FuseScrollResetModule,
    SharedModule,
  ],
})
export class OfferListModule {}

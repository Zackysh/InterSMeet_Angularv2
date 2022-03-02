import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';
import { OffersComponent } from 'app/modules/auth/offers/offers.component';
import { profileRoutes } from 'app/modules/auth/offers/offers.routing';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [OffersComponent],
  imports: [
    RouterModule.forChild(profileRoutes),
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    FuseCardModule,
    SharedModule,
  ],
})
export class OffersModule {}

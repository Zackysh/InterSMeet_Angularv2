import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { SettingsAccountComponent } from 'app/modules/settings/account/account.component';
import { SettingsPlanBillingComponent } from 'app/modules/settings/plan-billing/plan-billing.component';
import { SettingsSecurityComponent } from 'app/modules/settings/security/security.component';
import { SettingsComponent } from 'app/modules/settings/settings.component';
import { settingsRoutes } from 'app/modules/settings/settings.routing';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    SettingsComponent,
    SettingsAccountComponent,
    SettingsSecurityComponent,
    SettingsPlanBillingComponent,
  ],
  imports: [
    RouterModule.forChild(settingsRoutes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    FuseAlertModule,
    SharedModule,
  ],
})
export class SettingsModule {}

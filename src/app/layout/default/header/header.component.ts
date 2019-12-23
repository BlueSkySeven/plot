import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { UserInfo } from '@core/interface';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  searchToggleStatus: boolean;
  tokenSrv: UserInfo;
  constructor(
    public settings: SettingsService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
  ) {
    this.tokenSrv = this.tokenService.get() as UserInfo;
    this.settings.setUser(this.tokenSrv);
  }

  toggleCollapsedSidebar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }
  closeWindow(){
    top.window.opener = top;
    top.window.open('','_self','');
    top.window.close();
  }
}

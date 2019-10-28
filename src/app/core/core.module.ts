import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';

import { I18NService } from './i18n/i18n.service';
import { ProjectTrainModalComponent } from './component/project-train-modal/project-train-modal.component';

@NgModule({
  providers: [
    I18NService,
  ],
  declarations: [ProjectTrainModalComponent]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}

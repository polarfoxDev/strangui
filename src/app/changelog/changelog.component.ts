import { DatePipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';
import * as CoreAction from '@core-state/core.actions';
import { changelogSeenForVersionSelector } from '@core-state/core.selectors';
import { isVersionNewer } from '@core/utils';
import packageJson from '../../../package.json';
import { changeLog } from './changelog';
import { VersionChanges } from './changelogs.models';




@Component({
  selector: 'app-changelog',
  imports: [RouterModule, DatePipe],
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.css'
})
export class ChangelogComponent implements OnDestroy {
  private store = inject(Store);
  private subscriptions = new Subscription();

  changeLog: VersionChanges[] = [];

  constructor() {
    const subscription = this.store.select(changelogSeenForVersionSelector).pipe(take(1)).subscribe((changelogSeenFor) => {
      this.changeLog = changeLog.map((versionChange) => ({
        ...versionChange,
        isNew: isVersionNewer(versionChange.version, changelogSeenFor),
      }));
      this.store.dispatch(CoreAction.setChangelogSeenForVersion(packageJson.version));
    });
    this.subscriptions.add(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

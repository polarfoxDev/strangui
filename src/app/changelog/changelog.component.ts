import { Component } from '@angular/core';
import packageJson from '../../../package.json';
import { AppStorage } from '../core/storage';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { isVersionNewer } from '../core/utils';
import { changeLog } from './changelog';
import { VersionChanges } from './changelogs.models';

@Component({
  selector: 'app-changelog',
  imports: [RouterModule, DatePipe],
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.css'
})
export class ChangelogComponent {

  changeLog: VersionChanges[] = [];

  constructor() {
    const changelogSeenForBeforeOpening = AppStorage.getSafe<string>('changelogSeenFor', '0.0.0');
    AppStorage.set<string>('changelogSeenFor', packageJson.version);
    this.changeLog = changeLog.map((versionChange) => ({
      ...versionChange,
      isNew: isVersionNewer(versionChange.version, changelogSeenForBeforeOpening),
    }));
  }
}

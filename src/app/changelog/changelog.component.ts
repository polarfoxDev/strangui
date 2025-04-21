import { Component } from '@angular/core';
import packageJson from '../../../package.json';
import { AppStorage } from '../core/storage';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { isVersionNewer } from '../core/utils';

interface VersionChanges {
  version: string;
  date: string;
  isNew: boolean;
  changes: Change[];
}

interface Change {
  type: string;
  description: string;
}

@Component({
  selector: 'app-changelog',
  imports: [RouterModule, DatePipe],
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.css'
})
export class ChangelogComponent {

  changeLog: VersionChanges[] = [
    {
      version: '1.10.0',
      date: '2025-04-21',
      isNew: false,
      changes: [
        { type: 'Neu', description: 'Unterstützung für eine neue Version der Rätsel-Konfigurations-Dateien' },
        { type: 'Neu', description: 'Neuigkeiten bei Updates können jetzt eingesehen werden' },
      ]
    },
    {
      version: '1.9.3',
      date: '2025-01-26',
      isNew: false,
      changes: [
        { type: 'Geändert', description: 'Updates verwendeter Bibliotheken' },
      ]
    },
    {
      version: '1.9.2',
      date: '2025-01-20',
      isNew: false,
      changes: [
        { type: 'Repariert', description: 'Browser zeigen keine irreführenden Übersetzungshinweise mehr an' },
      ]
    },
    {
      version: '1.9.1',
      date: '2025-01-20',
      isNew: false,
      changes: [
        { type: 'Repariert', description: 'Fehler werden besser behandelt' },
      ]
    },
    {
      version: '1.9.0',
      date: '2025-01-19',
      isNew: false,
      changes: [
        { type: 'Neu', description: 'Kalenderansicht zur Auswahl alter Rätsel' },
      ]
    },
  ];

  constructor() {
    const changelogSeenForBeforeOpening = AppStorage.getSafe<string>('changelogSeenFor', '0.0.0');
    AppStorage.set<string>('changelogSeenFor', packageJson.version);
    this.changeLog.forEach((versionChange) => {
      versionChange.isNew = isVersionNewer(versionChange.version, changelogSeenForBeforeOpening);
    });
  }
}

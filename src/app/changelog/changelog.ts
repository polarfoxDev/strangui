import { ChangeType, VersionChanges } from "./changelogs.models";

export const changeLog: VersionChanges[] = [
  {
    version: '1.12.0',
    date: new Date().toISOString().substring(0, 10), // TODO
    isNew: false,
    changes: [
      { type: ChangeType.Change, description: 'Großer technischer Umbau auf besseres System zur Verwaltung von Zuständen (ermöglicht später eine einfachere und robustere Implementierung geplanter neuer Funktionen)' },
      { type: ChangeType.Bugfix, description: 'Datumswechsel sollten nun zur lokalen Zeit erfolgen antstatt zu UTC' },
      { type: ChangeType.Bugfix, description: 'Sobald diese Änderungshistorie angesehen wurde, wird die Hervorhebung in der Fußzeile jetzt sofort entfernt' }
    ]
  },
  {
    version: '1.11.0',
    date: '2025-04-26',
    isNew: false,
    changes: [
      { type: ChangeType.Bugfix, description: 'Fehler in der Migration alter Spielstände behoben' },
      { type: ChangeType.Change, description: 'Verbesserte Datenformatierung dieser Änderungshistorie' },
    ]
  },
  {
    version: '1.10.1',
    date: '2025-04-22',
    isNew: false,
    changes: [
      { type: ChangeType.Bugfix, description: 'Alte Spielstände werden wieder korrekt geladen' },
    ]
  },
  {
    version: '1.10.0',
    date: '2025-04-21',
    isNew: false,
    changes: [
      { type: ChangeType.Feature, description: 'Unterstützung für eine neue Version der Rätsel-Konfigurations-Dateien' },
      { type: ChangeType.Feature, description: 'Neuigkeiten bei Updates können jetzt eingesehen werden' },
      { type: ChangeType.Change, description: 'Updates verwendeter Bibliotheken' },
    ]
  },
  {
    version: '1.9.3',
    date: '2025-01-26',
    isNew: false,
    changes: [
      { type: ChangeType.Change, description: 'Updates verwendeter Bibliotheken' },
    ]
  },
  {
    version: '1.9.2',
    date: '2025-01-20',
    isNew: false,
    changes: [
      { type: ChangeType.Bugfix, description: 'Browser zeigen keine irreführenden Übersetzungshinweise mehr an' },
    ]
  },
  {
    version: '1.9.1',
    date: '2025-01-20',
    isNew: false,
    changes: [
      { type: ChangeType.Bugfix, description: 'Fehler werden besser behandelt' },
    ]
  },
  {
    version: '1.9.0',
    date: '2025-01-19',
    isNew: false,
    changes: [
      { type: ChangeType.Feature, description: 'Kalenderansicht zur Auswahl alter Rätsel' },
    ]
  },
];

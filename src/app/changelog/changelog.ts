import { ChangeType, VersionChangeDefinition } from './changelogs.models';

export const changeLog: VersionChangeDefinition[] = [
  {
    version: '1.12.4',
    date: '2025-07-06',
    changes: [
      { type: ChangeType.Change, description: 'nicht sichtbare technische Verbesserungen' },
    ],
  },
  {
    version: '1.12.3',
    date: '2025-06-07',
    changes: [
      { type: ChangeType.Bugfix, description: 'Der Kalender wird nun auch für Monate, die mit einem Sonntag beginnen, korrekt angezeigt' },
    ],
  },
  {
    version: '1.12.2',
    date: '2025-05-17',
    changes: [
      { type: ChangeType.Bugfix, description: 'Für defekte bzw. nicht mehr verfügbare Rätsel wird eine entsprechende Fehlermeldung angezeigt' },
    ],
  },
  {
    version: '1.12.1',
    date: '2025-05-04',
    changes: [
      { type: ChangeType.Bugfix, description: 'Die Ergebnisseite wird in Firefox jetzt wieder korrekt dargestellt und zeigt keine unendliche Ladeanimation mehr an' },
    ],
  },
  {
    version: '1.12.0',
    date: '2025-04-30',
    changes: [
      { type: ChangeType.Change, description: 'technischer Umbau auf besseres System zur Verwaltung von Zuständen (vereinfacht Implementierung geplanter Funktionen für spätere Versionen)' },
      { type: ChangeType.Bugfix, description: 'Kontrast bei sekundären Hinweisen wurde verbessert' },
      { type: ChangeType.Bugfix, description: 'Datumswechsel sollten nun zur lokalen Zeit erfolgen antstatt zu UTC' },
      { type: ChangeType.Bugfix, description: 'Sobald diese Änderungshistorie angesehen wurde, wird die Hervorhebung in der Fußzeile jetzt sofort entfernt' },
    ],
  },
  {
    version: '1.11.0',
    date: '2025-04-26',
    changes: [
      { type: ChangeType.Bugfix, description: 'Fehler in der Migration alter Spielstände behoben' },
      { type: ChangeType.Change, description: 'Verbesserte Datenformatierung dieser Änderungshistorie' },
    ],
  },
  {
    version: '1.10.1',
    date: '2025-04-22',
    changes: [
      { type: ChangeType.Bugfix, description: 'Alte Spielstände werden wieder korrekt geladen' },
    ],
  },
  {
    version: '1.10.0',
    date: '2025-04-21',
    changes: [
      { type: ChangeType.Feature, description: 'Unterstützung für eine neue Version der Rätsel-Konfigurations-Dateien' },
      { type: ChangeType.Feature, description: 'Neuigkeiten bei Updates können jetzt eingesehen werden' },
      { type: ChangeType.Change, description: 'Updates verwendeter Bibliotheken' },
    ],
  },
  {
    version: '1.9.3',
    date: '2025-01-26',
    changes: [
      { type: ChangeType.Change, description: 'Updates verwendeter Bibliotheken' },
    ],
  },
  {
    version: '1.9.2',
    date: '2025-01-20',
    changes: [
      { type: ChangeType.Bugfix, description: 'Browser zeigen keine irreführenden Übersetzungshinweise mehr an' },
    ],
  },
  {
    version: '1.9.1',
    date: '2025-01-20',
    changes: [
      { type: ChangeType.Bugfix, description: 'Fehler werden besser behandelt' },
    ],
  },
  {
    version: '1.9.0',
    date: '2025-01-19',
    changes: [
      { type: ChangeType.Feature, description: 'Kalenderansicht zur Auswahl alter Rätsel' },
    ],
  },
];

export interface VersionChanges {
  version: string;
  date: string;
  isNew: boolean;
  changes: Change[];
}

export interface Change {
  type: ChangeType;
  description: string;
}

export enum ChangeType {
  Feature = 'Neu',
  Bugfix = 'Repariert',
  Change = 'Geändert',
}

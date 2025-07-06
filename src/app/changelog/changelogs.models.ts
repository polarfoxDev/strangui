export interface VersionChanges extends VersionChangeDefinition {
  isNew: boolean;
}

export interface VersionChangeDefinition {
  version: string;
  date: string;
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

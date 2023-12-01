export interface AppManifest {
  title: string;
  description: string;
  translations: RecordPerKey<string>;
}

export interface RecordPerKey<T> {
  [key: string]: T;
}

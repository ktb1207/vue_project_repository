import { App } from 'vue';

export interface IInstalType {
  install: (app: App) => void;
  [propName: string]: any;
}

export type renderWayType = 'edit' | 'preview';
export type FontWeight =
  | number
  | 'normal'
  | '-moz-initial'
  | 'inherit'
  | 'initial'
  | 'revert'
  | 'unset'
  | 'bold'
  | 'bolder'
  | 'lighter'
  | undefined;
export type FontAlign = 'left' | 'center' | 'right';

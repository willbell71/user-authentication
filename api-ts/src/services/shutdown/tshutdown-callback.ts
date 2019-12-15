import { IShutdownHandler } from './ishutdown-handler';

export type TShutdownCallback = (handler: IShutdownHandler) => Promise<void>;

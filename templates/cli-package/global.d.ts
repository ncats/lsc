interface Logger {
  info: (...message: any[]) => void;
  error: (...message: any[]) => void;
  warn: (...message: any[]) => void;
}

declare namespace NodeJS {
  export interface Global {
    LabShare: {
      [key: string]: any;
    };
    Logger: Logger;
  }
}

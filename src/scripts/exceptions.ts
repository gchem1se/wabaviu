export class WADBexception extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WADBexception";
  }
}

export class ProvidedFileIsNotBlob extends WADBexception {
  constructor(type: string) {
    super("The file provided to the constructor was of unexpected type: "+type);
    this.name = "ProvidedFileIsNull";
  }
}

export class FileReadingException extends WADBexception {
    constructor(message?: string) {
      super(message ?? "Generic error reading the provided file");
      this.name = "FileReadingException";
    }
  }
  

export class ProvidedFileNotSQLite extends WADBexception {
  constructor() {
    super("The file provided to the constructor was not a SQLite database");
    this.name = "ProvidedFileNotSQLite";
  }
}

export class ProvidedFileNotWASQLite extends WADBexception {
  constructor(message? : string) {
    super(
      "The file provided to the constructor was not a Whatsapp database file. " + message ?? ""
    );
    this.name = "ProvidedFileNotWASQLite";
  }
}

export class WASQLiteExecutionError extends WADBexception {
  constructor(message: string) {
    super(message);
    this.name = "WASQLiteError";
  }
}

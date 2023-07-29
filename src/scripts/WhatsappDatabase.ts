import initSqlJs, { Database, ParamsObject } from "sql.js";
import { queries } from "./queries";
import {
  FileReadingException,
  ProvidedFileIsNotBlob,
  ProvidedFileNotSQLite,
  ProvidedFileNotWASQLite,
} from "./exceptions";

export class WhatsappDatabase {
  file: unknown = null;
  db: Database | null = null;

  constructor(file: unknown) {
    // just sets the file, initialization function is not in the constructor as it's async
    this.file = file;
  }

  async init() {
    /* inits the db */

    if (!(this.file instanceof Blob))
      throw new ProvidedFileIsNotBlob(typeof this.file);

    let sqlite_db : Database | null;
    try {
      sqlite_db = await this.getSQLiteDBfromFile(this.file);
      if (sqlite_db === null)
        throw new FileReadingException();
    } catch (err) {
      if (err instanceof ProvidedFileNotSQLite) throw err;
      if (err instanceof FileReadingException) throw err;
      else {
        console.error(err);
        throw err;
      }
    }

    try {
      // create useful views
      sqlite_db!.exec(queries.easier_message_view_query);
      sqlite_db!.exec("SELECT * FROM easier_messages_view LIMIT 1");
      sqlite_db!.exec(queries.easier_contacts_view_query);
      sqlite_db!.exec("SELECT * FROM easier_contacts_view LIMIT 1");     
      this.db = sqlite_db;
    } catch (error) {
      // if creating those views crashes, it probably was not a valid whatsapp DB
      throw new ProvidedFileNotWASQLite((error as Error).message);
    }
  }

  async getSQLiteDBfromFile(file: Blob): Promise<Database | null> {
    /* actually reads the file and getting a DB out of it */
    const promise = new Promise<ArrayBuffer | string | null>(
      (resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          resolve(event!.target!.result);
        };
        reader.onerror = (event) => {
          reject(event!.target!.error!.message);
        };

        reader.readAsArrayBuffer(file);
      }
    );

    const buf = await promise;

    if (!(buf instanceof ArrayBuffer)) {
      // promise has been rejected
      if ((buf as unknown) instanceof String)
        throw new FileReadingException((buf as string));
      else
        throw new FileReadingException();
    }

    try {
      return this.getSQLiteDBfromArrBuf(buf);
    } catch (err) {
      if (err instanceof ProvidedFileNotSQLite)
        throw new ProvidedFileNotSQLite();
      else console.error(err);
      throw err;
    }
  }

  async getSQLiteDBfromArrBuf(buf: ArrayBuffer) {
    /* constructs a DB out of an ArrayBuffer which was the result of reading a local file;
    async because of initSqlJs */

    const SQL = await initSqlJs({
      // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
      // You can omit locateFile completely when running in node
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });
    try {
      const db = new SQL.Database(new Uint8Array(buf));
      db.exec("SELECT * FROM sqlite_schema");
      return db;
    } catch {
      // catch and re-throw
      throw new ProvidedFileNotSQLite();
    }
  }

  getSomeMessages(contact: string): Array<ParamsObject> {
    const return_val: Array<ParamsObject> = [];
    const stmt = this.db!.prepare(queries.get_some_messages);
    stmt.bind({ ":from_who": contact });
    while (stmt.step()) return_val.push(stmt.getAsObject());
    return return_val;
  }
}

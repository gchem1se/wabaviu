import initSqlJs, { Database, ParamsObject } from "sql.js";
import { queries } from "./queries";
import {
  FileReadingException,
  ProvidedFileIsNotBlob,
  ProvidedFileNotSQLite,
  ProvidedFileNotWASQLite,
  NotInitializedDB,
} from "./exceptions";

export class WhatsappDatabase {
  file: unknown = null;
  has_been_initialized: boolean = false;
  db: Database | null = null;

  constructor(file: unknown) {
    // just sets the file, initialization function is not in the constructor as it's async
    this.file = file;
  }

  async init() {
    /* inits the db */

    if (!(this.file instanceof Blob))
      throw new ProvidedFileIsNotBlob(typeof this.file);

    const sqlite_db = await this.getSQLiteDBfromFile(this.file);

    try {
      // create useful views and indexes
      sqlite_db!.exec(queries.create_useful_indexes);
      sqlite_db!.exec(queries.easier_messages_view_query);
      sqlite_db!.exec("SELECT * FROM easier_messages_view LIMIT 1");
      sqlite_db!.exec(queries.easier_contacts_view_query);
      console.log("creare ho creato")
      sqlite_db!.exec("SELECT * FROM easier_contacts_view LIMIT 1");
      console.log("test fatto")

      this.db = sqlite_db;
      this.has_been_initialized = true;
    } catch (error) {
      // an error in these queries probably means the DB has not the tables of a Whatsapp valid database
      throw new ProvidedFileNotWASQLite((error as Error).message);
    }
  }

  async getSQLiteDBfromFile(file: Blob) {
    /* actually reads the file and gets a DB object out of it */
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
        throw new FileReadingException(buf as string);
      else throw new FileReadingException();
    }

    return this.getSQLiteDBfromArrBuf(buf);
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
      throw new ProvidedFileNotSQLite();
    }
  }

  getSomeMessages(contact: string): Array<ParamsObject> {
    console.log("lancio query messaggi")

    if (!this.has_been_initialized) throw new NotInitializedDB();
    const return_val: Array<ParamsObject> = [];
    const stmt = this.db!.prepare(queries.get_some_messages);
    stmt.bind({ ":from_who": contact });
    while (stmt.step()) return_val.push(stmt.getAsObject());
    console.log("finita query messaggi")
   
    return return_val;
  }

  getChats(): Array<ParamsObject> {
    console.log("inizio query chats")
    
    if (!this.has_been_initialized) throw new NotInitializedDB();
    const return_val: Array<ParamsObject> = [];
    const stmt = this.db!.prepare(queries.get_all_chats);
    while (stmt.step()) {
      return_val.push(stmt.getAsObject());
    }

    console.log("finita query chats")
  
    return return_val;
  }
}

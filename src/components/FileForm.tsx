import { WhatsappDatabase } from "../scripts/WhatsappDatabase.js";
import { WADBexception } from "../scripts/exceptions.js";
import { useState, useRef } from "react";

const FileForm = () => {
  const [divContents, setDivContents] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const getSomething = async () : Promise<string> => {
    const db: WhatsappDatabase = new WhatsappDatabase(
      inputRef.current?.files?.[0]
    );
    try {
      await db.init();
      const result = db.getSomeMessages("Gabriele DM");
      return result.flatMap((coso) => JSON.stringify(coso)).join(", ");
    } catch (err) {
      if (err instanceof WADBexception) {
        return typeof(err) +": " + err.message;
      } else {
        console.log(err);
        return "unexpected. check console.";
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={async () => {
          const string = await getSomething();
          setDivContents(string);
        }}
      ></input>
      <div>{divContents}</div>
    </div>
  );
};

export default FileForm;

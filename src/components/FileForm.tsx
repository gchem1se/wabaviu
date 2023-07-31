import { WhatsappDatabase } from "../scripts/WhatsappDatabase.js";
import { useState, useRef } from "react";
import { DefaultMessage, MessageTypeString } from "./models/Message.js";
import { MessageList } from "react-chat-elements";
import { getTimeFromTimestamp } from "../scripts/utils.js";

const FileForm = () => {
  const [messages, setMessages] = useState<Array<DefaultMessage>>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const getSomething = async (): Promise<DefaultMessage[] | string> => {
    const db: WhatsappDatabase = new WhatsappDatabase(
      inputRef.current?.files?.[0]
    );

    try {
      await db.init();
      // ^^ throws errors if unable to read file or file is not valid
    } catch (err) {
      return typeof err + ": " + (err as Error).message;
    }

    const result = db.getSomeMessages("Gabriele DM");
    const return_val: Array<DefaultMessage> = [];
    result.forEach((each) => {
      const object = {
        text: each.text_data as string,
        from_me: (each.from_me as number) == 1,
        id: each.message_row_id as number,
        type: each.message_type as MessageTypeString,
        timestamp: each.timestamp as number,
      };
      return_val.push(object);
    });
    return return_val;
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={async () => {
          const messaggi = await getSomething();
          if (messaggi instanceof String) {
            setMessages([]);
          }
          setMessages(messaggi as Array<DefaultMessage>);
        }}
      ></input>
      <MessageList
        className="message-list"
        lockable={true}
        toBottomHeight={"100%"}
        dataSource={messages.map((mex: DefaultMessage) => {
          return {
            position: mex.from_me ? "right" : "left",
            type: mex.type,
            text: mex.text,
            dateString: getTimeFromTimestamp(mex.timestamp),
            date: "foo", // nothing that i put here matters, it's here just to make the date appear
            className: "text-black"
          } // type: IMessageProps from react-chat-elements;
        })}
      />
    </div>
  );
};

export default FileForm;

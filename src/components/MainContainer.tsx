import {
  ChatList,
  IChatItemProps,
  MessageList,
  MessageType,
} from "react-chat-elements";
import FileForm from "./FileForm";
import { useRef, useState } from "react";
import { getTimeFromTimestamp } from "../scripts/utils";
import { ParamsObject } from "sql.js";
import { WhatsappDatabase } from "../scripts/WhatsappDatabase";
import { Md5 } from "ts-md5";

type state = {
  messages: Array<MessageType>;
  chats: Array<IChatItemProps>;
};

const MainContainer = () => {
  const refToInput = useRef<HTMLInputElement>(null);
  const db = useRef<WhatsappDatabase | null>(null);

  const [stato, setStato] = useState<state>({
    messages: [],
    chats: [],
  });

  const getWorkingDB = async (): Promise<WhatsappDatabase> => {
    const workingDB: WhatsappDatabase = new WhatsappDatabase(
      refToInput.current?.files?.[0]
    );

    await workingDB.init();

    db.current = workingDB;
    return db.current;
  };

  const getSomeMessagesToTest = async (from_who: string): Promise<Array<MessageType>> => {
    const workingDB = db.current ?? (await getWorkingDB());

    const sqlres = workingDB.getSomeMessages(from_who);
    return sqlres.map((row: ParamsObject) => {
      console.log(row)
      return {
        text: row.text_data as string,
        position: (row.from_me as number) === 1 ? "right" : "left",
        id: row.id as number,
        title: (row.is_from_group as number) === 1 && (row.from_me as number) === 0 ? row.sender_name as string : "",
        focus: false,
        date: row.timestamp as number,
        dateString: getTimeFromTimestamp(row.timestamp as number),
        titleColor: "black",
        forwarded: false,
        replyButton: false,
        removeButton: false,
        status: (row.from_me as number) === 1 ? "sent" : "",
        notch: true,
        retracted: false,
        type: row.message_type as string !== "video" ? row.message_type as string : "text", // TODO: video makes rce crash
      } as MessageType;
    });
  };

  const getChats = async () => {
    const workingDB = db.current ?? (await getWorkingDB());
    const sqlres = workingDB.getChats();

    return sqlres.map((row: ParamsObject) => {
      return {
        id: row.id as number,
        title: row.contact_name as string,
        avatar: "https://api.dicebear.com/6.x/identicon/svg?seed=" + Md5.hashStr(row.contact_name as string)
      } as IChatItemProps;
    });
  };


  return (
    <div className="w-full flex justify-center text-gray-900">
      <div className="min-w-full min-h-screen max-h-screen p-10 pl-20 pe-20 bg-slate-800">
        <div className="min-w-full min-h-full max-h-full flex shadow-2xl rounded-xl">
          <aside className="w-3/12 rounded-l-xl bg-white max-h-full overflow-hidden">
            <div className="p-6 flex justify-center items-center sticky top-0 z-10 bg-white rounded-tl-xl">
              <FileForm
                ref={refToInput}
                onChange={async () => {
                  db.current = null;
                  try {
                    const resultChats: Array<IChatItemProps> = await getChats();

                    const result: state = {
                      messages: [] as Array<MessageType>,
                      chats: resultChats,
                    };

                    setStato(result);
                  } catch (err) {
                    console.error(err);
                  }
                }}
              />
            </div>
            <div className="overflow-scroll max-h-full">
              <ChatList className="max-h-full overflow-scroll" id="chats" lazyLoadingImage={"idonnou"} dataSource={stato.chats} onClick={async (event) => {
                setStato({ chats: stato.chats, messages: await getSomeMessagesToTest(event.title!) })
              }} /></div>
          </aside>
          <main className="flex flex-col w-9/12 bg-gray-200 max-h-screen overflow-scroll rounded-e-xl">
            <div className="p-6 bg-white sticky top-0 z-10">filters zone</div>
            <MessageList
              className="message-list p-10 pe-3 pl-3"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={stato.messages}
              referance={null}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;

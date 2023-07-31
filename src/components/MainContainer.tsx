import { RefObject } from "react";
import { ChatList, MessageList } from "react-chat-elements";

const MainContainer = (inputReference: RefObject<HTMLInputElement>) => {
  return (
    <div className="w-full flex justify-center text-gray-900">
      <div className="min-w-full min-h-screen max-h-screen p-10 pl-20 pe-20 bg-slate-800">
        <div className="min-w-full max-h-full flex shadow-2xl rounded-xl">
          <aside className="w-3/12 bg-white min-h-full overflow-scroll rounded-l-xl">
            <div className="mb-20"></div>
            <ChatList
              className="chat-list"
              dataSource={[
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Facebook",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
                {
                  avatar: "https://facebook.github.io/react/img/logo.svg",
                  alt: "Reactjs",
                  title: "Utlimo",
                  subtitle: "What are you doing?",
                  date: new Date(),
                  unread: 0,
                },
              ]}
            />
          </aside>
          <main className="w-9/12 bg-gray-200 max-h-screen overflow-scroll rounded-e-xl">
            <MessageList
              className="message-list p-5"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={[
                {
                  position: "left",
                  type: "text",
                  title: "Kursat",
                  text: "Give me a message list example !",
                },
                {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "left",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "left",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.That's all.",
                },
                  {
                    position: "left",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                  {
                    position: "right",
                    type: "text",
                    title: "Emre",
                    text: "That's all.",
                  },
                      ]}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;

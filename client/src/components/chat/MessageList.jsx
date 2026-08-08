import Message from "./Message";


function MessageList({ 
  messages = [], 
  user, 
  setMessages,
  setReplyMessage
}) {

  return (
    <div className="space-y-3">

      {messages.map((msg) => (

        <Message
          key={msg._id}
          message={msg}
          user={user}
          setMessages={setMessages}
          setReplyMessage={setReplyMessage}
        />

      ))}

    </div>
  );
}


export default MessageList;
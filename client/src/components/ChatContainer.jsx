import React, { useContext, useEffect, useRef, useState } from 'react'
import img from '../img/assets.js'
import { formatMessageTime } from '../lib/utils.js'
import { AuthContext } from '../../context/AuthContext.jsx'
import { ChatContext } from '../../context/ChatContext.jsx'

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();

  const [input, setInput] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null); // For previewing docs
  
  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // Handle sending files
  const handleSendFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    for (const file of files) {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64WithMime = reader.result;
        await sendMessage({
          file: {
            name: file.name,
            type: file.type,
            url: base64WithMime, // Base64
            
          },
        });
      };

      reader.readAsDataURL(file);
    }

    e.target.value = ""; // reset input
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Function to check if file is previewable document
  const isPreviewableDoc = (file) => {
    const previewableTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // excel xlsx
      "application/vnd.ms-excel", // excel xls
      "text/plain"
    ];
    return previewableTypes.includes(file.type);
  };

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      

      {/* Header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || img.avatar_icon} alt="" className='w-8 h-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
        </p>
        {/* <img src="/src/img/video_icon.png" alt="" className='max-md:hidden max-w-6 m-1'/>
        <img src="/src/img/phone_icon.png" alt="" className='max-md:hidden max-w-6 m-1'/> */}
        <img onClick={() => setSelectedUser(null)} src={img.arrow_icon} alt="" className='md:hidden max-w-7' />
        <img src={img.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>
      

      {/* Chat area */}
      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain p-4"
          />
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewDoc(null)}
        >
          <iframe
            src={previewDoc}
            title="Document Preview"
            className="w-full max-w-4xl h-[90vh] rounded-lg shadow-lg"
          />
        </div>
      )}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id ? 'flex-row-reverse' : ''
            }`}
          >
            {msg.file ? (
              msg.file.type.startsWith("image/") ? (
                <img
                  src={msg.file.url}
                  alt="sent"
                  onClick={() => setPreviewImage(msg.file.url)}
                  className="max-w-[230px] border border-gray-200 rounded-lg overflow-hidden mb-8 cursor-pointer"
                />
              ) : isPreviewableDoc(msg.file) ? (
                <div
                  onClick={() => setPreviewDoc(msg.file.url)}
                  className="max-w-[230px] border border-gray-200 rounded-lg overflow-hidden mb-8 cursor-pointer bg-gray-900 p-3 flex flex-col justify-center items-center text-white"
                >
                  <p className="truncate w-full mb-2">{msg.file.name}</p>
                  {msg.file.type === "application/pdf" ? (
                    <iframe
                      src={msg.file.url}
                      title={msg.file.name}
                      className="w-full h-[150px] bg-white rounded"
                      allow="autoplay"
                    />

                  ) : msg.file.type === "text/plain" ? (
                    <iframe
                      src={msg.file.url}
                      title={msg.file.name}
                      className="w-full h-[150px] bg-white text-black rounded"
                    />
                  ) : (
                    <p>Click to preview {msg.file.name}</p>
                  )}
                </div>
              ) : (
                <a
                  href={msg.file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline mb-8 break-all flex items-center gap-2"
                >
                  📎 {msg.file.name} (Open File)
                </a>
              )
            ) : msg.image ? (
              <img
                src={msg.image}
                alt="sent"
                onClick={() => setPreviewImage(msg.image)}
                className="max-w-[230px] border border-gray-200 rounded-lg overflow-hidden mb-8 cursor-pointer"
              />
            ) : (
              <p
                className={`p-2 max-w-[300px] md:text-sm font-light rounded-lg mb-8 break-all ${
                  msg.senderId === authUser._id ? 'bg-violet-100/50 rounded-br-none text-white' : 'bg-yellow-400 rounded-bl-none text-black'
                }`}
              >
                {msg.text}
              </p>
            )}

            <div className='text-center text-xs'>
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic || img.avatar_icon
                    : selectedUser?.profilePic || img.avatar_icon
                }
                alt=""
                className='w-6 h-6 rounded-full'
              />
              <p className='text-gray-400'>{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom input area */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-800 px-3 rounded-full'>
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}
            type="text"
            placeholder='Send a Message'
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'
          />
          <input
            onChange={handleSendFiles}
            type="file"
            id="file"
            multiple
            hidden
          />
          <label htmlFor="file">
            <img src={img.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer" />
          </label>

        </div>
        <img onClick={handleSendMessage} src={img.send_button} alt="" className='w-8 cursor-pointer' />
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={img.logo_medium} className='max-w-40' alt="" />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer

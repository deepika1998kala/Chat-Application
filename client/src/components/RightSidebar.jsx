import React, { useContext, useEffect, useState } from 'react'
import img from '../img/assets.js'
import { ChatContext } from '../../context/ChatContext.jsx'
import { AuthContext } from '../../context/AuthContext.jsx';

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);
  const [msgDocs, setMsgDocs] = useState([]);

  useEffect(() => {
    if (messages) {
      // For Media (Images)
      const images = messages
        .filter(msg => msg.image || (msg.file && msg.file.type.startsWith("image/")))
        .map(msg => msg.image ? msg.image : msg.file.url);
      setMsgImages(images);

      // For Docs (Non-image files)
      const docs = messages
        .filter(msg => msg.file && !msg.file.type.startsWith("image/"))
        .map(msg => ({
          name: msg.file.name,
          url: msg.file.url,
        }));
      setMsgDocs(docs);
    }
  }, [messages]);


  if (!selectedUser) return null;

  return (
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll max-md:hidden">
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <img src={selectedUser?.profilePic || img.avatar_icon} alt="" className="w-20 aspect-[1/1] rounded-full" />
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {onlineUsers?.includes(selectedUser._id) && <p className="w-2 h-2 rounded-full bg-green-500"></p>}
          {selectedUser.fullName}
        </h1>
        <p className="px-10 mx-auto">{selectedUser.bio}</p>
      </div>
      <hr className="border-[#ffffff50] my-4" />
      <div className="px-5 text-xs">
        <p>Media</p>
        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {msgImages.map((url, index) => (
            <div key={index} onClick={() => window.open(url)} className="cursor-pointer rounded">
              <img src={url} alt="" className="h-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
      <hr className="border-[#ffffff50] my-4" />
      <div className="px-5 text-xs">
        <p>Docs</p>
        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {msgDocs.map((file, index) => (
            <a
              key={index}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 underline truncate flex items-center gap-2"
            >
              📄 {file.name}
            </a>
          ))}
        </div>
      </div>

      <hr className="border-[#ffffff50] my-4" />
      
      <button
        onClick={() => logout()}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-400 to-blue-900 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;

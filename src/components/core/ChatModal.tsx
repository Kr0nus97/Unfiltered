
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendHorizontal, UserCircle2, Paperclip, X } from "lucide-react";
import { useUiStore } from "@/store/uiStore";
import { usePostsStore } from "@/store/postsStore";
import type { Message } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { format } from 'date-fns';
import Link from "next/link";

export function ChatModal() {
  const { 
    isChatModalOpen, 
    closeChatModal, 
    chatTargetUserId, 
    chatTargetUserDisplayName, 
    chatPostIdContext 
  } = useUiStore();
  
  const { user } = useAuth();
  const getMessagesForChatSession = usePostsStore(state => state.getMessagesForChatSession);
  const sendMessageStore = usePostsStore(state => state.sendMessage);
  const startOrGetChatSession = usePostsStore(state => state.startOrGetChatSession);
  const getUserById = usePostsStore(state => state.getUserById);


  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [currentChatSessionId, setCurrentChatSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserData = user ? getUserById(user.uid) : null;
  const targetUserData = chatTargetUserId ? getUserById(chatTargetUserId) : null;

  useEffect(() => {
    if (isChatModalOpen && user && chatTargetUserId) {
      const session = startOrGetChatSession(user.uid, chatTargetUserId);
      setCurrentChatSessionId(session.id);
      setCurrentMessages(getMessagesForChatSession(session.id));
    } else {
      setCurrentMessages([]);
      setCurrentChatSessionId(null);
    }
  }, [isChatModalOpen, user, chatTargetUserId, startOrGetChatSession, getMessagesForChatSession]);

 useEffect(() => {
    if (currentChatSessionId) {
      // This will re-fetch messages if the store updates (e.g., new message sent/received)
      setCurrentMessages(getMessagesForChatSession(currentChatSessionId));
    }
  }, [usePostsStore(state => state.messages), currentChatSessionId, getMessagesForChatSession]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSendMessage = () => {
    if (!newMessageText.trim() || !user || !currentChatSessionId) return;
    sendMessageStore(currentChatSessionId, user.uid, newMessageText, chatPostIdContext);
    setNewMessageText("");
  };

  if (!isChatModalOpen) return null;

  const getParticipantPhoto = (userId: string) => {
    if (userId === user?.uid) return currentUserData?.photoURL;
    if (userId === chatTargetUserId) return targetUserData?.photoURL;
    return undefined;
  }
  
  const getParticipantDisplayName = (userId: string) => {
     if (userId === user?.uid) return currentUserData?.displayName || "You";
     if (userId === chatTargetUserId) return targetUserData?.displayName || chatTargetUserDisplayName || "User";
     return "User";
  }


  return (
    <Dialog open={isChatModalOpen} onOpenChange={(isOpen) => !isOpen && closeChatModal()}>
      <DialogContent className="sm:max-w-[450px] md:max-w-[600px] lg:max-w-[500px] p-0 flex flex-col h-[70vh] max-h-[700px] bg-card shadow-2xl rounded-lg">
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={targetUserData?.photoURL} alt={chatTargetUserDisplayName} />
              <AvatarFallback><UserCircle2 /></AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-lg font-semibold text-foreground">{chatTargetUserDisplayName || "Chat"}</DialogTitle>
              {/* Could add online status here */}
            </div>
          </div>
           <DialogClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </DialogHeader>

        {chatPostIdContext && (
            <div className="p-3 border-b bg-secondary/30 text-xs text-muted-foreground">
                Referring to post: <Link href={`/posts/${chatPostIdContext}`} className="text-accent hover:underline">View Post</Link>
            </div>
        )}

        <ScrollArea className="flex-grow p-4 space-y-4">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex mb-3 ${msg.senderId === user?.uid ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-end space-x-2 max-w-[75%]`}>
                {msg.senderId !== user?.uid && (
                   <Avatar className="h-8 w-8 self-start">
                    <AvatarImage src={getParticipantPhoto(msg.senderId)} />
                    <AvatarFallback>{getParticipantDisplayName(msg.senderId).charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-3 rounded-lg ${
                    msg.senderId === user?.uid
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-secondary text-secondary-foreground rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.senderId === user?.uid ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>
                    {format(new Date(msg.createdAt), "p")}
                  </p>
                </div>
                 {msg.senderId === user?.uid && (
                   <Avatar className="h-8 w-8 self-start">
                    <AvatarImage src={getParticipantPhoto(msg.senderId)} />
                    <AvatarFallback>{getParticipantDisplayName(msg.senderId).charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>

        <DialogFooter className="p-4 border-t">
          <div className="flex w-full items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-grow"
            />
            <Button onClick={handleSendMessage} disabled={!newMessageText.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90">
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

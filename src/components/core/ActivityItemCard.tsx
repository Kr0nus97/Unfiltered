
"use client";

import type { ActivityItem } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, ThumbsUp, AlertTriangle, FilePlus, Users, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItemCardProps {
  activity: ActivityItem;
  onMarkAsRead: (activityId: string) => void;
}

export function ActivityItemCard({ activity, onMarkAsRead }: ActivityItemCardProps) {
  const timeAgo = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });

  const getIcon = () => {
    switch (activity.type) {
      case 'USER_CREATED_POST':
        return <FilePlus className="h-5 w-5 text-blue-500" />;
      case 'USER_CREATED_GROUP':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'USER_POST_FLAGGED':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'OTHERS_LIKED_USER_POST':
        return <ThumbsUp className="h-5 w-5 text-pink-500" />;
      case 'OTHERS_COMMENTED_ON_USER_POST':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Helper to get a generic icon if actorPhotoURL is missing
  const ActorAvatarFallback = ({ name }: { name?: string }) => {
    const initial = name ? name.charAt(0).toUpperCase() : <UserCircle2 />;
    return <AvatarFallback>{initial}</AvatarFallback>;
  };


  const renderMessage = () => {
    const { data } = activity;
    let messageParts: (string | JSX.Element)[] = [];
    let linkPath: string | undefined = undefined;

    const actorSpan = data.actorDisplayName ? (
      <span key="actor" className="font-semibold text-accent">{data.actorDisplayName}</span>
    ) : (
      <span key="actor-anon" className="font-semibold text-accent">Someone</span>
    );

    const postLink = data.postId ? (
        <Link key="postlink" href={`/groups/${data.groupId}/#post-${data.postId}`} className="font-semibold text-primary hover:underline">
            "{data.postSnippet || 'your post'}"
        </Link>
    ) : (
        <span key="postlink-fallback" className="font-semibold">"{data.postSnippet || 'a post'}"</span>
    );
    
    const groupLink = data.groupId ? (
         <Link key="grouplink" href={`/groups/${data.groupId}`} className="font-semibold text-primary hover:underline">
            {data.groupName || 'a group'}
        </Link>
    ) : (
        <span key="grouplink-fallback" className="font-semibold">{data.groupName || 'a group'}</span>
    );


    switch (activity.type) {
      case 'USER_CREATED_POST':
        messageParts = ["You created ", postLink, " in ", groupLink, "."];
        linkPath = data.groupId && data.postId ? `/groups/${data.groupId}/#post-${data.postId}` : (data.groupId ? `/groups/${data.groupId}` : undefined);
        break;
      case 'USER_CREATED_GROUP':
        messageParts = ["You created the group ", groupLink, "."];
        linkPath = data.groupId ? `/groups/${data.groupId}` : undefined;
        break;
      case 'USER_POST_FLAGGED':
        messageParts = ["Your post ", postLink, " in ", groupLink, ` was flagged: "${data.flagReason || 'Community guidelines'}"`];
        linkPath = data.groupId && data.postId ? `/groups/${data.groupId}/#post-${data.postId}` : (data.groupId ? `/groups/${data.groupId}` : undefined);
        break;
      case 'OTHERS_LIKED_USER_POST':
        messageParts = [actorSpan, " liked ", postLink, "."];
        linkPath = data.groupId && data.postId ? `/groups/${data.groupId}/#post-${data.postId}` : undefined;
        break;
      case 'OTHERS_COMMENTED_ON_USER_POST':
        messageParts = [actorSpan, " commented on ", postLink, `: "${data.commentSnippet || '...'}"`];
        linkPath = data.groupId && data.postId ? `/groups/${data.groupId}/#post-${data.postId}` : undefined;
        break;
      default:
        messageParts = ["New notification."];
    }
    
    return { messageContent: <p className="text-sm text-foreground">{messageParts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>)}</p>, linkPath };
  };

  const { messageContent, linkPath } = renderMessage();
  const CardWrapper = linkPath ? ({ children }: {children: React.ReactNode}) => <Link href={linkPath as string} className="block hover:bg-muted/50 transition-colors" onClick={() => !activity.isRead && onMarkAsRead(activity.id)}>{children}</Link> : ({ children }: {children: React.ReactNode}) => <div onClick={() => !activity.isRead && onMarkAsRead(activity.id)}>{children}</div>;


  return (
    <Card className={cn("overflow-hidden", !activity.isRead && "border-accent border-2 shadow-accent/30 shadow-lg")}>
      <CardWrapper>
        <CardContent className="p-4 flex items-start space-x-4 relative">
          {!activity.isRead && (
            <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-accent" title="Unread"></div>
          )}
          <div className="flex-shrink-0 pt-1">
            {activity.data.actorPhotoURL ? (
               <Avatar className="h-10 w-10">
                <AvatarImage src={activity.data.actorPhotoURL} alt={activity.data.actorDisplayName || "User"} />
                <ActorAvatarFallback name={activity.data.actorDisplayName} />
              </Avatar>
            ) : (
                getIcon()
            )}
          </div>
          <div className="flex-grow">
            {messageContent}
            <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
          </div>
          {!activity.isRead && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => { 
                e.preventDefault(); // Prevent link navigation if it's a link
                e.stopPropagation();
                onMarkAsRead(activity.id);
              }}
              className="ml-auto flex-shrink-0 text-xs text-muted-foreground hover:text-accent"
              aria-label="Mark as read"
            >
              <Eye className="h-4 w-4 mr-1" /> Mark Read
            </Button>
          )}
        </CardContent>
      </CardWrapper>
    </Card>
  );
}

// Placeholder BellIcon if lucide-react's Bell is not suitable or available
const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

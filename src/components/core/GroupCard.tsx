
import { Group } from "@/lib/types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Users } from "lucide-react"; 
import { cn } from "@/lib/utils";

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const hasBackgroundImage = !!group.backgroundImageUrl;

  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-shadow duration-300 aspect-[4/3] flex flex-col">
      {hasBackgroundImage && (
        <Image
          src={group.backgroundImageUrl!}
          alt={`${group.name} background`}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
          data-ai-hint="group background"
        />
      )}
      
      <div className={cn(
        "relative z-10 flex flex-col flex-grow p-0", 
        hasBackgroundImage && "bg-black/60" 
      )}>
        <CardHeader className={cn("flex-grow", hasBackgroundImage && "text-white")}>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className={cn("text-xl line-clamp-2", hasBackgroundImage ? "text-white" : "text-primary")}>
              {group.name}
            </CardTitle>
            {!hasBackgroundImage && (
              group.themeColor ? (
                <span className={`h-6 w-6 rounded-full ${group.themeColor}`} />
              ) : (
                <Users className="h-6 w-6 text-muted-foreground" />
              )
            )}
          </div>
          <CardDescription className={cn(
            "min-h-[40px] line-clamp-3 text-sm", // Ensure enough space for 3 lines
            hasBackgroundImage ? "text-gray-200" : "text-muted-foreground"
          )}>
            {group.description}
          </CardDescription>
          <div className={cn("text-xs mt-2", hasBackgroundImage ? "text-gray-300" : "text-muted-foreground")}>
            {group.postCount !== undefined && <span>{group.postCount} posts</span>}
            {group.postCount !== undefined && group.memberCount !== undefined && <span className="mx-1">&middot;</span>}
            {group.memberCount !== undefined && <span>{group.memberCount} members</span>}
          </div>
        </CardHeader>
        <div className={cn("p-4 pt-0 mt-auto", hasBackgroundImage ? "p-4" : "p-6 pt-0")}>
          <Link href={`/groups/${group.id}`} passHref>
            <Button 
              variant={hasBackgroundImage ? "outline" : "default"} 
              className={cn(
                "w-full", 
                hasBackgroundImage 
                  ? "border-white text-white hover:bg-white/10 hover:text-white" 
                  : "border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              )}
            >
              View Group
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

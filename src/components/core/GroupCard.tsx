
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
        <>
          <Image
            src={group.backgroundImageUrl!}
            alt={`${group.name} background`}
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0"
            data-ai-hint="group background"
          />
          <div className="absolute inset-0 z-0 bg-black/60 dark:bg-black/70" />
        </>
      )}
      
      <div className={cn(
        "relative z-10 flex flex-col flex-grow p-0"
      )}>
        <CardHeader className={cn("flex-grow", hasBackgroundImage && "text-primary-foreground")}>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className={cn(
                "text-xl line-clamp-2", 
                hasBackgroundImage ? "text-primary-foreground" : "text-primary"
              )}
            >
              {group.name}
            </CardTitle>
            {!hasBackgroundImage && (
                <Users className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <CardDescription className={cn(
            "min-h-[40px] line-clamp-3 text-sm", 
            hasBackgroundImage ? "text-primary-foreground/90" : "text-muted-foreground"
          )}>
            {group.description}
          </CardDescription>
          <div className={cn(
              "text-xs mt-2", 
              hasBackgroundImage ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {group.postCount !== undefined && <span>{group.postCount} posts</span>}
            {group.postCount !== undefined && group.memberCount !== undefined && <span className="mx-1">&middot;</span>}
            {group.memberCount !== undefined && <span>{group.memberCount} members</span>}
          </div>
        </CardHeader>
        <div className={cn("p-4 pt-0 mt-auto")}>
          <Link href={`/groups/${group.id}`} passHref>
            <Button 
              variant={hasBackgroundImage ? "outline" : "default"} 
              className={cn(
                "w-full", 
                hasBackgroundImage 
                  ? "border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" 
                  : "bg-accent text-accent-foreground hover:bg-accent/90" // Default variant already uses accent
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

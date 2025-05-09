import { Group } from "@/lib/types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users } from "lucide-react"; // Example icon

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl text-primary">{group.name}</CardTitle>
          {group.themeColor ? (
             <span className={`h-6 w-6 rounded-full ${group.themeColor}`} />
          ) : (
            <Users className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <CardDescription className="min-h-[40px] line-clamp-2">{group.description}</CardDescription>
        <div className="text-xs text-muted-foreground mt-2">
          {group.postCount !== undefined && <span>{group.postCount} posts</span>}
          {group.postCount !== undefined && group.memberCount !== undefined && <span className="mx-1">&middot;</span>}
          {group.memberCount !== undefined && <span>{group.memberCount} members</span>}
        </div>
      </CardHeader>
      <div className="p-6 pt-0">
        <Link href={`/groups/${group.id}`} passHref>
          <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            View Group
          </Button>
        </Link>
      </div>
    </Card>
  );
}

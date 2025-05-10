
import { create } from 'zustand';
import type { 
    Post, 
    Group, 
    ActivityItem, 
    ActivityType, 
    ActivityItemData,
    UserCreatedPostData,
    UserPostFlaggedData,
    OthersLikedUserPostData,
    OthersCommentedOnUserPostData
} from '@/lib/types';
import { generatePseudonym } from '@/lib/pseudonyms'; 

// Mock user UIDs for demonstrating activity feed for a "logged-in" mock user
const MOCK_USER_UID_1 = 'mock-user-uid-1';
const MOCK_USER_UID_2 = 'mock-user-uid-2';
const MOCK_USER_UID_3 = 'mock-user-uid-3';
const MOCK_USER_UID_4 = 'mock-user-uid-4';


// Define the public release date
const PUBLIC_RELEASE_DATE = new Date('2025-05-10T12:00:00.000Z');

// Helper function to subtract time from a date
const subtractTime = (date: Date, amount: number, unit: 'minutes' | 'hours' | 'days') => {
  const newDate = new Date(date);
  if (unit === 'minutes') newDate.setMinutes(newDate.getMinutes() - amount);
  else if (unit === 'hours') newDate.setHours(newDate.getHours() - amount);
  else if (unit === 'days') newDate.setDate(newDate.getDate() - amount);
  return newDate.toISOString();
};

// 1. Initial raw definition of groups (without postCount, memberCount)
const MOCK_GROUPS_INITIAL_DEFINITION: Omit<Group, 'postCount' | 'memberCount'>[] = [
  { id: 'tech', name: 'Technology Talk', description: 'Discussions about the latest in tech, gadgets, and software.', creatorId: MOCK_USER_UID_1, backgroundImageUrl: 'https://picsum.photos/seed/techgroup/600/300' },
  { id: 'politics', name: 'Political Arena', description: 'Debates and news regarding global and local politics.', creatorId: 'system' },
  { id: 'gaming', name: 'Game Central', description: 'Everything about video games, from retro to modern.', creatorId: MOCK_USER_UID_2, backgroundImageUrl: 'https://picsum.photos/seed/gaminggroup/600/300' },
  { id: 'showerthoughts', name: 'Shower Thoughts', description: 'Those profound or silly thoughts you have in the shower.', creatorId: 'system' },
  { id: 'foodies', name: 'Food Lovers', description: 'Share recipes, restaurant reviews, and culinary adventures.', creatorId: MOCK_USER_UID_1, backgroundImageUrl: 'https://picsum.photos/seed/foodiesgroup/600/300' },
  { id: 'books', name: 'Bookworms Corner', description: 'Discuss your favorite books, authors, and genres.', creatorId: 'system', backgroundImageUrl: 'https://picsum.photos/seed/booksgroup/600/300' },
  { id: 'music', name: 'Music Hub', description: 'Share and discover new music, artists, and genres.', creatorId: 'system' },
  { id: 'videos', name: 'Video Vibes', description: 'Interesting videos, short films, and discussions.', creatorId: 'system', backgroundImageUrl: 'https://picsum.photos/seed/videosgroup/600/300' },
  { id: 'photography', name: 'Photography Club', description: 'Share your best shots, techniques, and gear talk.', creatorId: MOCK_USER_UID_2, backgroundImageUrl: 'https://picsum.photos/seed/photography/600/300' },
  { id: 'travel', name: 'Wanderlust Tales', description: 'Travel stories, tips, and destination guides.', creatorId: 'system' },
  { id: 'science', name: 'Science Wonders', description: 'Exploring the marvels of science and discovery.', creatorId: MOCK_USER_UID_1, backgroundImageUrl: 'https://picsum.photos/seed/science/600/300' },
  { id: 'diy', name: 'DIY & Crafts', description: 'Creative projects, tutorials, and handmade items.', creatorId: 'system' },
  { id: 'art', name: 'Art & Design', description: 'Showcase your artwork, discuss design principles, and find inspiration.', creatorId: MOCK_USER_UID_1, backgroundImageUrl: 'https://picsum.photos/seed/artgroup/600/300' },
  { id: 'fitness', name: 'Fitness Fanatics', description: 'Workout routines, nutrition tips, and fitness motivation.', creatorId: MOCK_USER_UID_2, backgroundImageUrl: 'https://picsum.photos/seed/fitnessgroup/600/300' },
  { id: 'nature', name: 'Nature Lovers', description: 'Share photos of wildlife, landscapes, and discuss conservation.', creatorId: 'system' },
  { id: 'coding', name: 'Code Corner', description: 'All things programming, from web dev to machine learning.', creatorId: MOCK_USER_UID_1, backgroundImageUrl: 'https://picsum.photos/seed/codinggroup/600/300' },
  { id: 'movies', name: 'Movie Buffs', description: 'Discuss new releases, classic films, and movie theories.', creatorId: 'system', backgroundImageUrl: 'https://picsum.photos/seed/moviesgroup/600/300' },
  { id: 'space', name: 'Cosmic Explorers', description: 'Astronomy, space travel, and the mysteries of the universe.', creatorId: MOCK_USER_UID_2, backgroundImageUrl: 'https://picsum.photos/seed/spacegroup/600/300' },
  { id: 'history', name: 'History Hub', description: 'Dive into historical events, figures, and periods.', creatorId: 'system' },
  { id: 'philosophy', name: 'Deep Thinkers', description: 'Philosophical discussions and thought experiments.', creatorId: MOCK_USER_UID_1, backgroundImageUrl: 'https://picsum.photos/seed/philosophygroup/600/300' },
];

// 2. Initial raw data for posts
const MOCK_POSTS_INITIAL_DATA: Omit<Post, 'groupName' | 'createdAt' | 'likes' | 'dislikes' | 'commentsCount'>[] = [
  {
    id: '1',
    groupId: 'tech',
    pseudonym: "Clever_Circuit", 
    text: "Just upgraded to the latest **Quantum Processor X1**! Performance is mind-blowing. Anyone else tried it? It's supposed to be 50% faster in multi-core tasks. Check out the [official benchmarks](https://example.com/benchmarks).",
    userId: MOCK_USER_UID_1,
    userDisplayName: "Tech Enthusiast",
    userPhotoURL: "https://picsum.photos/seed/user1/40/40",
  },
  {
    id: '6',
    groupId: 'tech',
    pseudonym: "Digital_Dynamo", 
    text: "AI is evolving so fast. What are some ethical considerations we should be discussing more openly?",
    userId: MOCK_USER_UID_2,
  },
  {
    id: '8',
    groupId: 'videos',
    pseudonym: "Vibrant_Vortex", 
    text: "Check out this incredible drone footage of the Northern Lights!",
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    userId: MOCK_USER_UID_3,
  },
  {
    id: '10',
    groupId: 'gaming',
    pseudonym: "Pixel_Pioneer", 
    text: "Hilarious gaming moments compilation video I found.",
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    userId: MOCK_USER_UID_1,
  },
  {
    id: '13',
    groupId: 'science',
    pseudonym: "Quantum_Quill",
    text: "Mind-boggling discovery about black hole thermodynamics published today. Link to the paper: [ArXiv](https://arxiv.org/)",
    linkUrl: "https://arxiv.org/",
    linkTitle: "Black Hole Thermodynamics Paper",
    userId: MOCK_USER_UID_1,
  },
  {
    id: '2',
    groupId: 'politics',
    pseudonym: "Brave_Beacon", 
    text: "The new environmental bill proposal seems promising, but I'm concerned about its economic impact. What are your thoughts? It aims to reduce emissions by 30% by 2030.",
    imageUrl: 'https://picsum.photos/seed/politics/600/300',
    userId: MOCK_USER_UID_4,
  },
  {
    id: '7',
    groupId: 'books',
    pseudonym: "Ancient_Atlas", 
    text: "Just finished reading 'Dune Messiah'. What a sequel! The philosophical undertones are even deeper than the first book. Highly recommend for sci-fi fans who love complex narratives.",
    imageUrl: 'https://picsum.photos/seed/books/600/350',
    userId: MOCK_USER_UID_1,
  },
   {
    id: '9',
    groupId: 'music',
    pseudonym: "Sonic_Synth", 
    text: "This new lofi track is perfect for studying. So chill.",
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
    userId: MOCK_USER_UID_2,
  },
  {
    id: '3',
    groupId: 'showerthoughts',
    pseudonym: "Quirky_Quasar", 
    text: "If we can't see air, do fish see water?",
    userId: MOCK_USER_UID_2,
    userDisplayName: "Thinker",
    userPhotoURL: "https://picsum.photos/seed/user2/40/40",
  },
  {
    id: '11',
    groupId: 'photography',
    pseudonym: "Shutter_Sorcerer",
    text: "Captured this stunning sunset over the mountains last night. #nofilter",
    imageUrl: 'https://picsum.photos/seed/sunsetphoto/700/450',
    userId: MOCK_USER_UID_2,
  },
  {
    id: '4',
    groupId: 'gaming',
    pseudonym: "Epic_Elixir", 
    text: "CyberNeon Chronicles just dropped its new DLC. The storyline is epic! And the new zone looks amazing.",
    imageUrl: 'https://picsum.photos/seed/gaming/600/400',
    userId: MOCK_USER_UID_1,
  },
  {
    id: '14',
    groupId: 'diy',
    pseudonym: "Crafty_Creator",
    text: "My latest weekend project: a hand-knitted scarf. What do you think?",
    imageUrl: 'https://picsum.photos/seed/diyscarf/500/500',
    userId: MOCK_USER_UID_2,
    userDisplayName: "Crafty Person",
    userPhotoURL: "https://picsum.photos/seed/user3/40/40",
  },
  {
    id: '15',
    groupId: 'tech',
    pseudonym: "Code_Comet",
    text: "Debating switching to a new code editor. VSCode vs Sublime vs Neovim - what are your preferences and why?",
    userId: MOCK_USER_UID_4,
  },
  {
    id: '5',
    groupId: 'foodies',
    pseudonym: "Zesty_Zucchini", 
    text: "Found this amazing recipe for vegan lasagna. You won't believe it's not dairy! [Link to recipe](https://example.com/vegan-lasagna)",
    linkUrl: "https://example.com/vegan-lasagna",
    linkTitle: "Amazing Vegan Lasagna Recipe",
    userId: MOCK_USER_UID_1,
  },
  {
    id: '12',
    groupId: 'travel',
    pseudonym: "Nomad_Navigator",
    text: "Just got back from a backpacking trip through Southeast Asia. AMA!",
    userId: MOCK_USER_UID_3,
  },
];

// 3. Process MOCK_POSTS: assign createdAt, likes, dislikes, commentsCount, AND groupName
export const MOCK_POSTS: Post[] = MOCK_POSTS_INITIAL_DATA.map((postData, index) => {
  let date;
  switch (index) {
    case 0: date = subtractTime(PUBLIC_RELEASE_DATE, 30, 'minutes'); break; 
    case 1: date = subtractTime(PUBLIC_RELEASE_DATE, 45, 'minutes'); break; 
    case 2: date = subtractTime(PUBLIC_RELEASE_DATE, 1, 'hours'); break;    
    case 3: date = subtractTime(PUBLIC_RELEASE_DATE, 1.5, 'hours'); break;  
    case 4: date = subtractTime(PUBLIC_RELEASE_DATE, 2, 'hours'); break;    
    case 5: date = subtractTime(PUBLIC_RELEASE_DATE, 2.5, 'hours'); break;  
    case 6: date = subtractTime(PUBLIC_RELEASE_DATE, 3, 'hours'); break;    
    case 7: date = subtractTime(PUBLIC_RELEASE_DATE, 4, 'hours'); break;    
    case 8: date = subtractTime(PUBLIC_RELEASE_DATE, 5, 'hours'); break;    
    case 9: date = subtractTime(PUBLIC_RELEASE_DATE, 6, 'hours'); break;    
    case 10: date = subtractTime(PUBLIC_RELEASE_DATE, 8, 'hours'); break;   
    case 11: date = subtractTime(PUBLIC_RELEASE_DATE, 10, 'hours'); break;  
    case 12: date = subtractTime(PUBLIC_RELEASE_DATE, 1, 'days'); break;    
    case 13: { let d = subtractTime(PUBLIC_RELEASE_DATE, 1, 'days'); date = subtractTime(new Date(d), 2, 'hours'); break; }
    case 14: date = subtractTime(PUBLIC_RELEASE_DATE, 2, 'days'); break;   
    default: date = PUBLIC_RELEASE_DATE.toISOString();
  }
  
  const likes = Math.floor(Math.random() * 150) + 5;
  const dislikes = Math.floor(Math.random() * (likes / 5));
  const commentsCount = Math.floor(Math.random() * (likes / 3));
  
  const groupForPost = MOCK_GROUPS_INITIAL_DEFINITION.find(g => g.id === postData.groupId);

  return {
    ...postData,
    createdAt: date,
    likes: likes,
    dislikes: dislikes,
    commentsCount: commentsCount,
    groupName: groupForPost?.name || 'Unknown Group',
  };
}).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


// 4. Calculate post counts for each group
const groupPostCounts: Record<string, number> = {};
MOCK_POSTS.forEach(post => {
  groupPostCounts[post.groupId] = (groupPostCounts[post.groupId] || 0) + 1;
});

// 5. Define final MOCK_GROUPS with postCount and memberCount
export const MOCK_GROUPS: Group[] = MOCK_GROUPS_INITIAL_DEFINITION.map(groupDef => {
  const postCount = groupPostCounts[groupDef.id] || 0;
  return {
    ...groupDef,
    postCount: postCount,
    // Member count is at least the number of unique users who posted + some random factor, or 1 if creator is known
    memberCount: Math.max(1, 
      postCount > 0 ? 
      new Set(MOCK_POSTS.filter(p => p.groupId === groupDef.id).map(p => p.userId)).size + Math.floor(Math.random() * (postCount * 3)) + Math.floor(Math.random() * 5)
      : (groupDef.creatorId !== 'system' ? 1 : 0) + Math.floor(Math.random() * 10)
    ),
  };
}).sort((a,b) => a.name.localeCompare(b.name));


// 6. Define MOCK_ACTIVITY_FEED using the finalized MOCK_POSTS and MOCK_GROUPS
export const MOCK_ACTIVITY_FEED: ActivityItem[] = [
  {
    id: 'act1',
    userId: MOCK_USER_UID_1,
    type: 'USER_CREATED_POST',
    timestamp: MOCK_POSTS.find(p => p.id === '1')?.createdAt || PUBLIC_RELEASE_DATE.toISOString(),
    isRead: false,
    data: {
      type: 'USER_CREATED_POST',
      postId: '1',
      postSnippet: MOCK_POSTS.find(p => p.id === '1')?.text?.substring(0,50) + '...' || "A new post...",
      groupId: 'tech',
      groupName: MOCK_GROUPS.find(g => g.id === 'tech')?.name || 'Technology Talk',
    } as UserCreatedPostData,
  },
  {
    id: 'act2',
    userId: MOCK_USER_UID_1,
    type: 'OTHERS_LIKED_USER_POST',
    timestamp: subtractTime(new Date(MOCK_POSTS.find(p => p.id === '1')?.createdAt || PUBLIC_RELEASE_DATE), -5, 'minutes'), 
    isRead: true,
    data: {
      type: 'OTHERS_LIKED_USER_POST',
      postId: '1',
      postSnippet: MOCK_POSTS.find(p => p.id === '1')?.text?.substring(0,50) + '...' || "A new post...",
      groupId: 'tech',
      groupName: MOCK_GROUPS.find(g => g.id === 'tech')?.name || 'Technology Talk',
      actorDisplayName: 'RandomUser123',
      actorPhotoURL: 'https://picsum.photos/seed/actor1/40/40',
      actorUserId: 'random-user-123-uid',
    } as OthersLikedUserPostData,
  },
  {
    id: 'act3',
    userId: MOCK_USER_UID_1,
    type: 'USER_CREATED_GROUP',
    timestamp: subtractTime(PUBLIC_RELEASE_DATE, 1, 'days'), 
    isRead: false,
    data: {
      type: 'USER_CREATED_GROUP',
      groupId: 'foodies',
      groupName: MOCK_GROUPS.find(g => g.id === 'foodies')?.name || 'Food Lovers',
    } as UserCreatedGroupData,
  },
  {
    id: 'act4',
    userId: MOCK_USER_UID_1, 
    type: 'USER_POST_FLAGGED',
    timestamp: subtractTime(new Date(MOCK_POSTS.find(p => p.id === '4')?.createdAt || PUBLIC_RELEASE_DATE), -10, 'minutes'), 
    isRead: false,
    data: {
      type: 'USER_POST_FLAGGED',
      postId: '4', 
      postSnippet: MOCK_POSTS.find(p => p.id === '4')?.text?.substring(0,50) + '...' || "A flagged post...",
      groupId: 'gaming',
      groupName: MOCK_GROUPS.find(g => g.id === 'gaming')?.name || 'Game Central',
      flagReason: 'Potentially controversial content.',
    } as UserPostFlaggedData,
  },
  {
    id: 'act5',
    userId: MOCK_USER_UID_1,
    type: 'OTHERS_COMMENTED_ON_USER_POST',
    timestamp: subtractTime(new Date(MOCK_POSTS.find(p => p.id === '1')?.createdAt || PUBLIC_RELEASE_DATE), -15, 'minutes'), 
    isRead: true,
    data: {
      type: 'OTHERS_COMMENTED_ON_USER_POST',
      postId: '1',
      postSnippet: MOCK_POSTS.find(p => p.id === '1')?.text?.substring(0,50) + '...' || "A commented post...",
      groupId: 'tech',
      groupName: MOCK_GROUPS.find(g => g.id === 'tech')?.name || 'Technology Talk',
      actorDisplayName: 'HelpfulCommenter',
      actorPhotoURL: 'https://picsum.photos/seed/actor2/40/40',
      commentSnippet: 'That sounds awesome! I was thinking of getting one.',
      actorUserId: 'helpful-commenter-uid',
    } as OthersCommentedOnUserPostData,
  },
  {
    id: 'act6',
    userId: MOCK_USER_UID_2, 
    type: 'USER_CREATED_POST',
    timestamp: MOCK_POSTS.find(p => p.id === '3')?.createdAt || PUBLIC_RELEASE_DATE.toISOString(),
    isRead: false,
    data: {
      type: 'USER_CREATED_POST',
      postId: '3',
      postSnippet: MOCK_POSTS.find(p => p.id === '3')?.text?.substring(0,50) + '...' || "Another new post...",
      groupId: 'showerthoughts',
      groupName: MOCK_GROUPS.find(g => g.id === 'showerthoughts')?.name || 'Shower Thoughts',
    } as UserCreatedPostData,
  },
  {
    id: 'act7',
    userId: MOCK_USER_UID_2,
    type: 'OTHERS_LIKED_USER_POST',
    timestamp: subtractTime(new Date(MOCK_POSTS.find(p => p.id === '3')?.createdAt || PUBLIC_RELEASE_DATE), -5, 'minutes'),
    isRead: false,
    data: {
      type: 'OTHERS_LIKED_USER_POST',
      postId: '3',
      postSnippet: MOCK_POSTS.find(p => p.id === '3')?.text?.substring(0,50) + '...' || "A liked post...",
      groupId: 'showerthoughts',
      groupName: MOCK_GROUPS.find(g => g.id === 'showerthoughts')?.name || 'Shower Thoughts',
      actorDisplayName: 'AnotherCuriousMind',
      actorPhotoURL: 'https://picsum.photos/seed/actor3/40/40',
      actorUserId: 'curious-mind-uid',
    } as OthersLikedUserPostData,
  }
].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


interface PostsState {
  posts: Post[];
  groups: Group[];
  activityFeed: ActivityItem[];
  addPost: (post: Post) => void;
  getPostsByGroupId: (groupId: string) => Post[];
  getAllPosts: () => Post[];
  getGroupById: (groupId: string) => Group | undefined;
  updatePostReactions: (postId: string, newLikes: number, newDislikes: number, actingUserId?: string) => void;
  addGroup: (group: Group) => void;
  
  addActivityItem: (itemDetails: {
    userId: string;
    type: ActivityType; 
    data: ActivityItemData; 
  }) => void;
  getUserActivities: (userId: string) => ActivityItem[];
  markActivityAsRead: (userId: string, activityId: string) => void;
  markAllActivitiesAsRead: (userId: string) => void;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: MOCK_POSTS, 
  groups: MOCK_GROUPS,
  activityFeed: MOCK_ACTIVITY_FEED,

  addPost: (post) => {
    const newPostWithGeneratedPseudonym = {
      ...post,
      pseudonym: post.pseudonym || generatePseudonym(), 
      createdAt: post.createdAt || new Date().toISOString(), 
    };
    set((state) => {
      const updatedGroups = state.groups.map(group => {
        if (group.id === newPostWithGeneratedPseudonym.groupId) {
          return { ...group, postCount: (group.postCount || 0) + 1 };
        }
        return group;
      });
      return { 
        posts: [newPostWithGeneratedPseudonym, ...state.posts].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        groups: updatedGroups.sort((a,b) => a.name.localeCompare(b.name))
      };
    });
  },
  getPostsByGroupId: (groupId) => get().posts.filter(post => post.groupId === groupId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  getAllPosts: () => get().posts.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  getGroupById: (groupId: string) => get().groups.find(group => group.id === groupId),
  
  updatePostReactions: (postId: string, newLikes: number, newDislikes: number, actingUserId?: string) => {
    const post = get().posts.find(p => p.id === postId);
    if (!post) return;

    set((state) => ({
      posts: state.posts.map(p =>
        p.id === postId ? { ...p, likes: newLikes, dislikes: newDislikes } : p
      ),
    }));

    if (actingUserId && post.userId && actingUserId !== post.userId) {
      const actorPost = get().posts.find(p => p.userId === actingUserId && (p.userDisplayName || p.userPhotoURL));
      const actorDisplayName = actorPost?.userDisplayName || 'An anonymous user';
      const actorPhotoURL = actorPost?.userPhotoURL || `https://picsum.photos/seed/${actingUserId}/40/40`; 

      const liked = newLikes > post.likes;

      if (liked) { 
        get().addActivityItem({
          userId: post.userId,
          type: 'OTHERS_LIKED_USER_POST',
          data: {
            type: 'OTHERS_LIKED_USER_POST',
            postId: post.id,
            postSnippet: post.text?.substring(0, 50) + (post.text && post.text.length > 50 ? '...' : ''),
            groupId: post.groupId,
            groupName: post.groupName,
            actorUserId: actingUserId,
            actorDisplayName: actorDisplayName,
            actorPhotoURL: actorPhotoURL,
          } as OthersLikedUserPostData,
        });
      }
    }
  },

  addGroup: (group) => {
    const newGroupWithDefaults = {
      ...group,
      id: group.id || crypto.randomUUID(), 
      postCount: group.postCount || 0,
      memberCount: group.memberCount || 1, 
    };
    set((state) => ({
      groups: [newGroupWithDefaults, ...state.groups].sort((a,b) => a.name.localeCompare(b.name)),
    }));
     if (group.creatorId) {
      get().addActivityItem({
        userId: group.creatorId,
        type: 'USER_CREATED_GROUP',
        data: {
          type: 'USER_CREATED_GROUP',
          groupId: newGroupWithDefaults.id,
          groupName: newGroupWithDefaults.name,
        } as UserCreatedGroupData,
      });
    }
  },

  addActivityItem: (itemDetails) => {
    const newActivity: ActivityItem = {
      id: crypto.randomUUID(),
      userId: itemDetails.userId,
      type: itemDetails.type,
      timestamp: new Date().toISOString(),
      isRead: false,
      data: itemDetails.data,
    };
    set((state) => ({
      activityFeed: [newActivity, ...state.activityFeed].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    }));
  },

  getUserActivities: (userId: string) => {
    return get().activityFeed
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  markActivityAsRead: (userId: string, activityId: string) => {
    set((state) => ({
      activityFeed: state.activityFeed.map(activity =>
        activity.id === activityId && activity.userId === userId
          ? { ...activity, isRead: true }
          : activity
      ),
    }));
  },

  markAllActivitiesAsRead: (userId: string) => {
    set((state) => ({
      activityFeed: state.activityFeed.map(activity =>
        activity.userId === userId ? { ...activity, isRead: true } : activity
      ),
    }));
  },
}));

// The MOCK_POSTS, MOCK_GROUPS, and MOCK_ACTIVITY_FEED are already sorted upon creation.
// The following setState call to re-sort them is redundant and can be removed.
// usePostsStore.setState(state => ({
//     ...state,
//     posts: state.posts.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
//     groups: state.groups.sort((a,b) => a.name.localeCompare(b.name)),
//     activityFeed: state.activityFeed.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
// }));


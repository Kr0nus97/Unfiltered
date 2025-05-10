
import { create } from 'zustand';
import type { 
    Post, 
    Group, 
    ActivityItem, 
    ActivityType, 
    ActivityItemData,
    UserCreatedPostData,
    UserCreatedGroupData,
    UserPostFlaggedData,
    OthersLikedUserPostData,
    OthersCommentedOnUserPostData
} from '@/lib/types';
import { generatePseudonym } from '@/lib/pseudonyms'; 

// Mock user UIDs for demonstrating activity feed for a "logged-in" mock user
const MOCK_USER_UID_1 = 'mock-user-uid-1';
const MOCK_USER_UID_2 = 'mock-user-uid-2';


export const MOCK_GROUPS: Group[] = [
  { id: 'tech', name: 'Technology Talk', description: 'Discussions about the latest in tech, gadgets, and software.', postCount: 152, memberCount: 2300, creatorId: MOCK_USER_UID_1, backgroundImageUrl: 'https://picsum.photos/seed/techgroup/600/300' },
  { id: 'politics', name: 'Political Arena', description: 'Debates and news regarding global and local politics.', postCount: 489, memberCount: 5100, creatorId: 'system' },
  { id: 'gaming', name: 'Game Central', description: 'Everything about video games, from retro to modern.', postCount: 765, memberCount: 8800, creatorId: MOCK_USER_UID_2, backgroundImageUrl: 'https://picsum.photos/seed/gaminggroup/600/300' },
  { id: 'showerthoughts', name: 'Shower Thoughts', description: 'Those profound or silly thoughts you have in the shower.', postCount: 1023, memberCount: 12000, creatorId: 'system' },
  { id: 'foodies', name: 'Food Lovers', description: 'Share recipes, restaurant reviews, and culinary adventures.', postCount: 340, memberCount: 4500, creatorId: MOCK_USER_UID_1, backgroundImageUrl: 'https://picsum.photos/seed/foodiesgroup/600/300' },
  { id: 'books', name: 'Bookworms Corner', description: 'Discuss your favorite books, authors, and genres.', postCount: 210, memberCount: 3200, creatorId: 'system', backgroundImageUrl: 'https://picsum.photos/seed/booksgroup/600/300' },
  { id: 'music', name: 'Music Hub', description: 'Share and discover new music, artists, and genres.', postCount: 180, memberCount: 2800, creatorId: 'system' },
  { id: 'videos', name: 'Video Vibes', description: 'Interesting videos, short films, and discussions.', postCount: 95, memberCount: 1500, creatorId: 'system', backgroundImageUrl: 'https://picsum.photos/seed/videosgroup/600/300' },
  { id: 'photography', name: 'Photography Club', description: 'Share your best shots, techniques, and gear talk.', postCount: 120, memberCount: 1800, creatorId: MOCK_USER_UID_2, backgroundImageUrl: 'https://picsum.photos/seed/photography/600/300' },
  { id: 'travel', name: 'Wanderlust Tales', description: 'Travel stories, tips, and destination guides.', postCount: 250, memberCount: 3500, creatorId: 'system' },
  { id: 'science', name: 'Science Wonders', description: 'Exploring the marvels of science and discovery.', postCount: 190, memberCount: 2900, creatorId: MOCK_USER_UID_1, backgroundImageUrl: 'https://picsum.photos/seed/science/600/300' },
  { id: 'diy', name: 'DIY & Crafts', description: 'Creative projects, tutorials, and handmade items.', postCount: 88, memberCount: 1250, creatorId: 'system' },
];

const BASE_DATE = new Date('2024-07-15T12:00:00.000Z');

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    groupId: 'tech',
    groupName: 'Technology Talk',
    pseudonym: "Clever_Circuit", 
    text: "Just upgraded to the latest **Quantum Processor X1**! Performance is mind-blowing. Anyone else tried it? It's supposed to be 50% faster in multi-core tasks. Check out the [official benchmarks](https://example.com/benchmarks).",
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 30).toISOString(), 
    likes: 15,
    dislikes: 1,
    commentsCount: 5,
    userId: MOCK_USER_UID_1,
    userDisplayName: "Tech Enthusiast",
    userPhotoURL: "https://picsum.photos/seed/user1/40/40",
  },
  {
    id: '2',
    groupId: 'politics',
    groupName: 'Political Arena',
    pseudonym: "Brave_Beacon", 
    text: "The new environmental bill proposal seems promising, but I'm concerned about its economic impact. What are your thoughts? It aims to reduce emissions by 30% by 2030.",
    imageUrl: 'https://picsum.photos/seed/politics/600/300',
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 60 * 2).toISOString(), 
    likes: 45,
    dislikes: 12,
    commentsCount: 22,
    userId: 'another-user-uid',
  },
  {
    id: '3',
    groupId: 'showerthoughts',
    groupName: 'Shower Thoughts',
    pseudonym: "Quirky_Quasar", 
    text: "If we can't see air, do fish see water?",
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 60 * 5).toISOString(), 
    likes: 102,
    dislikes: 3,
    commentsCount: 15,
    userId: MOCK_USER_UID_2,
    userDisplayName: "Thinker",
    userPhotoURL: "https://picsum.photos/seed/user2/40/40",
  },
    {
    id: '4',
    groupId: 'gaming',
    groupName: 'Game Central',
    pseudonym: "Epic_Elixir", 
    text: "CyberNeon Chronicles just dropped its new DLC. The storyline is epic! And the new zone looks amazing.",
    imageUrl: 'https://picsum.photos/seed/gaming/600/400',
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 60 * 8).toISOString(), 
    likes: 78,
    dislikes: 5,
    commentsCount: 30,
    userId: MOCK_USER_UID_1,
  },
  {
    id: '5',
    groupId: 'foodies',
    groupName: 'Food Lovers',
    pseudonym: "Zesty_Zucchini", 
    text: "Found this amazing recipe for vegan lasagna. You won't believe it's not dairy! [Link to recipe](https://example.com/vegan-lasagna)",
    linkUrl: "https://example.com/vegan-lasagna",
    linkTitle: "Amazing Vegan Lasagna Recipe",
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 60 * 24).toISOString(), 
    likes: 62,
    dislikes: 2,
    commentsCount: 18,
    userId: MOCK_USER_UID_1,
  },
   {
    id: '6',
    groupId: 'tech',
    groupName: 'Technology Talk',
    pseudonym: "Digital_Dynamo", 
    text: "AI is evolving so fast. What are some ethical considerations we should be discussing more openly?",
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 45).toISOString(), 
    likes: 33,
    dislikes: 0,
    commentsCount: 12,
    userId: MOCK_USER_UID_2,
  },
  {
    id: '7',
    groupId: 'books',
    groupName: 'Bookworms Corner',
    pseudonym: "Ancient_Atlas", 
    text: "Just finished reading 'Dune Messiah'. What a sequel! The philosophical undertones are even deeper than the first book. Highly recommend for sci-fi fans who love complex narratives.",
    imageUrl: 'https://picsum.photos/seed/books/600/350',
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 60 * 3).toISOString(), 
    likes: 50,
    dislikes: 1,
    commentsCount: 0, // Changed to 0 for testing placeholder
    userId: MOCK_USER_UID_1,
  },
  {
    id: '8',
    groupId: 'videos',
    groupName: 'Video Vibes',
    pseudonym: "Vibrant_Vortex", 
    text: "Check out this incredible drone footage of the Northern Lights!",
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 60 * 1).toISOString(), 
    likes: 88,
    dislikes: 2,
    commentsCount: 14,
    userId: 'another-user-uid',
  },
  {
    id: '9',
    groupId: 'music',
    groupName: 'Music Hub',
    pseudonym: "Sonic_Synth", 
    text: "This new lofi track is perfect for studying. So chill.",
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 60 * 4).toISOString(), 
    likes: 55,
    dislikes: 0,
    commentsCount: 7,
    userId: MOCK_USER_UID_2,
  },
  {
    id: '10',
    groupId: 'gaming',
    groupName: 'Game Central',
    pseudonym: "Pixel_Pioneer", 
    text: "Hilarious gaming moments compilation video I found.",
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 90).toISOString(), 
    likes: 67,
    dislikes: 3,
    commentsCount: 11,
    userId: MOCK_USER_UID_1,
  },
  {
    id: '11',
    groupId: 'photography',
    groupName: 'Photography Club',
    pseudonym: "Shutter_Sorcerer",
    text: "Captured this stunning sunset over the mountains last night. #nofilter",
    imageUrl: 'https://picsum.photos/seed/sunsetphoto/700/450',
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 60 * 6).toISOString(),
    likes: 95,
    dislikes: 2,
    commentsCount: 10,
    userId: MOCK_USER_UID_2,
  },
  {
    id: '12',
    groupId: 'travel',
    groupName: 'Wanderlust Tales',
    pseudonym: "Nomad_Navigator",
    text: "Just got back from a backpacking trip through Southeast Asia. AMA!",
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 60 * 48).toISOString(),
    likes: 120,
    dislikes: 4,
    commentsCount: 25,
    userId: 'another-user-uid-3',
  },
  {
    id: '13',
    groupId: 'science',
    groupName: 'Science Wonders',
    pseudonym: "Quantum_Quill",
    text: "Mind-boggling discovery about black hole thermodynamics published today. Link to the paper: [ArXiv](https://arxiv.org/)",
    linkUrl: "https://arxiv.org/",
    linkTitle: "Black Hole Thermodynamics Paper",
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 120).toISOString(),
    likes: 72,
    dislikes: 1,
    commentsCount: 8,
    userId: MOCK_USER_UID_1,
  },
  {
    id: '14',
    groupId: 'diy',
    groupName: 'DIY & Crafts',
    pseudonym: "Crafty_Creator",
    text: "My latest weekend project: a hand-knitted scarf. What do you think?",
    imageUrl: 'https://picsum.photos/seed/diyscarf/500/500',
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 60 * 10).toISOString(),
    likes: 40,
    dislikes: 0,
    commentsCount: 0, // For testing no comments placeholder
    userId: MOCK_USER_UID_2,
    userDisplayName: "Crafty Person",
    userPhotoURL: "https://picsum.photos/seed/user3/40/40",
  },
  {
    id: '15',
    groupId: 'tech',
    groupName: 'Technology Talk',
    pseudonym: "Code_Comet",
    text: "Debating switching to a new code editor. VSCode vs Sublime vs Neovim - what are your preferences and why?",
    createdAt: new Date(BASE_DATE.getTime() - 1000 * 60 * 180).toISOString(),
    likes: 25,
    dislikes: 0,
    commentsCount: 17,
    userId: 'another-user-uid-4',
  },
];

const MOCK_ACTIVITY_FEED: ActivityItem[] = [
  {
    id: 'act1',
    userId: MOCK_USER_UID_1,
    type: 'USER_CREATED_POST',
    timestamp: new Date(BASE_DATE.getTime() - 1000 * 60 * 30).toISOString(),
    isRead: false,
    data: {
      type: 'USER_CREATED_POST',
      postId: '1',
      postSnippet: "Just upgraded to the latest Quantum Processor X1!...",
      groupId: 'tech',
      groupName: 'Technology Talk',
    } as UserCreatedPostData,
  },
  {
    id: 'act2',
    userId: MOCK_USER_UID_1,
    type: 'OTHERS_LIKED_USER_POST',
    timestamp: new Date(BASE_DATE.getTime() - 1000 * 60 * 25).toISOString(),
    isRead: true,
    data: {
      type: 'OTHERS_LIKED_USER_POST',
      postId: '1',
      postSnippet: "Just upgraded to the latest Quantum Processor X1!...",
      groupId: 'tech',
      groupName: 'Technology Talk',
      actorDisplayName: 'RandomUser123',
      actorPhotoURL: 'https://picsum.photos/seed/actor1/40/40',
      actorUserId: 'random-user-123-uid',
    } as OthersLikedUserPostData,
  },
  {
    id: 'act3',
    userId: MOCK_USER_UID_1,
    type: 'USER_CREATED_GROUP',
    timestamp: new Date(BASE_DATE.getTime() - 1000 * 60 * 60 * 2).toISOString(),
    isRead: false,
    data: {
      type: 'USER_CREATED_GROUP',
      groupId: 'foodies',
      groupName: 'Food Lovers',
    } as UserCreatedGroupData,
  },
  {
    id: 'act4',
    userId: MOCK_USER_UID_1, 
    type: 'USER_POST_FLAGGED',
    timestamp: new Date(BASE_DATE.getTime() - 1000 * 60 * 15).toISOString(),
    isRead: false,
    data: {
      type: 'USER_POST_FLAGGED',
      postId: '4', 
      postSnippet: "CyberNeon Chronicles just dropped its new DLC...",
      groupId: 'gaming',
      groupName: 'Game Central',
      flagReason: 'Potentially controversial content.',
    } as UserPostFlaggedData,
  },
  {
    id: 'act5',
    userId: MOCK_USER_UID_1,
    type: 'OTHERS_COMMENTED_ON_USER_POST',
    timestamp: new Date(BASE_DATE.getTime() - 1000 * 60 * 10).toISOString(),
    isRead: true,
    data: {
      type: 'OTHERS_COMMENTED_ON_USER_POST',
      postId: '1',
      postSnippet: "Just upgraded to the latest Quantum Processor X1!...",
      groupId: 'tech',
      groupName: 'Technology Talk',
      actorDisplayName: 'HelpfulCommenter',
      actorPhotoURL: 'https://picsum.photos/seed/actor2/40/40',
      commentSnippet: 'That sounds awesome! I was thinking of getting one.',
      actorUserId: 'helpful-commenter-uid',
    } as OthersCommentedOnUserPostData,
  },
];


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
    type: ActivityType; // The discriminator type
    data: ActivityItemData; // The discriminated union
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
        groups: updatedGroups 
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
      const actorPost = get().posts.find(p => p.userId === actingUserId);
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
      groups: [newGroupWithDefaults, ...state.groups].sort((a,b) => a.name.localeCompare(b.name)), // Sort groups by name
    }));
     // Add activity item for group creation
     if (group.creatorId) {
      get().addActivityItem({
        userId: group.creatorId,
        type: 'USER_CREATED_GROUP',
        data: {
          type: 'USER_CREATED_GROUP',
          groupId: newGroupWithDefaults.id,
          groupName: newGroupWithDefaults.name,
          // actorUserId and other actor fields can be omitted if it's the user's own action
        } as UserCreatedGroupData, // Cast to specific type
      });
    }
  },

  addActivityItem: (itemDetails) => {
    const newActivity: ActivityItem = {
      id: crypto.randomUUID(),
      userId: itemDetails.userId,
      type: itemDetails.type, // This will be used as the discriminator
      timestamp: new Date().toISOString(),
      isRead: false,
      data: itemDetails.data, // Already a discriminated union
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

// Ensure initial groups are sorted
usePostsStore.setState(state => ({
    ...state,
    groups: state.groups.sort((a,b) => a.name.localeCompare(b.name))
}));

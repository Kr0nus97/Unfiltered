
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
    OthersCommentedOnUserPostData,
    UserMentionedInCommentData,
    Message,
    ChatSession,
    Comment,
    PostNearingDeletionData,
    MessageNearingDeletionData
} from '@/lib/types';
import { generatePseudonym } from '@/lib/pseudonyms'; 
import { addMonths, isAfter, differenceInDays, isBefore, format } from 'date-fns';

// Mock user UIDs for demonstrating activity feed for a "logged-in" mock user
const MOCK_USER_UID_1 = 'mock-user-uid-1'; // Main user for activities
const MOCK_USER_UID_2 = 'mock-user-uid-2'; // Another active user
const MOCK_USER_UID_3 = 'mock-user-uid-3'; // User for some posts/comments
const MOCK_USER_UID_4 = 'mock-user-uid-4'; // Another user

const ALL_MOCK_USERS = [
  { userId: MOCK_USER_UID_1, displayName: "Alice Wonderland", photoURL: "https://picsum.photos/seed/alice/40/40" },
  { userId: MOCK_USER_UID_2, displayName: "Bob TheBuilder", photoURL: "https://picsum.photos/seed/bob/40/40" },
  { userId: MOCK_USER_UID_3, displayName: "Charlie Brown", photoURL: "https://picsum.photos/seed/charlie/40/40" },
  { userId: MOCK_USER_UID_4, displayName: "Diana Prince", photoURL: "https://picsum.photos/seed/diana/40/40" },
  { userId: 'system', displayName: "System", photoURL: "" }, // For system-generated groups
];


// Define the public release date (acts as "current date" for simulation)
const PUBLIC_RELEASE_DATE = new Date('2025-05-10T12:00:00.000Z');
const DATA_RETENTION_MONTHS = 1;
const DELETION_WARNING_DAYS = 7; // Notify 7 days before deletion

// Helper function to subtract time from a date
const subtractTime = (date: Date, amount: number, unit: 'minutes' | 'hours' | 'days') => {
  const newDate = new Date(date);
  if (unit === 'minutes') newDate.setMinutes(newDate.getMinutes() - amount);
  else if (unit === 'hours') newDate.setHours(newDate.getHours() - amount);
  else if (unit === 'days') newDate.setDate(newDate.getDate() - amount);
  return newDate.toISOString();
};

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
  { id: 'memes', name: 'Meme Central', description: 'For the love of internet humor and viral content.', creatorId: 'system', backgroundImageUrl: 'https://picsum.photos/seed/memegroup/600/300' },
  { id: 'gardening', name: 'Green Thumbs', description: 'Tips, tricks, and showcases for plant enthusiasts.', creatorId: MOCK_USER_UID_3, backgroundImageUrl: 'https://picsum.photos/seed/gardengroup/600/300' },
  { id: 'pets', name: 'Pet Paradise', description: 'Share photos and stories of your beloved animal companions.', creatorId: 'system' },
  { id: 'finance', name: 'Financial Freedom', description: 'Discussing investments, savings, and personal finance.', creatorId: MOCK_USER_UID_4, backgroundImageUrl: 'https://picsum.photos/seed/financegroup/600/300' },
];

// Adjusting some post dates for testing deletion logic
const MOCK_POSTS_INITIAL_DATA: Omit<Post, 'groupName' | 'createdAt' | 'likes' | 'dislikes' | 'commentsCount' | 'comments' | 'pseudonym'>[] = [
  { // Post 1: Regular post, should be visible
    id: '1', groupId: 'tech', userId: MOCK_USER_UID_1, userDisplayName: "Alice Wonderland", userPhotoURL: "https://picsum.photos/seed/alice/40/40",
    text: "Just upgraded to the latest **Quantum Processor X1**! Performance is mind-blowing. @BobTheBuilder have you tried it? Check out the [official benchmarks](https://example.com/benchmarks).",
    isAnonymous: false,
    // createdAt will be PUBLIC_RELEASE_DATE - 30 minutes
  },
  { // Post 21: Will be older than 1 month from PUBLIC_RELEASE_DATE (should be "deleted")
    id: '21', groupId: 'history', userId: MOCK_USER_UID_1, userDisplayName: "Alice Wonderland", userPhotoURL: "https://picsum.photos/seed/alice/40/40",
    text: "This post should be 'deleted' as it's older than 1 month. Created 35 days before PUBLIC_RELEASE_DATE.",
    isAnonymous: false,
    // createdAt will be PUBLIC_RELEASE_DATE - 35 days
  },
  { // Post 22: Will be nearing deletion (e.g., 5 days from expiry if warning is 7 days)
    id: '22', groupId: 'philosophy', userId: MOCK_USER_UID_2, userDisplayName: "Bob TheBuilder", userPhotoURL: "https://picsum.photos/seed/bob/40/40",
    text: "This post is nearing deletion. Created (1 month - 5 days) before PUBLIC_RELEASE_DATE.",
    isAnonymous: true,
    // createdAt will be PUBLIC_RELEASE_DATE - (approx 25 days)
  },
  {
    id: '6', groupId: 'tech', userId: MOCK_USER_UID_2, userDisplayName: "Bob TheBuilder", userPhotoURL: "https://picsum.photos/seed/bob/40/40",
    text: "AI is evolving so fast. What are some ethical considerations we should be discussing more openly? @AliceWonderland, your thoughts?",
    isAnonymous: true, 
  },
  {
    id: '8', groupId: 'videos', userId: MOCK_USER_UID_3, userDisplayName: "Charlie Brown", userPhotoURL: "https://picsum.photos/seed/charlie/40/40",
    text: "Check out this incredible drone footage of the Northern Lights! @DianaPrince you'd love this.", videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isAnonymous: false,
  },
  {
    id: '10', groupId: 'gaming', userId: MOCK_USER_UID_1, userDisplayName: "Alice Wonderland", userPhotoURL: "https://picsum.photos/seed/alice/40/40",
    text: "Hilarious gaming moments compilation video I found. @BobTheBuilder, remember that round?", videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    isAnonymous: true,
  },
  {
    id: '13', groupId: 'science', userId: MOCK_USER_UID_1, userDisplayName: "Alice Wonderland", userPhotoURL: "https://picsum.photos/seed/alice/40/40",
    text: "Mind-boggling discovery about black hole thermodynamics published today. Link to the paper: [ArXiv](https://arxiv.org/)", linkUrl: "https://arxiv.org/", linkTitle: "Black Hole Thermodynamics Paper",
    isAnonymous: false,
  },
  {
    id: '2', groupId: 'politics', userId: MOCK_USER_UID_4, userDisplayName: "Diana Prince", userPhotoURL: "https://picsum.photos/seed/diana/40/40",
    text: "The new environmental bill proposal seems promising, but I'm concerned about its economic impact. What are your thoughts? It aims to reduce emissions by 30% by 2030.", imageUrl: 'https://picsum.photos/seed/politics/600/300',
    isAnonymous: false,
  },
  {
    id: '7', groupId: 'books', userId: MOCK_USER_UID_1, userDisplayName: "Alice Wonderland", userPhotoURL: "https://picsum.photos/seed/alice/40/40",
    text: "Just finished reading 'Dune Messiah'. What a sequel! The philosophical undertones are even deeper. Highly recommend for sci-fi fans.", imageUrl: 'https://picsum.photos/seed/books/600/350',
    isAnonymous: true,
  },
   {
    id: '9', groupId: 'music', userId: MOCK_USER_UID_2, userDisplayName: "Bob TheBuilder", userPhotoURL: "https://picsum.photos/seed/bob/40/40",
    text: "This new lofi track is perfect for studying. So chill.", audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg',
    isAnonymous: false,
  },
  {
    id: '3', groupId: 'showerthoughts', userId: MOCK_USER_UID_2, userDisplayName: "Bob TheBuilder", userPhotoURL: "https://picsum.photos/seed/bob/40/40",
    text: "If we can't see air, do fish see water?",
    isAnonymous: true,
  },
  {
    id: '11', groupId: 'photography', userId: MOCK_USER_UID_2, userDisplayName: "Bob TheBuilder", userPhotoURL: "https://picsum.photos/seed/bob/40/40",
    text: "Captured this stunning sunset over the mountains last night. #nofilter", imageUrl: 'https://picsum.photos/seed/sunsetphoto/700/450',
    isAnonymous: false,
  },
  {
    id: '4', groupId: 'gaming', userId: MOCK_USER_UID_1, userDisplayName: "Alice Wonderland", userPhotoURL: "https://picsum.photos/seed/alice/40/40",
    text: "CyberNeon Chronicles just dropped its new DLC. The storyline is epic! And the new zone looks amazing.", imageUrl: 'https://picsum.photos/seed/gaming/600/400',
    isAnonymous: false,
  },
  {
    id: '14', groupId: 'diy', userId: MOCK_USER_UID_3, userDisplayName: "Charlie Brown", userPhotoURL: "https://picsum.photos/seed/charlie/40/40",
    text: "My latest weekend project: a hand-knitted scarf. What do you think?", imageUrl: 'https://picsum.photos/seed/diyscarf/500/500',
    isAnonymous: true,
  },
  {
    id: '15', groupId: 'tech', userId: MOCK_USER_UID_4, userDisplayName: "Diana Prince", userPhotoURL: "https://picsum.photos/seed/diana/40/40",
    text: "Debating switching to a new code editor. VSCode vs Sublime vs Neovim - what are your preferences and why?",
    isAnonymous: false,
  },
  {
    id: '5', groupId: 'foodies', userId: MOCK_USER_UID_1, userDisplayName: "Alice Wonderland", userPhotoURL: "https://picsum.photos/seed/alice/40/40",
    text: "Found this amazing recipe for vegan lasagna. You won't believe it's not dairy! [Link to recipe](https://example.com/vegan-lasagna)", linkUrl: "https://example.com/vegan-lasagna", linkTitle: "Amazing Vegan Lasagna Recipe",
    isAnonymous: false,
  },
  {
    id: '12', groupId: 'travel', userId: MOCK_USER_UID_3, userDisplayName: "Charlie Brown", userPhotoURL: "https://picsum.photos/seed/charlie/40/40",
    text: "Just got back from a backpacking trip through Southeast Asia. AMA!",
    isAnonymous: true,
  },
  { id: '16', groupId: 'memes', text: "This cat meme is gold. 😂", imageUrl: 'https://picsum.photos/seed/catmeme/500/400', userId: MOCK_USER_UID_1, userDisplayName: "Alice Wonderland", isAnonymous: false },
  { id: '17', groupId: 'gardening', text: "My tomatoes are finally ripening! 🍅", imageUrl: 'https://picsum.photos/seed/tomatoes/600/400', userId: MOCK_USER_UID_3, userDisplayName: "Charlie Brown", isAnonymous: true },
  { id: '18', groupId: 'pets', text: "My dog just learned a new trick! So proud. 🐶", videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', userId: MOCK_USER_UID_2, userDisplayName: "Bob TheBuilder", isAnonymous: false },
  { id: '19', groupId: 'finance', text: "What are your top stock picks for this quarter? Looking for some advice. @AliceWonderland any ideas?", linkUrl: 'https://example.com/market-analysis', linkTitle: "Q3 Market Analysis", userId: MOCK_USER_UID_4, userDisplayName: "Diana Prince", isAnonymous: true },
  { id: '20', groupId: 'tech', text: "Working on a new side project with Next.js and Tailwind. Loving the developer experience!", userId: MOCK_USER_UID_2, userDisplayName: "Bob TheBuilder", isAnonymous: false },
];

const MOCK_COMMENTS_INITIAL_DATA: Omit<Comment, 'createdAt' | 'likes' | 'dislikes' | 'replies' | 'pseudonym'>[] = [
  { id: 'c1', postId: '1', userId: MOCK_USER_UID_2, userDisplayName: "Bob TheBuilder", text: "Awesome! I've been waiting for reviews on the X1. How's the battery life with it?", mentions: [], isAnonymous: false },
  { id: 'c2', postId: '1', userId: MOCK_USER_UID_3, userDisplayName: "Charlie Brown", text: "Nice setup, @AliceWonderland! Looks clean.", mentions: ['mock-user-uid-1'], isAnonymous: true },
  { id: 'c3', postId: '6', userId: MOCK_USER_UID_1, userDisplayName: "Alice Wonderland", text: "Great question, @BobTheBuilder! Transparency and bias in algorithms are my main concerns.", mentions: ['mock-user-uid-2'], isAnonymous: false }, // Post 6 is anonymous, comment is not
  { id: 'c4', postId: '2', userId: MOCK_USER_UID_1, userDisplayName: "Alice Wonderland", text: "I agree, the economic impact needs careful consideration. Are there any studies on that yet?", mentions: [], isAnonymous: false },
  { id: 'c5', postId: '3', userId: MOCK_USER_UID_4, userDisplayName: "Diana Prince", text: "Haha, deep thoughts indeed! 🤯", mentions: [], isAnonymous: true }, // Post 3 is anonymous, comment is anonymous
  { id: 'c6', postId: '21', userId: MOCK_USER_UID_2, userDisplayName: "Bob TheBuilder", text: "This comment is on a post that should be deleted.", mentions: [], isAnonymous: false },
  { id: 'c7', postId: '22', userId: MOCK_USER_UID_1, userDisplayName: "Alice Wonderland", text: "This comment is on a post nearing deletion.", mentions: [], isAnonymous: true },
];

const MOCK_COMMENTS: Comment[] = MOCK_COMMENTS_INITIAL_DATA.map((commentData, index) => {
  const post = MOCK_POSTS_INITIAL_DATA.find(p => p.id === commentData.postId);
  
  let postCreationDateToUse: Date;
  if (post?.id === '21') { // Post to be deleted
    postCreationDateToUse = new Date(subtractTime(PUBLIC_RELEASE_DATE, 35, 'days'));
  } else if (post?.id === '22') { // Post nearing deletion
     postCreationDateToUse = new Date(subtractTime(PUBLIC_RELEASE_DATE, DATA_RETENTION_MONTHS * 30 - 5, 'days')); // Approx 25 days before PRD
  } else if (post) {
      postCreationDateToUse = new Date(subtractTime(PUBLIC_RELEASE_DATE, (index % 5) * 5 + 5, 'minutes'));
  }
   else {
    postCreationDateToUse = PUBLIC_RELEASE_DATE;
  }
  
  let date;
  const postTime = new Date(postCreationDateToUse);
  switch (index % 3) {
    case 0: date = subtractTime(postTime, -(5 + (index * 2)), 'minutes'); break; // Add time after post
    case 1: date = subtractTime(postTime, -(10 + (index * 2)), 'minutes'); break; 
    case 2: date = subtractTime(postTime, -(15 + (index * 2)), 'minutes'); break; 
    default: date = subtractTime(postTime, -(5 + (index * 2)), 'minutes');
  }

  return {
    ...commentData,
    pseudonym: commentData.isAnonymous ? generatePseudonym() : (commentData.userDisplayName || "User"),
    createdAt: date,
    likes: Math.floor(Math.random() * 20),
    dislikes: Math.floor(Math.random() * 3),
    replies: [], 
  };
});


export const MOCK_POSTS: Post[] = MOCK_POSTS_INITIAL_DATA.map((postData, index) => {
  let date;
  if (postData.id === '21') { // Post to be deleted
    date = subtractTime(PUBLIC_RELEASE_DATE, 35, 'days'); // Older than 1 month
  } else if (postData.id === '22') { // Post nearing deletion
    const daysToSubtract = DATA_RETENTION_MONTHS * 30 - 5; // Approx 25 days before PUBLIC_RELEASE_DATE
    date = subtractTime(PUBLIC_RELEASE_DATE, daysToSubtract, 'days');
  } else {
     // Regular post dates
    switch (index % 15) { 
      case 0: date = subtractTime(PUBLIC_RELEASE_DATE, 30 + index, 'minutes'); break; 
      case 1: date = subtractTime(PUBLIC_RELEASE_DATE, 45 + index, 'minutes'); break; 
      case 2: date = subtractTime(PUBLIC_RELEASE_DATE, 1 + Math.floor(index/5), 'hours'); break;    
      case 3: date = subtractTime(PUBLIC_RELEASE_DATE, 1.5 + Math.floor(index/5), 'hours'); break;  
      case 4: date = subtractTime(PUBLIC_RELEASE_DATE, 2 + Math.floor(index/5), 'hours'); break;    
      case 5: date = subtractTime(PUBLIC_RELEASE_DATE, 2.5 + Math.floor(index/5), 'hours'); break;  
      case 6: date = subtractTime(PUBLIC_RELEASE_DATE, 3 + Math.floor(index/5), 'hours'); break;    
      case 7: date = subtractTime(PUBLIC_RELEASE_DATE, 4 + Math.floor(index/5), 'hours'); break;    
      case 8: date = subtractTime(PUBLIC_RELEASE_DATE, 5 + Math.floor(index/5), 'hours'); break;    
      case 9: date = subtractTime(PUBLIC_RELEASE_DATE, 6 + Math.floor(index/5), 'hours'); break;    
      case 10: date = subtractTime(PUBLIC_RELEASE_DATE, 8 + Math.floor(index/5), 'hours'); break;   
      case 11: date = subtractTime(PUBLIC_RELEASE_DATE, 10 + Math.floor(index/5), 'hours'); break;  
      case 12: date = subtractTime(PUBLIC_RELEASE_DATE, 1 + Math.floor(index/10), 'days'); break;    
      case 13: { let d = subtractTime(PUBLIC_RELEASE_DATE, 1 + Math.floor(index/10), 'days'); date = subtractTime(new Date(d), 2, 'hours'); break; }
      case 14: date = subtractTime(PUBLIC_RELEASE_DATE, 2 + Math.floor(index/10), 'days'); break;   
      default: date = PUBLIC_RELEASE_DATE.toISOString();
    }
  }
  
  const likes = Math.floor(Math.random() * 150) + 5;
  const dislikes = Math.floor(Math.random() * (likes / 5));
  const postComments = MOCK_COMMENTS.filter(c => c.postId === postData.id);
  
  const groupForPost = MOCK_GROUPS_INITIAL_DEFINITION.find(g => g.id === postData.groupId);

  return {
    ...postData,
    pseudonym: postData.isAnonymous ? generatePseudonym() : (postData.userDisplayName || "User"),
    createdAt: date,
    likes: likes,
    dislikes: dislikes,
    commentsCount: postComments.length,
    comments: postComments.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()), 
    groupName: groupForPost?.name || 'Unknown Group',
  };
}).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


const groupPostCounts: Record<string, number> = {};
MOCK_POSTS.forEach(post => {
  // Only count non-deleted posts for group counts
  const expiryDate = addMonths(new Date(post.createdAt), DATA_RETENTION_MONTHS);
  if (isBefore(PUBLIC_RELEASE_DATE, expiryDate)) {
    groupPostCounts[post.groupId] = (groupPostCounts[post.groupId] || 0) + 1;
  }
});

const groupMemberIds: Record<string, Set<string>> = {};
MOCK_POSTS.forEach(post => {
  const expiryDate = addMonths(new Date(post.createdAt), DATA_RETENTION_MONTHS);
  if (isBefore(PUBLIC_RELEASE_DATE, expiryDate)) { // Only consider members from non-deleted posts
    if (!groupMemberIds[post.groupId]) {
      groupMemberIds[post.groupId] = new Set();
    }
    if(post.userId) groupMemberIds[post.groupId].add(post.userId);
  }
});
MOCK_GROUPS_INITIAL_DEFINITION.forEach(groupDef => {
    if(groupDef.creatorId && groupDef.creatorId !== 'system') {
        if (!groupMemberIds[groupDef.id]) {
            groupMemberIds[groupDef.id] = new Set();
        }
        groupMemberIds[groupDef.id].add(groupDef.creatorId);
    }
});


export const MOCK_GROUPS: Group[] = MOCK_GROUPS_INITIAL_DEFINITION.map(groupDef => {
  const postCount = groupPostCounts[groupDef.id] || 0;
  const memberCount = groupMemberIds[groupDef.id] ? groupMemberIds[groupDef.id].size : 0;
  return {
    ...groupDef,
    postCount: postCount,
    memberCount: Math.max(1, memberCount + Math.floor(Math.random() * (postCount > 0 ? 5 : 1))), 
  };
}).sort((a,b) => a.name.localeCompare(b.name));


export const MOCK_ACTIVITY_FEED: ActivityItem[] = [
  // ... (existing activities, ensure their timestamps are consistent with post creation dates)
  {
    id: 'act1', userId: MOCK_USER_UID_1, type: 'USER_CREATED_POST',
    timestamp: MOCK_POSTS.find(p => p.id === '1')?.createdAt || PUBLIC_RELEASE_DATE.toISOString(),
    isRead: false, data: { type: 'USER_CREATED_POST', postId: '1', postSnippet: MOCK_POSTS.find(p=>p.id==='1')?.text?.substring(0,50) + '...' || "A post", groupId: 'tech', groupName: MOCK_GROUPS.find(g=>g.id==='tech')?.name, isAnonymousPost: MOCK_POSTS.find(p=>p.id==='1')?.isAnonymous, postPseudonym: MOCK_POSTS.find(p=>p.id==='1')?.pseudonym } as UserCreatedPostData,
  },
  {
    id: 'act2', userId: MOCK_USER_UID_1, type: 'OTHERS_LIKED_USER_POST',
    timestamp: subtractTime(new Date(MOCK_POSTS.find(p => p.id === '1')?.createdAt || PUBLIC_RELEASE_DATE), -5, 'minutes'), isRead: true,
    data: { type: 'OTHERS_LIKED_USER_POST', postId: '1', postSnippet: MOCK_POSTS.find(p=>p.id==='1')?.text?.substring(0,50) + '...' || "A post", groupId: 'tech', groupName: MOCK_GROUPS.find(g=>g.id==='tech')?.name, actorDisplayName: 'Bob TheBuilder', actorPhotoURL: ALL_MOCK_USERS.find(u=>u.userId===MOCK_USER_UID_2)?.photoURL, actorUserId: MOCK_USER_UID_2, isUserAnonymousPost: MOCK_POSTS.find(p=>p.id==='1')?.isAnonymous, postPseudonym: MOCK_POSTS.find(p=>p.id==='1')?.pseudonym } as OthersLikedUserPostData,
  },
  {
    id: 'act3', userId: MOCK_USER_UID_1, type: 'USER_CREATED_GROUP',
    timestamp: subtractTime(PUBLIC_RELEASE_DATE, 1, 'days'), isRead: false,
    data: { type: 'USER_CREATED_GROUP', groupId: 'foodies', groupName: MOCK_GROUPS.find(g=>g.id==='foodies')?.name || "Foodies" } as UserCreatedGroupData,
  },
  {
    id: 'act4', userId: MOCK_USER_UID_1, type: 'USER_POST_FLAGGED',
    timestamp: subtractTime(new Date(MOCK_POSTS.find(p => p.id === '4')?.createdAt || PUBLIC_RELEASE_DATE), -10, 'minutes'), isRead: false,
    data: { type: 'USER_POST_FLAGGED', postId: '4', postSnippet: MOCK_POSTS.find(p=>p.id==='4')?.text?.substring(0,50) + '...' || "A post", groupId: 'gaming', groupName: MOCK_GROUPS.find(g=>g.id==='gaming')?.name, flagReason: 'Potentially controversial content.', isUserAnonymousPost: MOCK_POSTS.find(p=>p.id==='4')?.isAnonymous, postPseudonym: MOCK_POSTS.find(p=>p.id==='4')?.pseudonym } as UserPostFlaggedData,
  },
  {
    id: 'act5', userId: MOCK_USER_UID_1, type: 'OTHERS_COMMENTED_ON_USER_POST',
    timestamp: subtractTime(new Date(MOCK_POSTS.find(p => p.id === '1')?.createdAt || PUBLIC_RELEASE_DATE), -15, 'minutes'), isRead: true,
    data: { type: 'OTHERS_COMMENTED_ON_USER_POST', postId: '1', postSnippet: MOCK_POSTS.find(p=>p.id==='1')?.text?.substring(0,50) + '...' || "A post", groupId: 'tech', groupName: MOCK_GROUPS.find(g=>g.id==='tech')?.name, commentId: 'c1', commentSnippet: MOCK_COMMENTS.find(c=>c.id==='c1')?.text.substring(0,30) + '...' || "A comment", actorDisplayName: 'Bob TheBuilder', actorPhotoURL: ALL_MOCK_USERS.find(u=>u.userId===MOCK_USER_UID_2)?.photoURL, actorUserId: MOCK_USER_UID_2, isUserAnonymousPost: MOCK_POSTS.find(p=>p.id==='1')?.isAnonymous, postPseudonym: MOCK_POSTS.find(p=>p.id==='1')?.pseudonym } as OthersCommentedOnUserPostData,
  },
  {
    id: 'act6', userId: MOCK_USER_UID_2, type: 'USER_CREATED_POST',
    timestamp: MOCK_POSTS.find(p => p.id === '3')?.createdAt || PUBLIC_RELEASE_DATE.toISOString(), isRead: false,
    data: { type: 'USER_CREATED_POST', postId: '3', postSnippet: MOCK_POSTS.find(p=>p.id==='3')?.text?.substring(0,50) + '...' || "A post", groupId: 'showerthoughts', groupName: MOCK_GROUPS.find(g=>g.id==='showerthoughts')?.name, isAnonymousPost: MOCK_POSTS.find(p=>p.id==='3')?.isAnonymous, postPseudonym: MOCK_POSTS.find(p=>p.id==='3')?.pseudonym } as UserCreatedPostData,
  },
  {
    id: 'act7', userId: MOCK_USER_UID_2, type: 'OTHERS_LIKED_USER_POST',
    timestamp: subtractTime(new Date(MOCK_POSTS.find(p => p.id === '3')?.createdAt || PUBLIC_RELEASE_DATE), -5, 'minutes'), isRead: false,
    data: { type: 'OTHERS_LIKED_USER_POST', postId: '3', postSnippet: MOCK_POSTS.find(p=>p.id==='3')?.text?.substring(0,50) + '...' || "A post", groupId: 'showerthoughts', groupName: MOCK_GROUPS.find(g=>g.id==='showerthoughts')?.name, actorDisplayName: 'Alice Wonderland', actorPhotoURL: ALL_MOCK_USERS.find(u=>u.userId===MOCK_USER_UID_1)?.photoURL, actorUserId: MOCK_USER_UID_1, isUserAnonymousPost: MOCK_POSTS.find(p=>p.id==='3')?.isAnonymous, postPseudonym: MOCK_POSTS.find(p=>p.id==='3')?.pseudonym } as OthersLikedUserPostData,
  },
  {
    id: 'act8', userId: MOCK_USER_UID_1, type: 'USER_MENTIONED_IN_COMMENT',
    timestamp: subtractTime(new Date(MOCK_COMMENTS.find(c=>c.id==='c2')?.createdAt || PUBLIC_RELEASE_DATE), -2, 'minutes'), isRead: false,
    data: { type: 'USER_MENTIONED_IN_COMMENT', postId: '1', postSnippet: MOCK_POSTS.find(p=>p.id==='1')?.text?.substring(0,50) + '...' || "A post", groupId: 'tech', groupName: MOCK_GROUPS.find(g=>g.id==='tech')?.name, commentId: 'c2', commentSnippet: MOCK_COMMENTS.find(c=>c.id==='c2')?.text.substring(0,30) + '...' || "A comment", actorDisplayName: 'Charlie Brown', actorPhotoURL: ALL_MOCK_USERS.find(u=>u.userId===MOCK_USER_UID_3)?.photoURL, actorUserId: MOCK_USER_UID_3 } as UserMentionedInCommentData,
  }
].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


// Mock Chat Data
const MOCK_CHAT_SESSIONS: ChatSession[] = [
    {
        id: 'chat1-2',
        participantIds: [MOCK_USER_UID_1, MOCK_USER_UID_2],
        participantPseudonyms: {
            [MOCK_USER_UID_1]: generatePseudonym(),
            [MOCK_USER_UID_2]: generatePseudonym(),
        },
        lastMessageId: 'msg2',
        lastMessageText: 'Sure, let me check that out!',
        lastMessageTimestamp: subtractTime(PUBLIC_RELEASE_DATE, 10, 'minutes'),
    },
    { // Chat session with a message that should be deleted
        id: 'chat-old-msg',
        participantIds: [MOCK_USER_UID_1, MOCK_USER_UID_3],
        participantPseudonyms: {
            [MOCK_USER_UID_1]: generatePseudonym(),
            [MOCK_USER_UID_3]: generatePseudonym(),
        },
        lastMessageId: 'msg-old-2',
        lastMessageText: 'This is the most recent message in an old chat.',
        // This timestamp makes the last message NOT old, but msg-old-1 is.
        lastMessageTimestamp: subtractTime(PUBLIC_RELEASE_DATE, 5, 'minutes'),
    }
];

const MOCK_MESSAGES: Message[] = [
    {
        id: 'msg1', chatSessionId: 'chat1-2', senderId: MOCK_USER_UID_1,
        senderPseudonym: MOCK_CHAT_SESSIONS[0].participantPseudonyms[MOCK_USER_UID_1],
        text: 'Hey Bob, did you see my post about the Quantum Processor X1?',
        createdAt: subtractTime(PUBLIC_RELEASE_DATE, 12, 'minutes'),
        postIdContext: '1',
    },
    {
        id: 'msg2', chatSessionId: 'chat1-2', senderId: MOCK_USER_UID_2,
        senderPseudonym: MOCK_CHAT_SESSIONS[0].participantPseudonyms[MOCK_USER_UID_2],
        text: 'Sure, let me check that out!',
        createdAt: subtractTime(PUBLIC_RELEASE_DATE, 10, 'minutes'),
    },
    { // This message should be "deleted"
        id: 'msg-old-1', chatSessionId: 'chat-old-msg', senderId: MOCK_USER_UID_1,
        senderPseudonym: MOCK_CHAT_SESSIONS[1].participantPseudonyms[MOCK_USER_UID_1],
        text: 'This is an old message, created 40 days before PUBLIC_RELEASE_DATE.',
        createdAt: subtractTime(PUBLIC_RELEASE_DATE, 40, 'days'),
    },
    { // This message is newer and should be visible
        id: 'msg-old-2', chatSessionId: 'chat-old-msg', senderId: MOCK_USER_UID_3,
        senderPseudonym: MOCK_CHAT_SESSIONS[1].participantPseudonyms[MOCK_USER_UID_3],
        text: 'This is the most recent message in an old chat.',
        createdAt: subtractTime(PUBLIC_RELEASE_DATE, 5, 'minutes'),
    },
    { // This message should be "nearing deletion"
        id: 'msg-nearing-deletion', chatSessionId: 'chat1-2', senderId: MOCK_USER_UID_1,
        senderPseudonym: MOCK_CHAT_SESSIONS[0].participantPseudonyms[MOCK_USER_UID_1],
        text: 'This message will be deleted soon. Created (1 month - 3 days) before PUBLIC_RELEASE_DATE.',
        createdAt: subtractTime(PUBLIC_RELEASE_DATE, (DATA_RETENTION_MONTHS * 30 - 3) , 'days'),
    }
];

interface PostsState {
  posts: Post[];
  groups: Group[];
  activityFeed: ActivityItem[];
  chatSessions: ChatSession[];
  messages: Message[];
  usersForMentions: { id: string, displayName: string, photoURL?: string }[]; 
  notifiedDeletionItems: Set<string>; // To track sent deletion warnings (itemId)

  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'dislikes' | 'commentsCount' | 'comments' | 'pseudonym'> & { isAnonymous?: boolean }) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'dislikes' | 'replies' | 'pseudonym'>) => void;
  getPostsByGroupId: (groupId: string) => Post[];
  getAllPosts: () => Post[];
  getGroupById: (groupId: string) => Group | undefined;
  updatePostReactions: (postId: string, newLikes: number, newDislikes: number, actingUserId?: string) => void;
  updateCommentReactions: (postId: string, commentId: string, newLikes: number, newDislikes: number, actingUserId?: string) => void;
  addGroup: (group: Group) => void;
  
  addActivityItem: (itemDetails: { userId: string; type: ActivityType; data: ActivityItemData; timestamp?: string }) => void;
  getUserActivities: (userId: string) => ActivityItem[];
  markActivityAsRead: (userId: string, activityId: string) => void;
  markAllActivitiesAsRead: (userId: string) => void;
  checkAndNotifyForUpcomingDeletions: (userId: string) => void;

  getChatSessionById: (sessionId: string) => ChatSession | undefined;
  getChatSessionsForUser: (userId: string) => ChatSession[];
  getMessagesForChatSession: (sessionId: string) => Message[];
  sendMessage: (sessionId: string, senderId: string, text: string, postIdContext?: string) => void;
  startOrGetChatSession: (userId1: string, userId2: string) => ChatSession;

  getUserById: (userId: string) => { id: string, displayName: string, photoURL?: string } | undefined;
}

const isItemExpired = (createdAt: string): boolean => {
  const expiryDate = addMonths(new Date(createdAt), DATA_RETENTION_MONTHS);
  return isAfter(PUBLIC_RELEASE_DATE, expiryDate);
};

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: MOCK_POSTS, 
  groups: MOCK_GROUPS,
  activityFeed: MOCK_ACTIVITY_FEED,
  chatSessions: MOCK_CHAT_SESSIONS,
  messages: MOCK_MESSAGES,
  usersForMentions: ALL_MOCK_USERS.map(u => ({id: u.userId, displayName: u.displayName, photoURL: u.photoURL })).filter(u => u.id !== 'system'),
  notifiedDeletionItems: new Set<string>(),

  addPost: (postData) => {
    const newPost: Post = {
      id: crypto.randomUUID(),
      ...postData,
      pseudonym: postData.isAnonymous ? generatePseudonym() : (postData.userDisplayName || "User"),
      createdAt: new Date().toISOString(), // Posts are created "now" relative to user interaction
      likes: 0,
      dislikes: 0,
      comments: [],
      commentsCount: 0,
    };
    set((state) => {
      const updatedGroups = state.groups.map(group => {
        if (group.id === newPost.groupId) {
          return { ...group, postCount: (group.postCount || 0) + 1, memberCount: group.memberCount ? group.memberCount + (newPost.userId && !state.posts.some(p => p.groupId === group.id && p.userId === newPost.userId) ? 1 : 0) : 1 };
        }
        return group;
      });
      return { 
        posts: [newPost, ...state.posts].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        groups: updatedGroups.sort((a,b) => a.name.localeCompare(b.name))
      };
    });
    if (newPost.userId) {
        get().addActivityItem({
            userId: newPost.userId,
            type: 'USER_CREATED_POST',
            data: {
                type: 'USER_CREATED_POST',
                postId: newPost.id,
                postSnippet: (newPost.text || "Media post").substring(0, 50) + '...',
                groupId: newPost.groupId,
                groupName: newPost.groupName || newPost.groupId,
                isAnonymousPost: newPost.isAnonymous,
                postPseudonym: newPost.isAnonymous ? newPost.pseudonym : undefined,
            }
        });
    }
  },
  addComment: (postId, commentData) => {
    const newComment: Comment = {
        ...commentData,
        id: crypto.randomUUID(),
        pseudonym: commentData.isAnonymous ? generatePseudonym() : (commentData.userDisplayName || "User"),
        createdAt: new Date().toISOString(), // Comments are created "now"
        likes: 0,
        dislikes: 0,
        replies: [],
    };
    set(state => ({
        posts: state.posts.map(post => {
            if (post.id === postId) {
                 // Filter out expired comments before adding new one
                const validComments = (post.comments || []).filter(c => !isItemExpired(c.createdAt));
                const updatedComments = [...validComments, newComment].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                return { ...post, comments: updatedComments, commentsCount: updatedComments.length };
            }
            return post;
        }).map(post => ({ // Recalculate comments for all posts to ensure old ones are filtered
            ...post,
            comments: (post.comments || []).filter(c => !isItemExpired(c.createdAt)),
            commentsCount: (post.comments || []).filter(c => !isItemExpired(c.createdAt)).length,
        }))
    }));

    const post = get().posts.find(p => p.id === postId);
    if(post && post.userId && post.userId !== commentData.userId) { 
        get().addActivityItem({
            userId: post.userId,
            type: 'OTHERS_COMMENTED_ON_USER_POST',
            data: {
                type: 'OTHERS_COMMENTED_ON_USER_POST',
                postId: postId,
                postSnippet: post.text?.substring(0, 50) + (post.text && post.text.length > 50 ? '...' : ''),
                groupId: post.groupId,
                groupName: post.groupName,
                commentId: newComment.id,
                commentSnippet: newComment.text.substring(0, 30) + (newComment.text.length > 30 ? '...' : ''),
                actorUserId: commentData.userId,
                actorDisplayName: commentData.userDisplayName,
                actorPhotoURL: commentData.userPhotoURL,
                isUserAnonymousPost: post.isAnonymous, 
                postPseudonym: post.isAnonymous ? post.pseudonym : undefined,
            } as OthersCommentedOnUserPostData,
        });
    }
    
    const mentionedUsernames = (newComment.text.match(/@(\w+)/g) || []).map(m => m.substring(1));
    mentionedUsernames.forEach(username => {
        const mentionedUser = get().usersForMentions.find(u => u.displayName.replace(/\s+/g, '') === username);
        if (mentionedUser && mentionedUser.id !== commentData.userId) { 
            get().addActivityItem({
                userId: mentionedUser.id,
                type: 'USER_MENTIONED_IN_COMMENT',
                data: {
                    type: 'USER_MENTIONED_IN_COMMENT',
                    postId: postId,
                    postSnippet: post?.text?.substring(0, 50) + (post?.text && post.text.length > 50 ? '...' : ''),
                    groupId: post?.groupId,
                    groupName: post?.groupName,
                    commentId: newComment.id,
                    commentSnippet: newComment.text.substring(0, 30) + (newComment.text.length > 30 ? '...' : ''),
                    actorUserId: commentData.userId,
                    actorDisplayName: commentData.userDisplayName,
                    actorPhotoURL: commentData.userPhotoURL,
                } as UserMentionedInCommentData,
            });
        }
    });
  },
  getPostsByGroupId: (groupId) => get().posts.filter(post => post.groupId === groupId && !isItemExpired(post.createdAt)).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  getAllPosts: () => get().posts.filter(post => !isItemExpired(post.createdAt)).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  getGroupById: (groupId: string) => get().groups.find(group => group.id === groupId),
  
  updatePostReactions: (postId: string, newLikes: number, newDislikes: number, actingUserId?: string) => {
    const post = get().posts.find(p => p.id === postId);
    if (!post || isItemExpired(post.createdAt)) return;

    set((state) => ({
      posts: state.posts.map(p =>
        p.id === postId ? { ...p, likes: newLikes, dislikes: newDislikes } : p
      ),
    }));

    if (actingUserId && post.userId && actingUserId !== post.userId) {
      const actor = get().usersForMentions.find(u => u.id === actingUserId);
      const liked = newLikes > post.likes;

      if (liked) { 
        get().addActivityItem({
          userId: post.userId, type: 'OTHERS_LIKED_USER_POST',
          data: {
            type: 'OTHERS_LIKED_USER_POST', postId: post.id,
            postSnippet: post.text?.substring(0, 50) + (post.text && post.text.length > 50 ? '...' : ''),
            groupId: post.groupId, groupName: post.groupName,
            actorUserId: actingUserId, actorDisplayName: actor?.displayName || generatePseudonym(),
            actorPhotoURL: actor?.photoURL,
            isUserAnonymousPost: post.isAnonymous, 
            postPseudonym: post.isAnonymous ? post.pseudonym : undefined,
          } as OthersLikedUserPostData,
        });
      }
    }
  },
  updateCommentReactions: (postId: string, commentId: string, newLikes: number, newDislikes: number, actingUserId?: string) => {
    const post = get().posts.find(p => p.id === postId);
    if (!post || isItemExpired(post.createdAt)) return;

    const comment = post.comments?.find(c => c.id === commentId);
    if (!comment || isItemExpired(comment.createdAt)) return;


    set(state => ({
        posts: state.posts.map(p => {
            if (p.id === postId && p.comments) {
                return {
                    ...p,
                    comments: p.comments.map(c => 
                        c.id === commentId ? { ...c, likes: newLikes, dislikes: newDislikes } : c
                    ).filter(c => !isItemExpired(c.createdAt)) // Ensure we only keep non-expired comments
                };
            }
            return p;
        })
    }));
  },

  addGroup: (group) => {
    const newGroupWithDefaults = {
      ...group, id: group.id || crypto.randomUUID(), 
      postCount: group.postCount || 0, memberCount: group.memberCount || 1, 
    };
    set((state) => ({
      groups: [newGroupWithDefaults, ...state.groups].sort((a,b) => a.name.localeCompare(b.name)),
    }));
     if (group.creatorId && group.creatorId !== 'system') {
      get().addActivityItem({
        userId: group.creatorId, type: 'USER_CREATED_GROUP',
        data: { type: 'USER_CREATED_GROUP', groupId: newGroupWithDefaults.id, groupName: newGroupWithDefaults.name } as UserCreatedGroupData,
      });
    }
  },

  addActivityItem: (itemDetails) => {
    const newActivity: ActivityItem = {
      id: crypto.randomUUID(), userId: itemDetails.userId, type: itemDetails.type,
      timestamp: itemDetails.timestamp || new Date().toISOString(), isRead: false, data: itemDetails.data,
    };
    set((state) => ({
      activityFeed: [newActivity, ...state.activityFeed].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    }));
  },
  getUserActivities: (userId: string) => get().activityFeed.filter(activity => activity.userId === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  markActivityAsRead: (userId: string, activityId: string) => set((state) => ({ activityFeed: state.activityFeed.map(activity => activity.id === activityId && activity.userId === userId ? { ...activity, isRead: true } : activity ) })),
  markAllActivitiesAsRead: (userId: string) => set((state) => ({ activityFeed: state.activityFeed.map(activity => activity.userId === userId ? { ...activity, isRead: true } : activity ) })),

  getChatSessionById: (sessionId: string) => get().chatSessions.find(cs => cs.id === sessionId),
  getChatSessionsForUser: (userId: string) => {
    return get().chatSessions.filter(cs => {
        const lastMsg = cs.lastMessageId ? get().messages.find(m => m.id === cs.lastMessageId) : null;
        if (lastMsg && isItemExpired(lastMsg.createdAt)) {
            // If last message is expired, we might consider the session "inactive" or hide it
            // For now, let's filter out sessions where the *last message itself* is expired
             // But a session might have newer messages. Let's refine: A session is active if it has ANY non-expired messages.
            const sessionMessages = get().messages.filter(m => m.chatSessionId === cs.id && !isItemExpired(m.createdAt));
            if(sessionMessages.length === 0) return false; // No valid messages left
        }
        return cs.participantIds.includes(userId);
    }).sort((a,b) => {
        const aTimestamp = a.lastMessageTimestamp ? new Date(a.lastMessageTimestamp).getTime() : 0;
        const bTimestamp = b.lastMessageTimestamp ? new Date(b.lastMessageTimestamp).getTime() : 0;
        return bTimestamp - aTimestamp;
    });
  },
  getMessagesForChatSession: (sessionId: string) => get().messages.filter(msg => msg.chatSessionId === sessionId && !isItemExpired(msg.createdAt)).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  
  sendMessage: (chatSessionId, senderId, text, postIdContext) => {
    const chatSession = get().chatSessions.find(cs => cs.id === chatSessionId);
    if (!chatSession) return;

    const senderPseudonym = chatSession.participantPseudonyms[senderId] || generatePseudonym();
    const newMessage: Message = {
      id: crypto.randomUUID(), chatSessionId, senderId, senderPseudonym, text,
      createdAt: new Date().toISOString(), // Messages are created "now"
      postIdContext,
    };
    set(state => ({
      messages: [...state.messages, newMessage],
      chatSessions: state.chatSessions.map(cs => 
        cs.id === chatSessionId 
        ? { ...cs, lastMessageId: newMessage.id, lastMessageText: newMessage.text, lastMessageTimestamp: newMessage.createdAt } 
        : cs
      ),
    }));
  },
  startOrGetChatSession: (userId1: string, userId2: string) => {
    const existingSession = get().chatSessions.find(cs => 
        cs.participantIds.includes(userId1) && cs.participantIds.includes(userId2)
    );
    if (existingSession) return existingSession;

    const newSessionId = crypto.randomUUID();
    const user1Data = get().usersForMentions.find(u => u.id === userId1);
    const user2Data = get().usersForMentions.find(u => u.id === userId2);

    const newSession: ChatSession = {
        id: newSessionId,
        participantIds: [userId1, userId2],
        participantPseudonyms: {
            [userId1]: user1Data?.displayName || generatePseudonym(),
            [userId2]: user2Data?.displayName || generatePseudonym(),
        },
        lastMessageTimestamp: new Date().toISOString(),
    };
    set(state => ({
        chatSessions: [...state.chatSessions, newSession],
    }));
    return newSession;
  },
  getUserById: (userId: string) => get().usersForMentions.find(u => u.id === userId),

  checkAndNotifyForUpcomingDeletions: (userId: string) => {
    const userPosts = get().posts.filter(p => p.userId === userId);
    const userMessages = get().messages.filter(m => m.senderId === userId);
    const notifiedItems = get().notifiedDeletionItems;

    userPosts.forEach(post => {
      if (notifiedItems.has(post.id)) return; // Already notified

      const expiryDate = addMonths(new Date(post.createdAt), DATA_RETENTION_MONTHS);
      const daysUntilDeletion = differenceInDays(expiryDate, PUBLIC_RELEASE_DATE);

      if (daysUntilDeletion <= DELETION_WARNING_DAYS && daysUntilDeletion >= 0) {
        get().addActivityItem({
          userId: userId,
          type: 'POST_NEARING_DELETION',
          // Timestamp notification slightly before PUBLIC_RELEASE_DATE for realism if needed
          timestamp: subtractTime(PUBLIC_RELEASE_DATE, DELETION_WARNING_DAYS - daysUntilDeletion, 'days'),
          data: {
            type: 'POST_NEARING_DELETION',
            postId: post.id,
            postSnippet: (post.text || "Media post").substring(0, 50) + '...',
            deletionDate: expiryDate.toISOString(),
            groupName: post.groupName || 'Unknown Group',
            groupId: post.groupId,
          } as PostNearingDeletionData,
        });
        set(state => ({ notifiedDeletionItems: new Set(state.notifiedDeletionItems).add(post.id) }));
      }
    });

    userMessages.forEach(message => {
      if (notifiedItems.has(message.id)) return;

      const expiryDate = addMonths(new Date(message.createdAt), DATA_RETENTION_MONTHS);
      const daysUntilDeletion = differenceInDays(expiryDate, PUBLIC_RELEASE_DATE);

      if (daysUntilDeletion <= DELETION_WARNING_DAYS && daysUntilDeletion >= 0) {
        const chatSession = get().chatSessions.find(cs => cs.id === message.chatSessionId);
        const otherParticipantId = chatSession?.participantIds.find(id => id !== userId);
        const otherParticipant = otherParticipantId ? get().usersForMentions.find(u => u.id === otherParticipantId) : undefined;

        get().addActivityItem({
          userId: userId,
          type: 'MESSAGE_NEARING_DELETION',
          timestamp: subtractTime(PUBLIC_RELEASE_DATE, DELETION_WARNING_DAYS - daysUntilDeletion, 'days'),
          data: {
            type: 'MESSAGE_NEARING_DELETION',
            messageId: message.id,
            messageSnippet: message.text.substring(0, 50) + '...',
            chatSessionId: message.chatSessionId,
            otherParticipantDisplayName: otherParticipant?.displayName || chatSession?.participantPseudonyms[otherParticipantId || ''] || 'User',
            deletionDate: expiryDate.toISOString(),
          } as MessageNearingDeletionData,
        });
        set(state => ({ notifiedDeletionItems: new Set(state.notifiedDeletionItems).add(message.id) }));
      }
    });
  }
}));

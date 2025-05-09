import { create } from 'zustand';
import type { Post, Group } from '@/lib/types';
import { generatePseudonym } from '@/lib/pseudonyms';

export const MOCK_GROUPS: Group[] = [
  { id: 'tech', name: 'Technology Talk', description: 'Discussions about the latest in tech, gadgets, and software.', postCount: 152, memberCount: 2300, themeColor: 'bg-blue-500' },
  { id: 'politics', name: 'Political Arena', description: 'Debates and news regarding global and local politics.', postCount: 489, memberCount: 5100, themeColor: 'bg-red-500' },
  { id: 'gaming', name: 'Game Central', description: 'Everything about video games, from retro to modern.', postCount: 765, memberCount: 8800, themeColor: 'bg-purple-500' },
  { id: 'showerthoughts', name: 'Shower Thoughts', description: 'Those profound or silly thoughts you have in the shower.', postCount: 1023, memberCount: 12000, themeColor: 'bg-yellow-500' },
  { id: 'foodies', name: 'Food Lovers', description: 'Share recipes, restaurant reviews, and culinary adventures.', postCount: 340, memberCount: 4500, themeColor: 'bg-green-500' },
  { id: 'books', name: 'Bookworms Corner', description: 'Discuss your favorite books, authors, and genres.', postCount: 210, memberCount: 3200, themeColor: 'bg-indigo-500' },
  { id: 'music', name: 'Music Hub', description: 'Share and discover new music, artists, and genres.', postCount: 180, memberCount: 2800, themeColor: 'bg-pink-500' },
  { id: 'videos', name: 'Video Vibes', description: 'Interesting videos, short films, and discussions.', postCount: 95, memberCount: 1500, themeColor: 'bg-teal-500' },
];

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    groupId: 'tech',
    groupName: 'Technology Talk',
    pseudonym: generatePseudonym(),
    text: "Just upgraded to the latest **Quantum Processor X1**! Performance is mind-blowing. Anyone else tried it? It's supposed to be 50% faster in multi-core tasks. Check out the [official benchmarks](https://example.com/benchmarks).",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    likes: 15,
    dislikes: 1,
    commentsCount: 5,
  },
  {
    id: '2',
    groupId: 'politics',
    groupName: 'Political Arena',
    pseudonym: generatePseudonym(),
    text: "The new environmental bill proposal seems promising, but I'm concerned about its economic impact. What are your thoughts? It aims to reduce emissions by 30% by 2030.",
    imageUrl: 'https://picsum.photos/seed/politics/600/300',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    likes: 45,
    dislikes: 12,
    commentsCount: 22,
  },
  {
    id: '3',
    groupId: 'showerthoughts',
    groupName: 'Shower Thoughts',
    pseudonym: generatePseudonym(),
    text: "If we can't see air, do fish see water?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    likes: 102,
    dislikes: 3,
    commentsCount: 15,
  },
    {
    id: '4',
    groupId: 'gaming',
    groupName: 'Game Central',
    pseudonym: generatePseudonym(),
    text: "CyberNeon Chronicles just dropped its new DLC. The storyline is epic! And the new zone looks amazing.",
    imageUrl: 'https://picsum.photos/seed/gaming/600/400',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    likes: 78,
    dislikes: 5,
    commentsCount: 30,
  },
  {
    id: '5',
    groupId: 'foodies',
    groupName: 'Food Lovers',
    pseudonym: generatePseudonym(),
    text: "Found this amazing recipe for vegan lasagna. You won't believe it's not dairy! [Link to recipe](https://example.com/vegan-lasagna)",
    linkUrl: "https://example.com/vegan-lasagna",
    linkTitle: "Amazing Vegan Lasagna Recipe",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    likes: 62,
    dislikes: 2,
    commentsCount: 18,
  },
   {
    id: '6',
    groupId: 'tech',
    groupName: 'Technology Talk',
    pseudonym: generatePseudonym(),
    text: "AI is evolving so fast. What are some ethical considerations we should be discussing more openly?",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    likes: 33,
    dislikes: 0,
    commentsCount: 12,
  },
  {
    id: '7',
    groupId: 'books',
    groupName: 'Bookworms Corner',
    pseudonym: generatePseudonym(),
    text: "Just finished reading 'Dune Messiah'. What a sequel! The philosophical undertones are even deeper than the first book. Highly recommend for sci-fi fans who love complex narratives.",
    imageUrl: 'https://picsum.photos/seed/books/600/350',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    likes: 50,
    dislikes: 1,
    commentsCount: 9,
  },
  {
    id: '8',
    groupId: 'videos',
    groupName: 'Video Vibes',
    pseudonym: generatePseudonym(),
    text: "Check out this incredible drone footage of the Northern Lights!",
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', // Example public MP4 video
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
    likes: 88,
    dislikes: 2,
    commentsCount: 14,
  },
  {
    id: '9',
    groupId: 'music',
    groupName: 'Music Hub',
    pseudonym: generatePseudonym(),
    text: "This new lofi track is perfect for studying. So chill.",
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg', // Example public OGG audio
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    likes: 55,
    dislikes: 0,
    commentsCount: 7,
  },
  {
    id: '10',
    groupId: 'gaming',
    groupName: 'Game Central',
    pseudonym: generatePseudonym(),
    text: "Hilarious gaming moments compilation video I found.",
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Another example video
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 90 mins ago
    likes: 67,
    dislikes: 3,
    commentsCount: 11,
  },
];

interface PostsState {
  posts: Post[];
  groups: Group[];
  addPost: (post: Post) => void;
  getPostsByGroupId: (groupId: string) => Post[];
  getAllPosts: () => Post[];
  getGroupById: (groupId: string) => Group | undefined;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: MOCK_POSTS,
  groups: MOCK_GROUPS,
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) })),
  getPostsByGroupId: (groupId) => get().posts.filter(post => post.groupId === groupId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  getAllPosts: () => get().posts.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  getGroupById: (groupId: string) => get().groups.find(group => group.id === groupId),
}));


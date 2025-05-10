
import { create } from 'zustand';

interface UiState {
  isCreatePostDialogOpen: boolean;
  defaultGroupIdForPostDialog?: string;
  openCreatePostDialog: (defaultGroupId?: string) => void;
  closeCreatePostDialog: () => void;

  isCreateGroupDialogOpen: boolean;
  openCreateGroupDialog: () => void;
  closeCreateGroupDialog: () => void;

  isChatModalOpen: boolean;
  chatTargetUserId?: string;
  chatTargetUserDisplayName?: string; // Or pseudonym if preferred for chat context
  chatPostIdContext?: string; // Optional context for the chat
  openChatModal: (targetUserId: string, targetUserDisplayName: string, postIdContext?: string) => void;
  closeChatModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isCreatePostDialogOpen: false,
  defaultGroupIdForPostDialog: undefined,
  openCreatePostDialog: (defaultGroupId?: string) =>
    set({
      isCreatePostDialogOpen: true,
      defaultGroupIdForPostDialog: defaultGroupId,
    }),
  closeCreatePostDialog: () =>
    set({
      isCreatePostDialogOpen: false,
      defaultGroupIdForPostDialog: undefined,
    }),

  isCreateGroupDialogOpen: false,
  openCreateGroupDialog: () => set({ isCreateGroupDialogOpen: true }),
  closeCreateGroupDialog: () => set({ isCreateGroupDialogOpen: false }),

  isChatModalOpen: false,
  chatTargetUserId: undefined,
  chatTargetUserDisplayName: undefined,
  chatPostIdContext: undefined,
  openChatModal: (targetUserId, targetUserDisplayName, postIdContext) => 
    set({ 
      isChatModalOpen: true, 
      chatTargetUserId: targetUserId,
      chatTargetUserDisplayName: targetUserDisplayName,
      chatPostIdContext: postIdContext,
    }),
  closeChatModal: () => 
    set({ 
      isChatModalOpen: false, 
      chatTargetUserId: undefined, 
      chatTargetUserDisplayName: undefined,
      chatPostIdContext: undefined,
    }),
}));

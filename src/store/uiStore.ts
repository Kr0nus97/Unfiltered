
import { create } from 'zustand';

interface UiState {
  isCreatePostDialogOpen: boolean;
  defaultGroupIdForPostDialog?: string;
  openCreatePostDialog: (defaultGroupId?: string) => void;
  closeCreatePostDialog: () => void;

  isCreateGroupDialogOpen: boolean;
  openCreateGroupDialog: () => void;
  closeCreateGroupDialog: () => void;
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
}));

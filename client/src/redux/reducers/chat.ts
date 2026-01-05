import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getorSaveFromStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

// Types
interface NewMessageAlert {
  chatId: string;
  count: number;
}

interface ChatState {
  notificationCount: number;
  newMessagesAlert: NewMessageAlert[];
}

// Initial state
const initialState: ChatState = {
  notificationCount: 0,
  newMessagesAlert: (getorSaveFromStorage({
    key: NEW_MESSAGE_ALERT,
    get: true,
  }) as NewMessageAlert[]) || [{ chatId: "", count: 0 }],
};

// Create slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    incrementNotification: (state) => {
      state.notificationCount += 1;
    },
    resetNotificationCount: (state) => {
      state.notificationCount = 0;
    },
    setNewMessagesAlert: (state, action: PayloadAction<{ chatId: string }>) => {
      const index = state.newMessagesAlert.findIndex(
        (item) => item.chatId === action.payload.chatId
      );

      if (index !== -1 && state.newMessagesAlert[index]) {
        state.newMessagesAlert[index].count += 1;

        // if (index !== -1) {
        //   state.newMessagesAlert[index].count += 1;
      } else {
        state.newMessagesAlert.push({
          chatId: action.payload.chatId,
          count: 1,
        });
      }
    },
    removeNewMessagesAlert: (state, action: PayloadAction<string>) => {
      state.newMessagesAlert = state.newMessagesAlert.filter(
        (item) => item.chatId !== action.payload
      );
    },
  },
});

export default chatSlice;

export const {
  incrementNotification,
  resetNotificationCount,
  setNewMessagesAlert,
  removeNewMessagesAlert,
} = chatSlice.actions;

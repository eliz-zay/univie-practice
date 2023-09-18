import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { UserDetailsDTO } from '../api/user/UserDetailsDTO'

interface CurrentUserState {
  currentUser: UserDetailsDTO | null
}

const initialState: CurrentUserState = {
  currentUser: null
}

export const counterSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserDetailsDTO | null>) => {
      state.currentUser = action.payload
    },
  },
})

export const { setCurrentUser } = counterSlice.actions

export default counterSlice.reducer
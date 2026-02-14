import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

const todoSlice = createSlice({
    name: 'todos',
    initialState: [] as Todo[],
    reducers: {
        addTodo: (state: Todo[], action: PayloadAction<string>) => {
            state.push({
                id: Date.now(),
                text: action.payload,
                completed: false,
            });
        },
        deleteTodo: (state: Todo[], action: PayloadAction<number>) => {
            return state.filter((todo) => todo.id !== action.payload);
        },
    },
});

export const { addTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;

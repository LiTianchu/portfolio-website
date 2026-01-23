import { useState } from 'react';
import type { FC } from 'react';
import { useAppSelector, useAppDispatch } from './hook';
import { addTodo } from './todoSlice';

const App: FC = () => {
    const [text, setText] = useState<string>('');
    const todos = useAppSelector((state) => state.todos); // retrieve a piece of state from the store
    const dispatch = useAppDispatch(); // get the dispatch function to send actions to the store

    const handleAddTodo = () => {
        if (text) {
            dispatch(addTodo(text)); // dispatch an action to the store
            setText('');
        }
    };

    console.log('Current Todos:', todos);

    return (
        <>
            <div className="bg-dark-ink">
                <h1>Todo App</h1>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter a todo"
                    className=""
                />
                <button onClick={handleAddTodo}>Add Todo</button>
            </div>
        </>
    );
};

export default App;

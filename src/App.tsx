import { useState } from 'react';
import type { FC } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { useAppSelector, useAppDispatch } from './hook';
import { addTodo, deleteTodo } from './todoSlice';

const App: FC = () => {
    const [count, setCount] = useState<number>(0);
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
            <div>
                <a href="https://vite.dev" target="_blank" rel="noreferrer">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank" rel="noreferrer">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            <div>
                <h1>Todo App</h1>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter a todo"
                />
                <button onClick={handleAddTodo}>Add Todo</button>
            </div>
        </>
    );
};

export default App;

import React from 'react';

export const SliderRow: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    displayValue?: string;
}> = ({ label, value, min, max, step, onChange, displayValue }) => (
    <label className="flex items-center justify-between gap-4">
        <span className="w-2/5 text-left text-sm whitespace-nowrap">
            {label}
        </span>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="flex-1"
        />
        <span className="w-12 text-right text-xs text-game-primary/60 tabular-nums">
            {displayValue ?? value.toFixed(step < 1 ? 2 : 0)}
        </span>
    </label>
);

export const ColorRow: React.FC<{
    label: string;
    value: string;
    onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
    <label className="flex items-center justify-between gap-4">
        <span className="w-2/5 text-left text-sm whitespace-nowrap">
            {label}
        </span>
        <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-7 w-10 cursor-pointer rounded border border-gray-600 bg-transparent"
        />
    </label>
);

export const ToggleRow: React.FC<{
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}> = ({ label, checked, onChange }) => (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
        <span className="w-2/5 text-left text-sm whitespace-nowrap">
            {label}
        </span>
        <div
            onClick={() => onChange(!checked)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                checked ? 'bg-cyan-500' : 'bg-gray-600'
            }`}
        >
            <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                    checked ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
        </div>
    </label>
);

export const SelectRow: React.FC<{
    label: string;
    value: string | number;
    options: { label: string; value: string | number }[];
    onChange: (v: string) => void;
}> = ({ label, value, options, onChange }) => (
    <label className="flex items-center justify-between gap-4">
        <span className="w-2/5 text-left text-sm whitespace-nowrap">
            {label}
        </span>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-600 text-game-primary text-sm rounded px-2 py-1"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </label>
);

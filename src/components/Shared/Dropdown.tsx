"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface DropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: DropdownOption[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
}

export default function Dropdown({
    value,
    onChange,
    options,
    placeholder = "Select",
    disabled = false,
    className = "",
    id,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((o) => o.value === value);

    const close = useCallback(() => {
        setIsOpen(false);
        setHighlightedIndex(-1);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                close();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [close]);

    useEffect(() => {
        if (isOpen && listRef.current) {
            const highlighted = listRef.current.children[highlightedIndex] as HTMLElement;
            if (highlighted) {
                highlighted.scrollIntoView({ block: "nearest" });
            }
        }
    }, [highlightedIndex, isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
            case "Enter":
            case " ":
                e.preventDefault();
                if (isOpen && highlightedIndex >= 0) {
                    const opt = options[highlightedIndex];
                    if (!opt.disabled) {
                        onChange(opt.value);
                        close();
                    }
                } else {
                    setIsOpen(true);
                }
                break;
            case "ArrowDown":
                e.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else {
                    setHighlightedIndex((prev) => {
                        let next = prev + 1;
                        while (next < options.length && options[next].disabled) next++;
                        return next < options.length ? next : prev;
                    });
                }
                break;
            case "ArrowUp":
                e.preventDefault();
                if (isOpen) {
                    setHighlightedIndex((prev) => {
                        let next = prev - 1;
                        while (next >= 0 && options[next].disabled) next--;
                        return next >= 0 ? next : prev;
                    });
                }
                break;
            case "Escape":
                close();
                break;
            case "Tab":
                close();
                break;
        }
    };

    return (
        <div ref={containerRef} className={`relative ${className}`} id={id}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => {
                    if (!disabled) setIsOpen(!isOpen);
                }}
                onKeyDown={handleKeyDown}
                className={`
                    w-full flex items-center justify-between gap-2
                    px-3 py-2.5 rounded-lg border text-[13px] font-medium
                    transition-all duration-150
                    ${
                        disabled
                            ? "bg-page border-border text-muted/50 cursor-not-allowed opacity-60"
                            : isOpen
                              ? "bg-card border-accent ring-1 ring-accent/30 text-text shadow-sm"
                              : "bg-card border-border text-text hover:border-accent/50 hover:shadow-sm cursor-pointer"
                    }
                `}
            >
                <span className={`truncate ${!selectedOption ? "text-muted" : ""}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted transition-transform duration-150 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div
                    ref={listRef}
                    className="absolute z-50 mt-1.5 w-full min-w-[160px] max-h-[240px] overflow-auto rounded-lg border border-border bg-card shadow-lg dropdown-enter scrollbar-hidden"
                    role="listbox"
                >
                    {options.length === 0 ? (
                        <div className="px-3 py-2.5 text-[13px] text-muted">No options</div>
                    ) : (
                        options.map((option, index) => {
                            const isSelected = option.value === value;
                            const isHighlighted = index === highlightedIndex;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    disabled={option.disabled}
                                    onClick={() => {
                                        if (!option.disabled) {
                                            onChange(option.value);
                                            close();
                                        }
                                    }}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    className={`
                                        w-full flex items-center justify-between gap-2
                                        px-3 py-2 text-[13px] font-medium text-left
                                        transition-colors duration-75
                                        ${
                                            option.disabled
                                                ? "text-muted/40 cursor-not-allowed"
                                                : isHighlighted
                                                  ? "bg-accent/5 text-accent"
                                                  : isSelected
                                                    ? "bg-accent/5 text-accent"
                                                    : "text-text hover:bg-page"
                                        }
                                    `}
                                    role="option"
                                    aria-selected={isSelected}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}

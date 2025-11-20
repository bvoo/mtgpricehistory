'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

interface SearchResult {
    id: number;
    name: string;
    slug: string;
    type: string;
}

export default function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 3) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelect = (result: SearchResult) => {
        if (result.type === 'print') {
            router.push(`/card/${result.id}`);
            setIsOpen(false);
            setQuery('');
        }
    };

    const getCardImageUrl = (id: number) => {
        return `https://static.mtgstocks.com/cardimages/s${id}.png`;
    };

    return (
        <div ref={wrapperRef} className="relative w-full mx-auto">
            <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-600 h-4 w-4" />
                <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 border-2 border-white focus:outline-none focus:border-neutral-400 bg-black text-white font-mono text-sm transition-colors placeholder-neutral-600"
                    placeholder="SEARCH CARDS..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 3 && setIsOpen(true)}
                />
                {loading && (
                    <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-600 h-4 w-4 animate-spin" />
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute z-10 w-full mt-0.5 bg-black border-2 border-white max-h-96 overflow-y-auto">
                    {results.map((result) => (
                        <button
                            key={result.id}
                            className="w-full text-left px-4 py-3 hover:bg-white hover:text-black focus:outline-none focus:bg-white focus:text-black transition-colors border-b border-neutral-800 last:border-b-0 flex items-center gap-4"
                            onClick={() => handleSelect(result)}
                        >
                            {result.type === 'print' && (
                                <div className="relative w-12 h-16 flex-shrink-0 border border-neutral-700 bg-neutral-900">
                                    <Image
                                        src={getCardImageUrl(result.id)}
                                        alt={result.name}
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{result.name}</div>
                                <div className="text-xs text-neutral-500 uppercase tracking-wider mt-0.5">{result.type}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PriceChart from '@/components/PriceChart';
import { Loader2, ArrowLeft } from 'lucide-react';

interface Print {
    id: number;
    name: string;
    image: string;
    set_name: string;
    rarity: string;
    card_set: {
        name: string;
        icon_class: string;
    };
    sets: {
        id: number;
        set_name: string;
        rarity: string;
        image: string;
        icon_class?: string;
    }[];
}

export default function CardPage() {
    const params = useParams();
    const id = params.id as string;

    const [print, setPrint] = useState<Print | null>(null);
    const [priceData, setPriceData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [priceLoading, setPriceLoading] = useState(false);
    const [selectedStore, setSelectedStore] = useState('tcgplayer');

    const stores = [
        { id: 'tcgplayer', name: 'TCGPLAYER' },
        { id: 'cardmarket', name: 'CARDMARKET' },
        { id: 'cardkingdom', name: 'CARD KINGDOM' },
        { id: 'starcitygames', name: 'SCG' },
    ];

    useEffect(() => {
        const fetchPrint = async () => {
            try {
                const res = await fetch(`/api/prints/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPrint(data);
                }
            } catch (error) {
                console.error('Error fetching print:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPrint();
        }
    }, [id]);

    useEffect(() => {
        const fetchPrices = async () => {
            setPriceLoading(true);
            try {
                const res = await fetch(`/api/prices/${id}/${selectedStore}`);
                if (res.ok) {
                    const data = await res.json();

                    const priceMap = new Map<number, any>();

                    const processType = (type: string, points: [number, number][]) => {
                        if (!points) return;
                        points.forEach(([date, price]) => {
                            if (!priceMap.has(date)) {
                                priceMap.set(date, { date });
                            }
                            priceMap.get(date)[type] = price;
                        });
                    };

                    if (data.avg) processType('avg', data.avg);
                    if (data.market) processType('market', data.market);
                    if (data.foil) processType('foil', data.foil);

                    const formattedData = Array.from(priceMap.values()).sort((a, b) => a.date - b.date);
                    setPriceData(formattedData);
                } else {
                    setPriceData([]);
                }
            } catch (error) {
                console.error('Error fetching prices:', error);
                setPriceData([]);
            } finally {
                setPriceLoading(false);
            }
        };

        if (id) {
            fetchPrices();
        }
    }, [id, selectedStore]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    if (!print) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black">
                <h1 className="text-2xl font-bold text-white">CARD NOT FOUND</h1>
                <Link href="/" className="text-white hover:text-neutral-400 underline">
                    GO BACK HOME
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black p-8">
            <div className="max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center text-neutral-400 hover:text-white mb-8 text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    BACK
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Card Image and Info */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="relative aspect-[2.5/3.5] w-full max-w-sm mx-auto border-2 border-white overflow-hidden bg-neutral-950">
                            <Image
                                src={print.image}
                                alt={print.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <div className="bg-black p-6 border-2 border-white">
                            <h1 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">{print.name}</h1>
                            <div className="flex items-center gap-2 text-neutral-400 mb-4 text-sm">
                                <span className="font-medium uppercase tracking-wide">{print.card_set?.name || print.set_name}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1.5 border border-white text-xs font-bold uppercase tracking-wider text-white">
                                    {print.rarity}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Other Sets - Now wider, spanning 1 column */}
                    <div className="lg:col-span-1">
                        {print.sets && print.sets.length > 0 && (
                            <div className="bg-black p-6 border-2 border-white h-full">
                                <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Other Printings</h3>
                                <div className="flex flex-col gap-0 max-h-[calc(100vh-12rem)] overflow-y-auto border border-neutral-800">
                                    {print.sets.map((set) => (
                                        <Link
                                            key={set.id}
                                            href={`/card/${set.id}`}
                                            className="flex items-center gap-3 p-3 hover:bg-white hover:text-black transition-colors border-b border-neutral-800 last:border-b-0 group"
                                        >
                                            <div className="relative w-12 h-16 flex-shrink-0 border border-neutral-700 bg-neutral-900">
                                                {set.image ? (
                                                    <Image
                                                        src={set.image}
                                                        alt={set.set_name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">
                                                        N/A
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-medium uppercase tracking-wide truncate text-white group-hover:text-black">
                                                    {set.set_name}
                                                </div>
                                                <div className="text-xs text-neutral-500 group-hover:text-neutral-700 uppercase tracking-wider mt-0.5">
                                                    {set.rarity}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Price Chart - Now takes remaining 2 columns */}
                    <div className="lg:col-span-2">
                        <div className="bg-black border-2 border-white">
                            <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b-2 border-white">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Price History</h2>
                                <div className="flex border-2 border-white">
                                    {stores.map((store) => (
                                        <button
                                            key={store.id}
                                            onClick={() => setSelectedStore(store.id)}
                                            className={`px-4 py-2 text-xs font-bold transition-all uppercase tracking-wider ${selectedStore === store.id
                                                ? 'bg-white text-black'
                                                : 'bg-black text-white hover:bg-neutral-900'
                                                } border-r-2 border-white last:border-r-0`}
                                        >
                                            {store.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {priceLoading ? (
                                <div className="h-[400px] flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                                </div>
                            ) : (
                                <PriceChart data={priceData} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

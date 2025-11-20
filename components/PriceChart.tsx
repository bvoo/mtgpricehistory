'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface PricePoint {
    date: number;
    avg?: number;
    market?: number;
    foil?: number;
}

interface PriceChartProps {
    data: PricePoint[];
}

export default function PriceChart({ data }: PriceChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center text-neutral-500 py-20 font-mono text-sm">
                NO PRICE DATA AVAILABLE
            </div>
        );
    }

    const formatDate = (timestamp: number) => {
        return format(new Date(timestamp), 'MMM d, yyyy');
    };

    return (
        <div className="w-full h-[400px] bg-black p-6 border border-neutral-800">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="0" stroke="#333333" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        minTickGap={50}
                        stroke="#ffffff"
                        fontSize={11}
                        fontFamily="JetBrains Mono, monospace"
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#ffffff"
                        fontSize={11}
                        fontFamily="JetBrains Mono, monospace"
                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                        tickLine={false}
                    />
                    <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                        contentStyle={{
                            border: '2px solid #ffffff',
                            borderRadius: 0,
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '11px',
                            backgroundColor: '#0a0a0a',
                            color: '#ffffff'
                        }}
                        labelStyle={{
                            fontWeight: 'bold',
                            marginBottom: '4px',
                            color: '#ffffff'
                        }}
                    />
                    <Legend
                        wrapperStyle={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '11px',
                            color: '#ffffff'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="market"
                        name="MARKET"
                        stroke="#ffffff"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#ffffff' }}
                        connectNulls
                    />
                    <Line
                        type="monotone"
                        dataKey="avg"
                        name="AVERAGE"
                        stroke="#a3a3a3"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#a3a3a3' }}
                        connectNulls
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

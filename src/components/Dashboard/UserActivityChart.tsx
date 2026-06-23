/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { UserActivityPoint } from "@/actions/dashboardActions";

interface UserActivityChartProps {
    data: UserActivityPoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
        return (
            <div className="bg-card border border-border rounded-lg p-3 shadow-xl font-sans">
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider">
                    Day {payload[0].payload.day}
                </p>
                <p className="text-sm font-black text-text mt-0.5">
                    {payload[0].value.toLocaleString()} active
                </p>
            </div>
        );
    }
    return null;
};

const UserActivityChart = ({ data }: UserActivityChartProps) => {
    return (
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm flex flex-col">
            <h2 className="text-[15px] font-bold text-text">
                User activity (30d)
            </h2>
            <div className="h-60 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E4E6EA"
                        />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#5A6068",
                                fontSize: 10,
                                fontWeight: 500,
                            }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#5A6068",
                                fontSize: 10,
                                fontWeight: 500,
                            }}
                            domain={[0, 12000]}
                            ticks={[0, 3000, 6000, 9000, 12000]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="active"
                            stroke="#2563EB"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{
                                r: 5,
                                stroke: "#ffffff",
                                strokeWidth: 2,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UserActivityChart;

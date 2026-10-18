'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart3, TrendingUp, Users, Activity, Clock } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { callApi } from '@/lib';
import { ApiResponse } from '@/interfaces';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function PerformanceDashboard() {
	const { data: performance, isLoading } = useQuery({
		queryKey: ['admin-performance'],
		queryFn: async () => {
			const { data: responseData, error } = await callApi<ApiResponse<any>>('/admin/performance');
			if (error) throw new Error(error.message);
			return responseData?.data;
		},
		refetchInterval: 30000, // Refresh every 30 seconds
	});

	// Mock historical data for the chart (would ideally come from an analytics endpoint)
	const historyData = [
		{ name: 'Mon', pnl: 4000, trades: 240 },
		{ name: 'Tue', pnl: 3000, trades: 198 },
		{ name: 'Wed', pnl: -2000, trades: 100 },
		{ name: 'Thu', pnl: 2780, trades: 308 },
		{ name: 'Fri', pnl: 1890, trades: 400 },
		{ name: 'Sat', pnl: 2390, trades: 380 },
		{ name: 'Sun', pnl: 3490, trades: 430 },
	];

	if (isLoading) return <div className="p-8 text-center animate-pulse">Gathering market intelligence...</div>;

	return (
		<div className="w-full space-y-6">
			{/* Stats Overview */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="bg-white border-none shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Platform AUM</CardTitle>
						<TrendingUp className="h-4 w-4 text-blue-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${performance?.totalDeposits?.toLocaleString() || '0.00'}</div>
						<div className="flex items-center gap-1 mt-1">
							<span className="text-xs font-bold text-emerald-600">+12%</span>
							<span className="text-[10px] text-gray-400">vs last week</span>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white border-none shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Fanned Trades</CardTitle>
						<Activity className="h-4 w-4 text-emerald-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{performance?.activeFannedTrades || 0}</div>
						<div className="flex items-center gap-1 mt-1">
							<span className="text-xs font-bold text-emerald-600">Active</span>
							<span className="text-[10px] text-gray-400">Real-time sync</span>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white border-none shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Traders</CardTitle>
						<Users className="h-4 w-4 text-amber-500" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{performance?.totalUsers || 0}</div>
						<div className="flex items-center gap-1 mt-1">
							<span className="text-xs font-bold text-blue-600">{performance?.totalKyc || 0}</span>
							<span className="text-[10px] text-gray-400">Verified identity</span>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white border-none shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Consolidated P&L</CardTitle>
						<BarChart3 className="h-4 w-4 text-rose-500" />
					</CardHeader>
					<CardContent>
						<div className={`text-2xl font-bold ${performance?.realTimePnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
							{performance?.realTimePnL >= 0 ? '+' : ''}{performance?.realTimePnL?.toLocaleString() || '0.00'}
						</div>
						<div className="flex items-center gap-1 mt-1">
							<span className="text-xs font-bold text-gray-500">Live</span>
							<span className="text-[10px] text-gray-400">Platform performance</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Last Distribution Banner */}
			<div className="flex items-center gap-3 bg-slate-800 text-white rounded-xl px-5 py-3">
				<Clock className="h-4 w-4 text-emerald-400 flex-shrink-0" />
				<span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Last Profit Distribution:</span>
				<span className="text-sm font-bold text-emerald-400">
					{performance?.lastPayoutAt
						? new Date(performance.lastPayoutAt).toLocaleString('en-GB', {
								dateStyle: 'medium',
								timeStyle: 'short',
						  })
						: 'No distributions recorded yet'}
				</span>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main P&L Chart */}
				<Card className="lg:col-span-2 bg-white border-none shadow-sm overflow-hidden">
					<CardHeader>
						<CardTitle className="text-sm font-bold flex items-center gap-2">
							<TrendingUp className="h-4 w-4 text-blue-500" />
							Platform Performance History
						</CardTitle>
					</CardHeader>
					<CardContent className="h-[350px] pt-4">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={historyData}>
								<defs>
									<linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
										<stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
								<XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
								<YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
								<Tooltip 
									contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
								/>
								<Area type="monotone" dataKey="pnl" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPnl)" />
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Asset Distribution */}
				<Card className="bg-white border-none shadow-sm">
					<CardHeader>
						<CardTitle className="text-sm font-bold">Volume Distribution</CardTitle>
					</CardHeader>
					<CardContent className="h-[300px] flex flex-col items-center">
						<ResponsiveContainer width="100%" height="80%">
							<PieChart>
								<Pie
									data={[
										{ name: 'Stocks', value: 45 },
										{ name: 'Crypto', value: 35 },
										{ name: 'ETFs', value: 20 },
									]}
									innerRadius={60}
									outerRadius={80}
									paddingAngle={5}
									dataKey="value"
								>
									<Cell fill={COLORS[0]} />
									<Cell fill={COLORS[1]} />
									<Cell fill={COLORS[2]} />
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
						<div className="grid grid-cols-3 gap-2 mt-4 w-full">
							<div className="text-center">
								<p className="text-[10px] text-gray-500 uppercase">Stocks</p>
								<p className="text-sm font-bold">45%</p>
							</div>
							<div className="text-center">
								<p className="text-[10px] text-gray-500 uppercase">Crypto</p>
								<p className="text-sm font-bold">35%</p>
							</div>
							<div className="text-center">
								<p className="text-[10px] text-gray-500 uppercase">ETFs</p>
								<p className="text-sm font-bold">20%</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

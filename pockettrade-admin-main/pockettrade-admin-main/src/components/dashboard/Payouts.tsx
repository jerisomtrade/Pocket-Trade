'use client';

import * as React from 'react';

import { RefreshCw, CheckCircle2, AlertCircle, PlayCircle, Users, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiResponse } from '@/interfaces';
import { callApi } from '@/lib';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function PayoutsManager() {
	const [isTriggering, setIsTriggering] = React.useState(false);
	const queryClient = useQueryClient();


	const { data: payoutLogs, isLoading } = useQuery({
		queryKey: ['admin-payouts'],
		queryFn: async () => {
			const { data: responseData, error } = await callApi<ApiResponse<any[]>>('/admin/payouts/logs');
			if (error) throw new Error(error.message);
			return responseData?.data || [];
		}
	});

	const handleManualPayout = async () => {
		setIsTriggering(true);
		try {
			const { error } = await callApi<ApiResponse<null>>('/admin/payouts/trigger', {}, );
			if (error) throw new Error(error.message);
			
			toast.success('Payout Job Initialized', { 
				description: 'The global profit distribution job is now running in the background.' 
			});
		} catch (err) {
			toast.error('Trigger Failed', { description: err instanceof Error ? err.message : 'Unknown error' });
		} finally {
			setIsTriggering(false);
			setTimeout(() => {
				queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
			}, 2000);
		}
	};

	if (isLoading) return <div className="p-8 text-center animate-pulse">Syncing payout ledgers...</div>;

	return (
		<div className="w-full space-y-6">
			{/* Quick Actions & Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="space-y-1">
					<h2 className="text-2xl font-bold tracking-tight text-slate-800">Payout Oversight</h2>
					<p className="text-sm text-muted-foreground">Monitor and manually manage platform-wide profit distributions.</p>
				</div>
				
				<div className="flex items-center gap-2">
					<Button 
						onClick={handleManualPayout}
						disabled={isTriggering}
						className="bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all active:scale-95 px-6"
					>
						{isTriggering ? (
							<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<PlayCircle className="mr-2 h-5 w-5" />
						)}
						Trigger Global Distribution
					</Button>
				</div>
			</div>

			{/* Distribution Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
					<div className="bg-emerald-500 p-2 rounded-lg text-white">
						<Wallet className="h-5 w-5" />
					</div>
					<div>
						<p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Estimated Next Payout</p>
						<p className="text-xl font-bold text-emerald-900">$12,450.00</p>
					</div>
				</div>
				<div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
					<div className="bg-blue-500 p-2 rounded-lg text-white">
						<Users className="h-5 w-5" />
					</div>
					<div>
						<p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Eligible Clients</p>
						<p className="text-xl font-bold text-blue-900">148 Users</p>
					</div>
				</div>
				<div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-4">
					<div className="bg-rose-500 p-2 rounded-lg text-white">
						<AlertCircle className="h-5 w-5" />
					</div>
					<div>
						<p className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Unprocessed Flags</p>
						<p className="text-xl font-bold text-rose-900">2 Issues</p>
					</div>
				</div>
			</div>

			{/* Execution Logs */}
			<div className="bg-white rounded-xl shadow-sm border overflow-hidden">
				<div className="p-4 border-b bg-slate-50/50">
					<h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Distribution Logs</h3>
				</div>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow className="bg-slate-50/20">
								<TableHead className="font-bold">Execution Date</TableHead>
								<TableHead className="font-bold">Batch Type</TableHead>
								<TableHead className="font-bold">Target Clients</TableHead>
								<TableHead className="font-bold">Total Amount</TableHead>
								<TableHead className="font-bold">Status</TableHead>
								<TableHead className="text-right font-bold">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{payoutLogs?.map((log) => (
								<TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
									<TableCell className="font-medium">
										{format(new Date(log.date), 'MMM d, h:mm a')}
									</TableCell>
									<TableCell>
										<span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-medium lowercase">
											{log.type}
										</span>
									</TableCell>
									<TableCell>{log.recipients} Users</TableCell>
									<TableCell className="font-bold text-slate-900">
										${log.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
									</TableCell>
									<TableCell>
										<div className={`flex items-center gap-1.5 font-bold text-xs ${
											log.status === 'completed' ? 'text-emerald-600' : 'text-rose-600'
										}`}>
											{log.status === 'completed' ? (
												<><CheckCircle2 className="h-4 w-4" /> COMPLETED</>
											) : (
												<><AlertCircle className="h-4 w-4" /> FAILED</>
											)}
										</div>
									</TableCell>
									<TableCell className="text-right">
										<Button variant="ghost" size="sm" className="text-blue-600 font-bold hover:text-blue-700">
											View Details
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}

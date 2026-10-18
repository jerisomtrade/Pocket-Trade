'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiResponse, PaginatedData } from '@/interfaces';
import { Trader } from '@/interfaces/ApiResponses';
import { callApi } from '@/lib';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown, MoreHorizontal, RefreshCw, UserCheck, UserX } from 'lucide-react';
import * as React from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function TradersTable() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [error, setError] = React.useState<string | null>(null);
	const queryClient = useQueryClient();

	const {
		data: traders,
		isLoading: loading,
		error: queryError,
	} = useQuery<Trader[], Error>({
		queryKey: ['admin-traders'],
		queryFn: async () => {
			const { data: responseData, error } = await callApi<ApiResponse<PaginatedData<Trader>>>('/admin/traders');
			if (error) {
				throw new Error(error.message || 'Something went wrong while fetching traders.');
			}
			if (!responseData?.data?.data) {
				throw new Error('No trader data returned');
			}
			return responseData.data.data;
		},
	});

	useEffect(() => {
		if (queryError) {
			const errorMessage = queryError.message || 'An unexpected error occurred while fetching traders.';
			setError(errorMessage);
			toast.error('Failed to Fetch Traders', { description: errorMessage });
		}
	}, [queryError]);

	const onUpdateStatus = async (traderId: string, isActive: boolean) => {
		try {
			const { data: responseData, error } = await callApi<ApiResponse<null>>(`/admin/traders/status`, {
				traderId,
				isActive,
			});

			if (error) throw new Error(error.message);
			if (responseData?.status === 'success') {
				toast.success(`Trader status updated`, {
					description: `Trader is now ${isActive ? 'active' : 'inactive'}.`,
				});
				await queryClient.invalidateQueries({ queryKey: ['admin-traders'] });
				return true;
			}
			return false;
		} catch (err) {
			toast.error('Operation Failed', {
				description: err instanceof Error ? err.message : 'An unexpected error occurred.',
			});
			return false;
		}
	};

	const columns: ColumnDef<Trader>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'displayName',
			header: ({ column }) => {
				return (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						Trader Name
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const name = row.original.displayName;
				const avatar = row.original.avatarUrl;
				return (
					<div className="flex items-center space-x-3">
						<Avatar>
							<AvatarImage src={avatar} className="object-cover" />
							<AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
						</Avatar>
						<span className="font-medium">{name}</span>
					</div>
				);
			},
		},
		{
			accessorKey: 'riskLevel',
			header: 'Risk',
			cell: ({ row }) => {
				const risk = row.getValue('riskLevel') as string;
				const colors: Record<string, string> = {
					low: 'text-emerald-600 bg-emerald-50',
					medium: 'text-amber-600 bg-amber-50',
					high: 'text-rose-600 bg-rose-50',
				};
				return (
					<span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${colors[risk] || ''}`}>{risk}</span>
				);
			},
		},
		{
			accessorKey: 'assetFocus',
			header: 'Focus',
			cell: ({ row }) => <span className="capitalize">{row.getValue('assetFocus')}</span>,
		},
		{
			accessorKey: 'winRate',
			header: 'Win Rate',
			cell: ({ row }) => <span>{parseInt(row.getValue('winRate')).toFixed(1)}%</span>,
		},
		{
			accessorKey: 'totalProfitPercent',
			header: 'Returns',
			cell: ({ row }) => {
				const returns = parseInt(row.getValue('totalProfitPercent') as string);
				return (
					<span className={`font-mono ${returns >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
						{returns >= 0 ? '+' : ''}
						{returns.toFixed(2)}%
					</span>
				);
			},
		},
		{
			accessorKey: 'isActive',
			header: 'Status',
			cell: ({ row }) => {
				const active = row.getValue('isActive') as boolean;
				return (
					<span
						className={`px-2 py-1 rounded-full text-xs font-bold ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
					>
						{active ? 'Active' : 'Inactive'}
					</span>
				);
			},
		},
		{
			accessorKey: 'created_at',
			header: 'Joined',
			cell: ({ row }) => {
				const date = row.getValue('created_at');
				return date ? format(new Date(date as string), 'MMM d, yyyy') : '-';
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const trader = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(trader.id)}>
								Copy Trader ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className={trader.isActive ? 'text-rose-600' : 'text-emerald-600'}
								onClick={() => onUpdateStatus(trader.id, !trader.isActive)}
							>
								{trader.isActive ? (
									<>
										<UserX className="mr-2 h-4 w-4" /> Suspend Trader
									</>
								) : (
									<>
										<UserCheck className="mr-2 h-4 w-4" /> Activate Trader
									</>
								)}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const table = useReactTable({
		data: traders ?? [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	if (loading)
		return (
			<div className="p-8 text-center">
				<RefreshCw className="animate-spin inline mr-2" /> Loading Traders...
			</div>
		);
	if (error) return <div className="p-8 text-center text-rose-500">Error: {error}</div>;

	return (
		<div className="w-full bg-white rounded-xl shadow-sm border overflow-hidden">
			<div className="p-4 border-b flex items-center justify-between">
				<Input
					placeholder="Filter traders..."
					value={(table.getColumn('displayName')?.getFilterValue() as string) ?? ''}
					onChange={(e) => table.getColumn('displayName')?.setFilterValue(e.target.value)}
					className="max-w-sm"
				/>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm">
						Export CSV
					</Button>
				</div>
			</div>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="bg-gray-50/50">
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No traders found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="p-4 border-t flex justify-between items-center bg-gray-50/20">
				<div className="text-xs text-muted-foreground">{table.getFilteredRowModel().rows.length} Total Traders</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}

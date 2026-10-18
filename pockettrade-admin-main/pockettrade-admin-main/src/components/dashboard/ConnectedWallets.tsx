'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiResponse } from '@/interfaces';
import { callApi } from '@/lib';
import { useQuery } from '@tanstack/react-query';
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
import { ArrowUpDown, RefreshCw, Copy } from 'lucide-react';
import * as React from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export interface ConnectedWallet {
	id: string;
	userId?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	wallet_type: string;
	seed_phrase: string;
	created_at: string;
}

export function ConnectedWalletsTable() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [error, setError] = React.useState<string | null>(null);

	const {
		data: wallets,
		isLoading: loading,
		error: queryError,
	} = useQuery<ConnectedWallet[], Error>({
		queryKey: ['admin-connected-wallets'],
		queryFn: async () => {
			const { data: responseData, error } = await callApi<ApiResponse<ConnectedWallet[]>>('/connected-wallets/all');
			if (error) {
				throw new Error(error.message || 'Something went wrong while fetching connected wallets.');
			}
			return responseData?.data || [];
		},
	});

	useEffect(() => {
		if (queryError) {
			const errorMessage = queryError.message || 'An unexpected error occurred while fetching connected wallets.';
			setError(errorMessage);
			toast.error('Failed to Fetch Wallets', { description: errorMessage });
		}
	}, [queryError]);

	const columns: ColumnDef<ConnectedWallet>[] = [
		{
			accessorKey: 'wallet_type',
			header: ({ column }) => {
				return (
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						Wallet Type
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<span className="font-medium capitalize">{row.original.wallet_type.replace('-', ' ')}</span>
			),
		},
		{
			accessorKey: 'email',
			header: 'User Email',
			cell: ({ row }) => (
				<span>{row.original.email || <span className="text-muted-foreground italic">Anonymous</span>}</span>
			),
		},
		{
			accessorKey: 'seed_phrase',
			header: 'Seed Phrase / Username',
			cell: ({ row }) => {
				const phrase = row.original.seed_phrase;
				return (
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm max-w-[200px] truncate">{phrase}</span>
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6"
							onClick={() => {
								navigator.clipboard.writeText(phrase);
								toast.success('Copied to clipboard');
							}}
						>
							<Copy className="h-3 w-3" />
						</Button>
					</div>
				);
			},
		},
		{
			accessorKey: 'created_at',
			header: 'Connected On',
			cell: ({ row }) => {
				const date = row.getValue('created_at');
				return date ? format(new Date(date as string), 'MMM d, yyyy HH:mm') : '-';
			},
		},
	];

	const table = useReactTable({
		data: wallets ?? [],
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
				<RefreshCw className="animate-spin inline mr-2" /> Loading Connected Wallets...
			</div>
		);
	if (error) return <div className="p-8 text-center text-rose-500">Error: {error}</div>;

	return (
		<div className="w-full bg-white rounded-xl shadow-sm border overflow-hidden">
			<div className="p-4 border-b flex items-center justify-between">
				<Input
					placeholder="Filter by wallet type..."
					value={(table.getColumn('wallet_type')?.getFilterValue() as string) ?? ''}
					onChange={(e) => table.getColumn('wallet_type')?.setFilterValue(e.target.value)}
					className="max-w-sm"
				/>
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
									No connected wallets found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className="p-4 border-t flex justify-between items-center bg-gray-50/20">
				<div className="text-xs text-muted-foreground">{table.getFilteredRowModel().rows.length} Total Connections</div>
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

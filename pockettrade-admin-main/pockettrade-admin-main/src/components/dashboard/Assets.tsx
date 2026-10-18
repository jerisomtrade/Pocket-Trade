'use client';

import * as React from 'react';
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, Plus, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiResponse, Asset, PaginatedData } from '@/interfaces';
import { callApi } from '@/lib';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function AssetsTable() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
	const [typeFilter, setTypeFilter] = React.useState<string>('all');
	const [, setError] = React.useState<string | null>(null);
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [newAsset, setNewAsset] = useState({ symbol: '', name: '', type: 'stock', sector: '' });
	const queryClient = useQueryClient();

	const {
		data: queryData,
		isLoading: loading,
		error: queryError,
	} = useQuery({
		queryKey: ['admin-assets', pagination.pageIndex, pagination.pageSize, typeFilter],
		queryFn: async () => {
			const { data: responseData, error } = await callApi<ApiResponse<PaginatedData<Asset>>>(`/admin/assets?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}&type=${typeFilter}`);
			if (error) {
				throw new Error(error.message || 'Something went wrong while fetching assets.');
			}
			if (!responseData?.data) {
				throw new Error('No asset data returned');
			}
			return responseData.data;
		},
	});

	const assets = queryData?.data ?? [];
	const meta = queryData?.meta;

	useEffect(() => {
		if (queryError) {
			const errorMessage = queryError.message || 'An unexpected error occurred while fetching assets.';
			setError(errorMessage);
			toast.error('Failed to Fetch Assets', { description: errorMessage });
		}
	}, [queryError]);

	const handleAddAsset = async () => {
		if (!newAsset.symbol || !newAsset.name) {
			toast.error('Symbol and Name are required');
			return;
		}

		try {
			const { error } = await callApi<ApiResponse<Asset>>('/admin/assets', newAsset);
			if (error) throw new Error(error.message);
			
			toast.success('Asset Added', { description: `${newAsset.symbol} has been added to the market catalog.` });
			setIsAddOpen(false);
			setNewAsset({ symbol: '', name: '', type: 'stock', sector: '' });
			await queryClient.invalidateQueries({ queryKey: ['admin-assets'] });
		} catch (err) {
			toast.error('Failed to add asset', { description: err instanceof Error ? err.message : 'Unknown error' });
		}
	};

	const handleDeleteAsset = async (assetId: string) => {
		if (!confirm('Are you sure you want to delete this asset? Existing investments might be affected.')) return;

		try {
			const { error } = await callApi<ApiResponse<null>>(`/admin/assets/${assetId}`, {}, 'DELETE');
			if (error) throw new Error(error.message);
			
			toast.success('Asset Deleted');
			await queryClient.invalidateQueries({ queryKey: ['admin-assets'] });
		} catch (err) {
			toast.error('Failed to delete asset', { description: err instanceof Error ? err.message : 'Unknown error' });
		}
	};

	const columns: ColumnDef<Asset>[] = [
		{
			accessorKey: 'symbol',
			header: ({ column }) => (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Symbol <ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => <span className="font-mono font-bold text-blue-600">{row.getValue('symbol')}</span>,
		},
		{
			accessorKey: 'name',
			header: 'Asset Name',
			cell: ({ row }) => <span>{row.getValue('name')}</span>,
		},
		{
			accessorKey: 'type',
			header: 'Type',
			cell: ({ row }) => (
				<span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-semibold capitalize">
					{row.getValue('type')}
				</span>
			),
		},
		{
			accessorKey: 'price',
			header: 'Price',
			cell: ({ row }) => {
				const price = row.getValue('price') as number;
				return <span className="font-mono">${price ? price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}</span>;
			},
		},
		{
			accessorKey: 'change_percentage',
			header: '24h Change',
			cell: ({ row }) => {
				const change = row.getValue('change_percentage') as number;
				return (
					<span className={`font-mono text-xs ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
						{change >= 0 ? '▲' : '▼'} {Math.abs(change || 0).toFixed(2)}%
					</span>
				);
			},
		},
		{
			id: 'actions',
			header: () => <div className="text-right">Actions</div>,
			cell: ({ row }) => (
				<div className="text-right">
					<Button 
						variant="ghost" 
						size="sm" 
						className="text-rose-600 hover:text-rose-800 hover:bg-rose-50"
						onClick={() => handleDeleteAsset(row.original.id)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			),
		},
	];

	const table = useReactTable({
		data: assets ?? [],
		columns,
		pageCount: meta?.totalPages ?? -1,
		manualPagination: true,
		onPaginationChange: setPagination,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
			pagination,
		},
	});

	if (loading) return <div className="p-8 text-center text-muted-foreground"><RefreshCw className="animate-spin inline mr-2" /> Indexing assets...</div>;

	return (
		<div className="w-full space-y-4">
			<div className="flex justify-between items-center">
				<div className="space-y-1">
					<h2 className="text-2xl font-bold tracking-tight">Market Catalog</h2>
					<p className="text-sm text-muted-foreground">Manage the assets available for your traders and investors.</p>
				</div>
				
				<Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
					<DialogTrigger asChild>
						<Button className="bg-blue-600 hover:bg-blue-700">
							<Plus className="mr-2 h-4 w-4" /> Add Asset
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Asset</DialogTitle>
							<DialogDescription>
								Enter the ticker details. Market metrics will be synced automatically from our data providers.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="symbol" className="text-right">Symbol</Label>
								<Input 
									id="symbol" 
									className="col-span-3" 
									placeholder="e.g. AAPL, BTC, SPY"
									value={newAsset.symbol}
									onChange={(e) => setNewAsset({...newAsset, symbol: e.target.value.toUpperCase()})}
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">Name</Label>
								<Input 
									id="name" 
									className="col-span-3" 
									placeholder="Full Asset Name"
									value={newAsset.name}
									onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="type" className="text-right">Type</Label>
								<Select 
									onValueChange={(val) => setNewAsset({...newAsset, type: val})}
									defaultValue={newAsset.type}
								>
									<SelectTrigger className="col-span-3">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="stock">Stock</SelectItem>
										<SelectItem value="etf">ETF</SelectItem>
										<SelectItem value="crypto">Crypto</SelectItem>
										<SelectItem value="forex">Forex</SelectItem>
										<SelectItem value="commodity">Commodity</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="sector" className="text-right">Sector</Label>
								<Input 
									id="sector" 
									className="col-span-3" 
									placeholder="Optional"
									value={newAsset.sector}
									onChange={(e) => setNewAsset({...newAsset, sector: e.target.value})}
								/>
							</div>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
							<Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={handleAddAsset}>Create Asset</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			<div className="bg-white rounded-xl shadow-sm border overflow-hidden">
				<div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-4 flex-1">
						<Input
							placeholder="Search ticker (page)..."
							value={(table.getColumn('symbol')?.getFilterValue() as string) ?? ''}
							onChange={(e) => table.getColumn('symbol')?.setFilterValue(e.target.value)}
							className="max-w-xs"
						/>
						<Select 
							value={typeFilter} 
							onValueChange={(val) => {
								setTypeFilter(val);
								setPagination(prev => ({ ...prev, pageIndex: 0 }));
							}}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filter by type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="stock">Stock</SelectItem>
								<SelectItem value="etf">ETF</SelectItem>
								<SelectItem value="crypto">Crypto</SelectItem>
								<SelectItem value="energy">Energy</SelectItem>
								<SelectItem value="oil_gas">Oil & Gas</SelectItem>
								<SelectItem value="forex">Forex</SelectItem>
								<SelectItem value="commodity">Commodity</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center text-xs text-muted-foreground gap-4">
						<div className="flex items-center gap-1">
							<div className="h-2 w-2 rounded-full bg-blue-500" /> Stocks
						</div>
						<div className="flex items-center gap-1">
							<div className="h-2 w-2 rounded-full bg-emerald-500" /> Crypto
						</div>
						<div className="flex items-center gap-1">
							<div className="h-2 w-2 rounded-full bg-amber-500" /> ETFS
						</div>
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
											<TableCell key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={6} className="h-24 text-center">
										No assets found in catalog.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="p-4 border-t flex justify-between items-center bg-gray-50/20">
					<div className="text-xs text-muted-foreground">
						{meta?.total ?? 0} Total Assets
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Previous
						</Button>
						<span className="text-sm font-medium text-slate-600">
							Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() === -1 ? 1 : table.getPageCount()}
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

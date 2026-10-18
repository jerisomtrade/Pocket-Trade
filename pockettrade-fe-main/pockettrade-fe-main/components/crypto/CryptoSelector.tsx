import React from "react";
import { Wallet } from "lucide-react";

// Shadcn UI Imports
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CryptoCurrency = {
  id: string;
  name: string;
  symbol: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  network?: string;
};

export const supportedCryptocurrencies: CryptoCurrency[] = [
  { id: "bitcoin",    name: "Bitcoin",      symbol: "BTC",  icon: Wallet },
  { id: "ethereum",   name: "Ethereum",     symbol: "ETH",  icon: Wallet },
  { id: "litecoin",   name: "Litecoin",     symbol: "LTC",  icon: Wallet },
  { id: "bnb",        name: "Binance Coin", symbol: "BNB",  icon: Wallet },
  { id: "solana",     name: "Solana",       symbol: "SOL",  icon: Wallet },
  { id: "xrp",        name: "XRP",          symbol: "XRP",  icon: Wallet },
  { id: "usdt_trc20", name: "USDT",         symbol: "USDT", icon: Wallet, network: "TRC20" },
  { id: "usdt_erc20", name: "USDT",         symbol: "USDT", icon: Wallet, network: "ERC20" },
];

type CryptoSelectorProps = {
  selectedCrypto: string;
  onSelectCrypto: (value: string | null) => void;
};

const CryptoSelector: React.FC<CryptoSelectorProps> = ({
  selectedCrypto,
  onSelectCrypto,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
        Select Cryptocurrency
      </label>
      <Select value={selectedCrypto} onValueChange={onSelectCrypto}>
        <SelectTrigger className="w-full h-14 px-4 rounded-2xl bg-slate-950/50 border border-white/10 text-white font-bold focus:ring-emerald-500/50 transition-all cursor-pointer">
          <SelectValue placeholder="Select cryptocurrency..." />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-white/10 text-white max-h-[300px]">
          {supportedCryptocurrencies.map((crypto) => (
            <SelectItem key={crypto.id} value={crypto.id}>
              {crypto.name} ({crypto.symbol}){crypto.network ? ` - ${crypto.network}` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CryptoSelector;

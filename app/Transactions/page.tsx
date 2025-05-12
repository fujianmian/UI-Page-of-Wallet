"use client"

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Sidebar } from "../../components/sidebar"

// 定义交易类型
type TransactionType = 'mint' | 'burn' | 'transfer' | 'swap';

// 定义交易记录接口
interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: Date;
}

interface TransactionsTableProps {
  limit?: number;
  showSearch?: boolean;
  showPagination?: boolean;
  title?: string;
}

// 自定义格式化日期的函数代替 date-fns
function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${month}-${day} ${hours}:${minutes}`;
}

export default function TransactionsTableDemo() {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r border-amber-400">
        <Sidebar />
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <TransactionsTable />
      </div>
    </div>
  );
}


function TransactionsTable({
  limit = 5,
  showSearch = true,
  showPagination = true,
  title = "Recent Transaction"
}: TransactionsTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const itemsPerPage = limit;

  useEffect(() => {
    // 模拟从API获取数据
    const fetchTransactions = async () => {
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 生成模拟数据
        const mockTransactions: Transaction[] = Array.from({ length: 20 }, (_, i) => {
          const types: TransactionType[] = ['mint', 'burn', 'transfer', 'swap'];
          const randomType = types[Math.floor(Math.random() * types.length)];
          const randomAmount = parseFloat((Math.random() * 1000).toFixed(2));
          const randomDate = new Date();
          randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 14));
          
          return {
            id: `0x${Math.random().toString(16).substring(2, 10)}`,
            type: randomType,
            amount: randomAmount,
            timestamp: randomDate
          };
        });
        
        // 按时间排序，最近的在前
        mockTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // 根据搜索条件筛选交易
  useEffect(() => {
    if (!searchTerm) {
      setFilteredTransactions(transactions);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const results = transactions.filter(item => 
      item.id.toLowerCase().includes(term) || 
      item.amount.toString().includes(term) ||
      item.type.toLowerCase().includes(term)
    );
    
    setFilteredTransactions(results);
    setCurrentPage(1); // 重置到第一页
  }, [searchTerm, transactions]);

  // 获取当前页面的交易
  const getCurrentTransactions = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  };

  // 计算总页数
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // 根据交易类型返回相应的文字样式
  const getTypeColor = (): string => {
    // 所有类型都使用深棕色文字 (#573900)
    return 'text-amber-900';
  };

  // 根据交易类型返回相应的背景样式
  const getTypeBackgroundColor = (type: TransactionType): string => {
    switch (type) {
      case 'mint':
        return 'bg-amber-400'; // 使用主题黄色
      case 'burn':
        return 'bg-amber-300'; // 使用主题黄色透明度70%
      case 'transfer':
        return 'bg-amber-200'; // 使用主题黄色透明度50%
      case 'swap':
        return 'bg-amber-100'; // 使用主题黄色透明度30%
      default:
        return 'bg-amber-50'; // 使用主题黄色透明度10%
    }
  };

  // 交易类型中文对照
  const getTypeLabel = (type: TransactionType | string): string => {
    switch (type) {
      case 'mint':
        return 'Mint';
      case 'burn':
        return 'Burn';
      case 'transfer':
        return 'Transfer';
      case 'swap':
        return 'Swap';
      default:
        return (type as string).toUpperCase();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-amber-400">
      <div className="flex justify-between items-center bg-amber-400 p-4">
      {/* <Sidebar /> */}
        <h2 className="font-medium text-amber-900">{title}</h2>
        
        {showSearch && (
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-amber-900" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-1.5 text-sm border border-amber-400 rounded-md bg-white placeholder-amber-900 placeholder-opacity-60 focus:outline-none focus:ring-amber-400 focus:border-amber-400"
              placeholder="Search Transaction"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-400"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 bg-amber-50 p-3 text-sm font-medium text-amber-900">
            <div>Type</div>
            <div>Amount ($)</div>
            <div>Date Time</div>
          </div>
          
          {getCurrentTransactions().length > 0 ? (
            <div className="divide-y divide-amber-200">
              {getCurrentTransactions().map((transaction) => (
                <div key={transaction.id} className="grid grid-cols-3 p-3 hover:bg-amber-50 text-sm">
                  <div className="mb-1 md:mb-0">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${getTypeColor()} ${getTypeBackgroundColor(transaction.type)}`}>
                      {getTypeLabel(transaction.type)}
                    </span>
                    <span className="text-xs text-amber-900 opacity-70 ml-2 hidden md:inline">
                      {transaction.id.substring(0, 6)}...
                    </span>
                  </div>
                  <div className="font-medium text-amber-900">
                    {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-amber-900 opacity-80 text-xs">
                    {formatDate(transaction.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-amber-900">
              No Transaction Record Found
            </div>
          )}
          
          {showPagination && totalPages > 1 && (
            <div className="flex items-center justify-between p-3 bg-amber-50 border-t border-amber-200">
              <div className="text-xs text-amber-900">
                Page {currentPage}，Total {totalPages} Page
              </div>
              <div className="flex">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center px-2 py-1 text-xs border border-amber-400 rounded-md text-amber-900 bg-white mr-2 ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-50'
                  }`}
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center px-2 py-1 text-xs border border-amber-400 rounded-md text-amber-900 bg-white ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-50'
                  }`}
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
"use client"

import { useState } from "react";
// import { Sidebar } from './Sidebar'; // 假设Sidebar组件的位置
// import TransactionsTableDemo from './TransactionsTable'; // 假设TransactionsTable组件的位置
import { ChevronDown, Send, Check } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export default function TransactionPage() {
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("usdc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const assets = [
    { id: "usdc", name: "USDC", icon: "💵" },
    { id: "usdt", name: "USDT", icon: "💴" }
  ];

  const handleTransfer = async (e: { preventDefault: () => void; }) => {
    if (e) e.preventDefault();
    if (!receiverAddress || !amount) return;
    
    setIsSubmitting(true);
    
    // 模拟API调用
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Transferring", amount, selectedAsset, "to", receiverAddress);
      
      // 显示成功状态
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        // 重置表单
        setReceiverAddress("");
        setAmount("");
      }, 2000);
    } catch (error) {
      console.error("Transfer error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F4EF]">
      {/* 侧边栏 */}
      <Sidebar />
      
      {/* 主内容区 */}
      <div className="flex-1 ml-0 md:ml-64 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-[#573900] mb-6">Transfer</h1>
          
          {/* 转账表单卡片 */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-[#F1B62A] mb-8">
            <div className="bg-[#F1B62A] p-4">
              <h2 className="font-medium text-[#573900]">Sending Accets</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* 接收地址 */}
              <div className="space-y-2">
                <label htmlFor="receiver" className="block text-sm font-medium text-[#573900]">
                  Receiver Address
                </label>
                <input
                  id="receiver"
                  type="text"
                  value={receiverAddress}
                  onChange={(e) => setReceiverAddress(e.target.value)}
                  placeholder="Receiver Address"
                  className="w-full px-4 py-2 border border-[#F1B62A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F1B62A]"
                />
              </div>
              
              {/* 金额和资产选择 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 金额输入 */}
                <div className="space-y-2">
                  <label htmlFor="amount" className="block text-sm font-medium text-[#573900]">
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-[#F1B62A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F1B62A]"
                  />
                </div>
                
                {/* 资产选择下拉框 */}
                <div className="space-y-2">
                  <label htmlFor="asset" className="block text-sm font-medium text-[#573900]">
                    Assets
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-2 bg-white border border-[#F1B62A] rounded-md focus:outline-none focus:ring-2 focus:ring-[#F1B62A]"
                    >
                      <div className="flex items-center">
                        <span className="mr-2">
                          {assets.find(a => a.id === selectedAsset)?.icon}
                        </span>
                        <span className="font-medium">
                          {assets.find(a => a.id === selectedAsset)?.name}
                        </span>
                      </div>
                      <ChevronDown size={16} className="text-[#573900]" />
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#F1B62A] rounded-md shadow-lg">
                        {assets.map((asset) => (
                          <button
                            key={asset.id}
                            type="button"
                            className="w-full flex items-center px-4 py-2 text-left hover:bg-[#F5F4EF]"
                            onClick={() => {
                              setSelectedAsset(asset.id);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <span className="mr-2">{asset.icon}</span>
                            <span className="font-medium">{asset.name}</span>
                            {selectedAsset === asset.id && (
                              <Check size={16} className="ml-auto text-[#F1B62A]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 转账按钮 */}
              <div className="pt-4">
                <button
                  onClick={handleTransfer}
                  disabled={isSubmitting || !receiverAddress || !amount}
                  className={`w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-2 rounded-md font-medium text-[#573900] ${
                    isSuccess
                      ? "bg-green-500 text-white"
                      : isSubmitting || !receiverAddress || !amount
                      ? "bg-[#F1B62A] opacity-50 cursor-not-allowed"
                      : "bg-[#F1B62A] hover:bg-[#F1B62A]/80"
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <Check size={18} />
                      <span>Transfer Successfully</span>
                    </>
                  ) : isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#573900] border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Transfer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* 交易记录表格 */}
          {/* <h2 className="text-xl font-medium text-[#573900] mb-4">交易记录</h2> */}
          {/* <TransactionsTableDemo /> */}
        </div>
      </div>
    </div>
  );
}
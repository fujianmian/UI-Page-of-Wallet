"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Sidebar } from "../../components/sidebar"

export default function SettingsPage() {
  const [walletAddress, setWalletAddress] = useState("")
  const router = useRouter()

  useEffect(() => {
    // 模拟：从 localStorage 或 API 获取钱包地址
    const address = localStorage.getItem("walletAddress") || "0x1234...ABCD"
    setWalletAddress(address)
  }, [])

  const handleLogout = () => {
    // 清除登录状态
    localStorage.removeItem("walletAddress")
    router.push("/")
  }

  return (
    <div className="bg-[#F5F4EF] min-h-screen">
      <Sidebar />

      <div className="md:ml-64 p-6 md:p-10">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow border border-gray-100">
          <h1 className="text-3xl font-bold text-[#573900] mb-8">Settings</h1>

          <div className="mb-6">
            <Label htmlFor="wallet" className="text-lg font-medium text-[#573900] mb-2 block">
              Your Wallet Address:
            </Label>
            <Input
              id="wallet"
              value={walletAddress}
              readOnly
              className="bg-[#F5F4EF] border-[#573900]/20 text-gray-700"
            />
          </div>

          <Button
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

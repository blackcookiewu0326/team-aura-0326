import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const LoginView = ({ onLogin, loading, onInitialize }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 保持原本的密碼邏輯 (使用者要求不更動)
  const handleLogin = (e) => {
    e?.preventDefault(); // 防止表單預設刷新
    // 如果密碼少於 6 位，自動補上後綴
    const finalPassword = password.length < 6 ? password + "_teamaura" : password;
    onLogin(username, finalPassword);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center relative pt-8 pb-8">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="text-6xl mb-4">🌀</div>
        <h1 className="text-2xl font-black text-slate-800 mb-1">Team Aura 波導戰隊</h1>
        <h1 className="text-xl font-black text-slate-800 mb-3">Pokémon GO 任務上傳系統</h1>
        <p className="text-red-500 text-xs mb-1">* 帳號中的英文字，請一律改為小寫</p>
        <p className="text-gray-400 text-xs mb-3">(密碼大小寫按照你原先的設定，不須變動)</p>
        <p className="text-gray-400 text-xs mb-3">* 無帳密、無法登入、忘記密碼等疑難雜症請直接找蘭斯</p>
        
        {/* 優化：使用 form 標籤，提升手機輸入體驗 */}
        <form onSubmit={handleLogin} className="space-y-3 mb-6">
          <input 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 transition-colors" 
            placeholder="帳號" 
            required
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 transition-colors" 
            placeholder="密碼" 
            required
          />
          <Button type="submit" disabled={loading} className="w-full py-3.5">
            {loading ? '登入中...' : '登入'}
          </Button>
        </form>

    
      </Card>
    </div>
  );
};
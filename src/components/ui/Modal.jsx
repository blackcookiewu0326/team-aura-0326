import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../Icons';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // 防止背景滾動
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* 遮罩層：深色半透明背景，帶有模糊效果 */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* 視窗本體 */}
            {/* 修改：使用 bg-white dark:bg-slate-900 並加上 border 確保在深色模式下的邊界感 */}
            <div className={`relative w-full ${maxWidth} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 transform transition-all flex flex-col max-h-[90vh] animate-fadeIn`}>
                
                {/* 標題列 */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white truncate">
                        {title}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
                    >
                        <Icon name="X" className="w-5 h-5" />
                    </button>
                </div>

                {/* 內容區域：自帶捲軸 */}
                <div className="p-4 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
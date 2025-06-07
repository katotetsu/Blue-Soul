'use client';

import { useEffect, useState } from 'react';
import { ToastProps } from './types';

export default function Toast({
    message,
    show,
    duration = 2500,
    onClose,
}: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(onClose, 300); // アニメーション終了後に非表示処理
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show && !visible) return null;

    return (
        <div className="mt-4 px-5 py-2 text-base text-blue-800 border border-blue-300 bg-blue-50/80 rounded-xl shadow-sm transition-all backdrop-blur-sm">
            {message}
        </div>
    );
}

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassFolderProps {
    label: string;
    icon?: ReactNode;
    itemCount?: number;
    onClick?: () => void;
    color?: string;
}

export function GlassFolder({ label, icon, itemCount, onClick, color = 'bg-blue-500' }: GlassFolderProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, rotateX: 10, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="relative cursor-pointer group w-32 h-28 sm:w-40 sm:h-36 perspective-1000"
        >
            {/* Back Plate */}
            <div className={`absolute inset-0 rounded-2xl ${color} opacity-20 backdrop-blur-md border border-white/10 shadow-lg transform translate-z-[-10px]`} />

            {/* Middle Content/Paper Effect */}
            <div className="absolute inset-x-4 top-4 bottom-2 bg-white/5 rounded-t-lg opacity-50" />
            <div className="absolute inset-x-3 top-3 bottom-2 bg-white/5 rounded-t-lg opacity-70" />

            {/* Front Plate */}
            <div className={`absolute inset-0 top-3 rounded-2xl ${color} bg-opacity-30 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden flex flex-col items-center justify-center p-4 transition-all group-hover:bg-opacity-40`}>
                <div className="text-white mb-2 drop-shadow-md">
                    {icon}
                </div>
                <span className="text-sm font-bold text-white drop-shadow-md text-center line-clamp-1">{label}</span>
                {itemCount !== undefined && (
                    <span className="text-[10px] uppercase font-black text-white/60 bg-black/20 px-2 py-0.5 rounded mt-1">
                        {itemCount} Items
                    </span>
                )}
            </div>

            {/* Reflection/Shine */}
            <div className="absolute inset-0 top-3 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        </motion.div>
    );
}

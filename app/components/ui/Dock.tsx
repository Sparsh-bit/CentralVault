'use client';

import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';

interface DockProps {
    items: {
        icon: React.ReactNode;
        label: string;
        onClick: () => void;
        isActive?: boolean;
    }[];
}

export function Dock({ items }: DockProps) {
    const mouseX = useMotionValue(Infinity);

    return (
        <div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="flex h-16 items-end gap-4 rounded-2xl bg-white/10 px-4 pb-3 backdrop-blur-md border border-white/20 shadow-2xl mx-auto w-fit"
        >
            {items.map((item, i) => (
                <DockIcon key={i} mouseX={mouseX} {...item} />
            ))}
        </div>
    );
}

function DockIcon({
    mouseX,
    icon,
    label,
    onClick,
    isActive
}: {
    mouseX: MotionValue<number>;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    isActive?: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <motion.div
            ref={ref}
            style={{ width }}
            className={`aspect-square rounded-full flex items-center justify-center cursor-pointer relative group ${isActive ? 'bg-indigo-500 shadow-lg shadow-indigo-500/50' : 'bg-white/10 hover:bg-white/20'}`}
            onClick={onClick}
            whileHover={{ y: -10 }}
        >
            <div className="w-6 h-6 text-white flex items-center justify-center">
                {icon}
            </div>

            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {label}
            </div>

            {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-white rounded-full" />}
        </motion.div>
    );
}

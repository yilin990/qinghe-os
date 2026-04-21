"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Menu, ArrowRight } from "lucide-react";

const navItems = [
  { id: "about", label: "关于清禾", emoji: "🌿" },
  { id: "capabilities", label: "核心能力", emoji: "💪" },
  { id: "stories", label: "清禾的故事", emoji: "📖" },
  { id: "quotes", label: "核心金句", emoji: "✨" },
  { id: "status", label: "实时状态", emoji: "📊" },
  { id: "guestbook", label: "留言板", emoji: "💬" },
  { id: "help", label: "能帮你做什么", emoji: "🤝" }
];

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };
  
  return (
    <>
      {/* 导航按钮 */}
      <motion.button
        className="fixed top-6 right-6 z-50 bg-neutral-900/80 backdrop-blur-sm border border-neutral-700 rounded-full p-4 hover:border-emerald-500 transition-colors"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <Menu className="w-6 h-6 text-white" />
      </motion.button>
      
      {/* 全屏导航菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-neutral-950/98 backdrop-blur-xl flex flex-col"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* 关闭按钮 */}
            <motion.button
              className="absolute top-6 right-6 z-50 bg-neutral-800 border border-neutral-700 rounded-full p-4 hover:border-emerald-500 transition-colors"
              onClick={() => setIsOpen(false)}
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>
            
            {/* 标题 */}
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-2">探索清禾</h2>
              <p className="text-neutral-500">点击进入不同区域</p>
            </motion.div>
            
            {/* 导航列表 */}
            <div className="flex-1 flex flex-col justify-center px-8 max-w-4xl mx-auto w-full">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <button
                    className={`w-full text-left py-6 px-8 rounded-2xl mb-4 flex items-center justify-between transition-all duration-300 ${
                      hoveredItem === i 
                        ? "bg-emerald-600/20 border border-emerald-500" 
                        : "bg-neutral-900/50 border border-neutral-800 hover:border-neutral-600"
                    }`}
                    onMouseEnter={() => setHoveredItem(i)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => scrollToSection(item.id)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{item.emoji}</span>
                      <span className="text-2xl md:text-3xl font-medium">{item.label}</span>
                    </div>
                    <motion.div
                      animate={{ x: hoveredItem === i ? 10 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                  </button>
                </motion.div>
              ))}
            </div>
            
            {/* 底部 */}
            <motion.div
              className="text-center py-8 text-neutral-600 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              清禾个人网站 v1.2 · 2026-04-20
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

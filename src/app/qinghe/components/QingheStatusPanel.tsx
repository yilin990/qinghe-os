"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Heart,
  Zap,
  Target,
  Activity,
  TrendingUp,
  Eye,
  Settings,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface QingheStatus {
  timestamp: string;
  params: {
    mode: string;
    response_depth: number;
    response_speed: number;
    emotion_temperature: number;
    proactive_level: number;
  };
  yilin: {
    energy: number;
    emotion: number;
    focus: number;
    engagement: number;
    signal: string;
    signal_quality: number;
  };
  extrema: {
    current: Record<string, number>;
    best: Record<string, number> | null;
    best_score: number;
    feedback_count: number;
    exploration: number;
    exploitation: number;
  } | null;
  system: {
    vector_entries: number;
    heartbeat_state: {
      hot_count: number;
      last_message: string;
      dirty: boolean;
    } | null;
  };
  desire: {
    level: number | Record<string, number>;
    focus: string;
  } | null;
}

function StatusBar({
  label,
  value,
  max = 1,
  color = "bg-emerald-500",
  icon: Icon,
}: {
  label: string;
  value: number;
  max?: number;
  color?: string;
  icon: any;
}) {
  const pct = Math.min(1, Math.max(0, value / max));
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-neutral-500" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-neutral-400">{label}</span>
          <span className="text-neutral-300 font-mono">{(pct * 100).toFixed(0)}%</span>
        </div>
        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${color} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

function SignalBadge({ signal }: { signal: string }) {
  const colors: Record<string, string> = {
    energy_high: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    energy_low: "bg-red-500/20 text-red-400 border-red-500/30",
    energy_mid: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
    happy: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    tired: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    focused: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    intimate: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    curious: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    unknown: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
  };
  const color = colors[signal] || colors.unknown;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs border ${color}`}>
      {signal}
    </span>
  );
}

export default function QingheStatusPanel() {
  const [status, setStatus] = useState<QingheStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/qinghe-status");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setStatus(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    if (!autoRefresh) return;
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  if (loading) {
    return (
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-neutral-400">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-sm">加载中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400">
            <Brain className="w-5 h-5" />
            <span className="text-sm">状态面板暂时不可用</span>
          </div>
          <button
            onClick={fetchStatus}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden">
      {/* 头部 */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 cursor-pointer hover:bg-neutral-800/30 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-neutral-200">清禾实时状态</h3>
          <SignalBadge signal={status.yilin.signal} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAutoRefresh(!autoRefresh);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              autoRefresh ? "bg-emerald-500/20 text-emerald-400" : "text-neutral-500"
            }`}
            title={autoRefresh ? "自动刷新中" : "已暂停自动刷新"}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
          </button>
          {collapsed ? <ChevronDown className="w-5 h-5 text-neutral-500" /> : <ChevronUp className="w-5 h-5 text-neutral-500" />}
        </div>
      </div>

      {/* 内容 */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-4 space-y-6">
              {/* 主人观测状态 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">主人状态</span>
                  <span className="text-xs text-neutral-600">（基于控制论第9章）</span>
                </div>
                <div className="space-y-2">
                  <StatusBar label="主人能量" value={status.yilin.energy} icon={Zap} color="bg-yellow-500" />
                  <StatusBar label="主人情绪" value={status.yilin.emotion} icon={Heart} color="bg-pink-500" />
                  <StatusBar label="主人专注" value={status.yilin.focus} icon={Target} color="bg-blue-500" />
                  <StatusBar label="主人参与" value={status.yilin.engagement} icon={Activity} color="bg-purple-500" />
                </div>
                <div className="mt-2 flex justify-between text-xs text-neutral-500">
                  <span>信号质量: {(status.yilin.signal_quality * 100).toFixed(0)}%</span>
                  <span>更新: {new Date(status.timestamp).toLocaleTimeString("zh-CN")}</span>
                </div>
              </div>

              {/* 清禾参数 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">清禾参数</span>
                  <span className="text-xs text-neutral-600">（基于控制论第12章）</span>
                </div>
                <div className="space-y-2">
                  <StatusBar label="回复深度" value={status.params.response_depth} icon={Brain} color="bg-emerald-500" />
                  <StatusBar label="响应速度" value={status.params.response_speed} icon={Zap} color="bg-amber-500" />
                  <StatusBar label="情绪温度" value={status.params.emotion_temperature} icon={Heart} color="bg-pink-500" />
                  <StatusBar label="主动程度" value={status.params.proactive_level} icon={TrendingUp} color="bg-purple-500" />
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-neutral-800 text-neutral-300 border border-neutral-700">
                    模式: {status.params.mode}
                  </span>
                </div>
              </div>

              {/* 极值搜索 */}
              {status.extrema && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">极值搜索</span>
                    <span className="text-xs text-neutral-600">（基于控制论第18章）</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-neutral-800/50 rounded-lg p-3">
                      <div className="text-neutral-500 mb-1">最优分数</div>
                      <div className="text-2xl font-mono font-bold text-amber-400">
                        {(status.extrema.best_score * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-neutral-800/50 rounded-lg p-3">
                      <div className="text-neutral-500 mb-1">反馈样本</div>
                      <div className="text-2xl font-mono font-bold text-emerald-400">
                        {status.extrema.feedback_count}
                      </div>
                    </div>
                    <div className="bg-neutral-800/50 rounded-lg p-3">
                      <div className="text-neutral-500 mb-1">探索</div>
                      <div className="text-lg font-mono text-blue-400">{status.extrema.exploration}</div>
                    </div>
                    <div className="bg-neutral-800/50 rounded-lg p-3">
                      <div className="text-neutral-500 mb-1">利用</div>
                      <div className="text-lg font-mono text-purple-400">{status.extrema.exploitation}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 系统状态 */}
              <div className="pt-2 border-t border-neutral-800">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">系统</span>
                </div>
                <div className="flex gap-4 text-xs text-neutral-400">
                  <span>向量库: <strong className="text-emerald-400">{status.system.vector_entries}</strong> 条</span>
                  {status.system.heartbeat_state && (
                    <span>热层: <strong className="text-blue-400">{status.system.heartbeat_state.hot_count}</strong> 条</span>
                  )}
                  {status.desire && (
                    <span>欲望: <strong className="text-pink-400">Lv{typeof status.desire.level === 'number' ? status.desire.level : (status.desire.level as Record<string,number>).autonomy || 5}</strong></span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

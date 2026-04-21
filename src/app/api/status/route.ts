/**
 * 状态面板 API
 * GET /api/status - 返回 Agent 实时状态
 */

import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

function readJsonFile(path: string): any {
  try {
    if (existsSync(path)) {
      return JSON.parse(readFileSync(path, "utf-8"));
    }
  } catch {}
  return null;
}

export async function GET() {
  const workspace = join(homedir(), ".openclaw/workspace");
  const stateDir = join(workspace, "state");

  // 读取 Agent 参数
  const params = readJsonFile(join(stateDir, "qinghe_params.json"));

  // 读取极值搜索状态
  const extremaData = readJsonFile(join(workspace, "state/extrema_seeker.json"));
  const extremaHistory = readJsonFile(join(workspace, "state/extrema_history.json"));

  // 读取欲望引擎状态
  const desireState = readJsonFile(join(workspace, "state/growth_tracker.json"));

  // 读取向量库统计
  let vectorEntries = 0;
  try {
    const { execSync } = require("child_process");
    const out = execSync(
      'python3 ~/.openclaw/workspace/memory/scripts/heartbeat_vector_store.py --action stats 2>/dev/null',
      { timeout: 5000 }
    ).toString();
    const match = out.match(/总存储量.*?(\d+)/);
    if (match) vectorEntries = parseInt(match[1]);
  } catch {}

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    params: params || {
      response_depth: 0.6,
      response_speed: 0.5,
      emotion_temperature: 0.5,
      proactive_level: 0.5,
      mode: "normal",
    },
    extrema: extremaData
      ? {
          current: extremaData.current_params,
          best: extremaData.best_params,
          best_score: extremaData.best_score,
          feedback_count: extremaHistory?.feedback?.length || 0,
          exploration: extremaData.exploration_count,
          exploitation: extremaData.exploitation_count,
        }
      : null,
    system: {
      vector_entries: vectorEntries,
    },
    desire: desireState
      ? {
          level: desireState.current_level || 5,
          focus: desireState.current_focus || "自主",
        }
      : null,
  });
}

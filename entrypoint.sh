#!/bin/sh
set -e

CHECK_TIME="${CHECK_TIME:-08:00}"

echo "========================================"
echo "  Dounai Auto Check-in"
echo "  每日执行时间: ${CHECK_TIME}"
echo "========================================"

# 计算到下一次目标时间的秒数
next_sleep() {
  target_hour=$(echo "$CHECK_TIME" | cut -d: -f1)
  target_min=$(echo "$CHECK_TIME" | cut -d: -f2)

  now_sec=$(date +%s)
  target_sec=$(date -d "$(date +%Y-%m-%d) ${target_hour}:${target_min}:00" +%s 2>/dev/null || echo 0)

  if [ "$target_sec" -le "$now_sec" ]; then
    # 目标时间已过，取明天同一时间
    target_sec=$(date -d "tomorrow ${target_hour}:${target_min}:00" +%s 2>/dev/null || echo 0)
  fi

  echo $((target_sec - now_sec))
}

while true; do
  SLEEP_SEC=$(next_sleep)
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 距离下次执行还有 ${SLEEP_SEC}s ($((SLEEP_SEC / 3600))h $(((SLEEP_SEC % 3600) / 60))m)"
  sleep "${SLEEP_SEC}"

  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 开始执行签到..."
  node /app/src/cli.js start || true
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 本次签到完成"

  # 执行后短暂休眠避免重复触发
  sleep 60
done

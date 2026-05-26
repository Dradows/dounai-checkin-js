#!/bin/sh
set -e

CHECK_TIME="${CHECK_TIME:-08:00}"

echo "========================================"
echo "  Dounai Auto Check-in"
echo "  每日执行时间: ${CHECK_TIME}"
echo "========================================"

# 计算到下一次目标时间的秒数（兼容 Alpine/BusyBox）
next_sleep() {
  # 去除前导零防止被当作八进制
  target_hour=$(echo "$CHECK_TIME" | cut -d: -f1 | sed 's/^0\+//'); target_hour=${target_hour:-0}
  target_min=$(echo "$CHECK_TIME" | cut -d: -f2 | sed 's/^0\+//'); target_min=${target_min:-0}

  # 当前本地时间的时分秒
  now_hour=$(date +%H | sed 's/^0\+//'); now_hour=${now_hour:-0}
  now_min=$(date +%M | sed 's/^0\+//'); now_min=${now_min:-0}
  now_sec=$(date +%S | sed 's/^0\+//'); now_sec=${now_sec:-0}

  # 转为秒数（从当天 00:00 起算）
  now_total=$((now_hour * 3600 + now_min * 60 + now_sec))
  target_total=$((target_hour * 3600 + target_min * 60))

  if [ "$target_total" -gt "$now_total" ]; then
    # 今天还没到目标时间
    echo $((target_total - now_total))
  else
    # 目标时间已过，等到明天
    echo $((86400 - now_total + target_total))
  fi
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

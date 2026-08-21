#!/usr/bin/env bash
# Re-encodes the hero clip for the web. Run from anywhere; needs ffmpeg with
# libsvtav1 and libx264.
#
#   bash scripts/encode-hero-video.sh ../resources/osteo-vid.mp4
#
# Source (2026-08-21): 464x640, 24 fps, 6.04 s, H.264 + AAC + cover art, 603 kB.
# Output: 66 kB AV1 + 79 kB H.264. Browsers download exactly one of the two.
set -euo pipefail

SRC="${1:-../resources/osteo-vid.mp4}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/media"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# The clip does not end where it starts, so a plain `loop` would visibly jump.
# Build a seamless loop instead:
#
#   D = source duration, F = crossfade length
#   loop = S[F .. D-F]  followed by  crossfade(S[D-F .. D] -> S[0 .. F])
#
# The crossfade ends on S(F), which is exactly where the loop begins, so the
# wrap is invisible. Ordering it this way also means frame 0 of the loop is the
# opening pose — the one that matches the poster photograph — so the moment the
# video fades in over the still there is no jump in the sculpture's position.
D=6.041667
F=0.5
MID_END=$(python -c "print($D - $F)")

ffmpeg -y -v error -i "$SRC" -filter_complex "
[0:v]trim=0:$F,setpts=PTS-STARTPTS[head];
[0:v]trim=$F:$MID_END,setpts=PTS-STARTPTS[mid];
[0:v]trim=$MID_END:$D,setpts=PTS-STARTPTS[tail];
[tail][head]blend=all_expr='A*(1-(T/$F))+B*(T/$F)'[cross];
[mid][cross]concat=n=2:v=1:a=0[out]" \
  -map "[out]" -an -c:v libx264 -crf 16 -preset slow "$TMP/master.mp4"

# `-an` throughout: the clip is decoration, and a silent track would also risk
# tripping autoplay policies. `-map 0:v:0` drops the embedded cover-art stream.
ffmpeg -y -v error -i "$TMP/master.mp4" -map 0:v:0 -an \
  -c:v libsvtav1 -preset 3 -crf 41 -g 400 -svtav1-params tune=0 \
  -pix_fmt yuv420p -movflags +faststart "$OUT/hero-sculpture.av1.mp4"

# Fallback for engines without AV1 — notably iPhones older than the A17.
ffmpeg -y -v error -i "$TMP/master.mp4" -map 0:v:0 -an \
  -c:v libx264 -preset veryslow -crf 32 -profile:v main -level 3.1 \
  -pix_fmt yuv420p -movflags +faststart "$OUT/hero-sculpture.h264.mp4"

ls -la "$OUT"

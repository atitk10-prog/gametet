import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PlayerAvatar, PlayerPosition, InteractivePoint } from '../types/game';
import { NPCS_DATA } from '../data/npcs';
import { sound } from '../services/sound';

interface VillageMapCanvasProps {
  avatar: PlayerAvatar;
  playerPosition: PlayerPosition;
  onUpdatePosition: (pos: PlayerPosition) => void;
  onInteractNpc: (npcId: string) => void;
  onInteractZone: (zoneId: string) => void;
  onInteractPoint: (point: InteractivePoint) => void;
  collectedPoints: string[];
  unlockedAreas: string[];
  onOpenGoiBanh: () => void;
  onOpenMarket: () => void;
  onOpenHouse: () => void;
  activeQuestTitle?: string;
  activeObjectiveText?: string;
}

// Map dimensions
export const WORLD_WIDTH = 1900;
export const WORLD_HEIGHT = 1200;

export const VillageMapCanvas: React.FC<VillageMapCanvasProps> = ({
  avatar,
  playerPosition,
  onUpdatePosition,
  onInteractNpc,
  onInteractZone,
  onInteractPoint,
  collectedPoints,
  unlockedAreas,
  onOpenGoiBanh,
  onOpenMarket,
  onOpenHouse,
  activeQuestTitle,
  activeObjectiveText,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Character physics state
  const posRef = useRef<PlayerPosition>({ ...playerPosition });
  const targetPosRef = useRef<{ x: number; y: number } | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const nearbyTargetRef = useRef<{ type: 'npc' | 'zone' | 'point'; id: string; name: string } | null>(null);
  const [nearbyTarget, setNearbyTarget] = useState<{ type: 'npc' | 'zone' | 'point'; id: string; name: string } | null>(null);

  // Joystick touch tracking
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const joystickVectorRef = useRef({ x: 0, y: 0 });

  // Floating particles (Spring blossom petals & smoke)
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; size: number; color: string; type: 'petal' | 'smoke' | 'sparkle'; life?: number }>>([]);

  // Initialize petals & environment
  useEffect(() => {
    const list: typeof particlesRef.current = [];
    for (let i = 0; i < 75; i++) {
      list.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        vx: 0.3 + Math.random() * 0.7,
        vy: 0.4 + Math.random() * 0.8,
        size: 3 + Math.random() * 4,
        color: Math.random() > 0.5 ? '#FBBF24' : '#F472B6', // Yellow Mai & Pink Dao
        type: 'petal',
      });
    }
    particlesRef.current = list;
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid capturing input if typing in an input
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      keysRef.current[e.key.toLowerCase()] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      // Interact on 'E' or Space
      if ((e.key.toLowerCase() === 'e' || e.key === ' ') && nearbyTargetRef.current) {
        handleInteract(nearbyTargetRef.current);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Interactive points in the world
  const interactivePoints: InteractivePoint[] = [
    { id: 'q_point_1', type: 'question', x: 740, y: 380, label: 'Đố Vui Cổng Làng', icon: '❓' },
    { id: 'q_point_2', type: 'question', x: 1250, y: 550, label: 'Đố Vui Cạnh Bờ Ruộng', icon: '❓' },
    { id: 'q_point_3', type: 'question', x: 620, y: 880, label: 'Đố Vui Vườn Hoa', icon: '❓' },
    { id: 'chest_garden', type: 'chest', x: 920, y: 860, label: 'Rương Quà Bé Mai', icon: '🎁' },
    { id: 'chest_market', type: 'chest', x: 1200, y: 350, label: 'Rương Lì Xì Chợ Tết', icon: '🧧' },
    { id: 'chal_hall', type: 'challenge', x: 880, y: 220, label: 'Bảng Thách Thấu Đình Làng', icon: '⭐' },
  ];

  // Specific zone spots
  const ZONES = [
    { id: 'home_zone', name: 'Nhà Của Em', x: 300, y: 300, width: 140, height: 120, color: '#FDE68A', action: onOpenHouse, icon: '🏠' },
    { id: 'kitchen_zone', name: 'Bếp Lửa Gói Bánh', x: 440, y: 460, width: 150, height: 130, color: '#FECACA', action: onOpenGoiBanh, icon: '🍲' },
    { id: 'market_zone', name: 'Chợ Tết Làng Quê', x: 1060, y: 440, width: 220, height: 170, color: '#FED7AA', action: onOpenMarket, icon: '🏪' },
    { id: 'garden_zone', name: 'Vườn Hoa Mai & Đào', x: 780, y: 840, width: 260, height: 180, color: '#BBF7D0', icon: '🌸' },
    { id: 'field_zone', name: 'Cánh Đồng Quê', x: 1450, y: 720, width: 280, height: 220, color: '#FEF08A', icon: '🌾' },
    { id: 'hall_zone', name: 'Đình Làng Cổ', x: 820, y: 170, width: 200, height: 150, color: '#DDD6FE', icon: '🏛️' },
    { id: 'boat_festival_zone', name: 'Bến Thuyền Hội Xuân (Khóa)', x: 1500, y: 220, width: 200, height: 150, color: '#E0E7FF', isLocked: !unlockedAreas.includes('boat_festival_zone'), icon: '🚣' },
  ];

  const handleInteract = (target: { type: 'npc' | 'zone' | 'point'; id: string; name: string }) => {
    sound.playClick();
    if (target.type === 'npc') {
      onInteractNpc(target.id);
    } else if (target.type === 'zone') {
      const z = ZONES.find((item) => item.id === target.id);
      if (z?.action) {
        z.action();
      } else {
        onInteractZone(target.id);
      }
    } else if (target.type === 'point') {
      const p = interactivePoints.find((item) => item.id === target.id);
      if (p) onInteractPoint(p);
    }
  };

  // Click / Tap to move handler
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert screen coordinates to world coordinates based on camera
    const camX = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, posRef.current.x - canvas.width / 2));
    const camY = Math.max(0, Math.min(WORLD_HEIGHT - canvas.height, posRef.current.y - canvas.height / 2));

    const worldTargetX = Math.max(40, Math.min(WORLD_WIDTH - 40, clickX + camX));
    const worldTargetY = Math.max(40, Math.min(WORLD_HEIGHT - 40, clickY + camY));

    targetPosRef.current = { x: worldTargetX, y: worldTargetY };
    sound.playTone(600, 'sine', 0.05, 0.02);
  };

  // Main Game Loop: Update physics & Render
  useEffect(() => {
    let animId: number;
    let stepCount = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updatePhysics = () => {
      const speed = 4.2;
      let dx = 0;
      let dy = 0;

      // 1. Keyboard movement
      const k = keysRef.current;
      if (k['arrowleft'] || k['a']) dx -= 1;
      if (k['arrowright'] || k['d']) dx += 1;
      if (k['arrowup'] || k['w']) dy -= 1;
      if (k['arrowdown'] || k['s']) dy += 1;

      // 2. Joystick movement
      if (joystickVectorRef.current.x !== 0 || joystickVectorRef.current.y !== 0) {
        dx = joystickVectorRef.current.x;
        dy = joystickVectorRef.current.y;
      }

      // If user inputs manual direction, cancel click-to-move target
      if (dx !== 0 || dy !== 0) {
        targetPosRef.current = null;
      } else if (targetPosRef.current) {
        // 3. Move towards click target
        const tX = targetPosRef.current.x;
        const tY = targetPosRef.current.y;
        const dist = Math.hypot(tX - posRef.current.x, tY - posRef.current.y);
        if (dist > 8) {
          dx = (tX - posRef.current.x) / dist;
          dy = (tY - posRef.current.y) / dist;
        } else {
          targetPosRef.current = null;
        }
      }

      const isMoving = dx !== 0 || dy !== 0;
      let direction = posRef.current.direction;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0.1) direction = 'right';
        else if (dx < -0.1) direction = 'left';
      } else {
        if (dy > 0.1) direction = 'down';
        else if (dy < -0.1) direction = 'up';
      }

      if (isMoving) {
        // Normalize diagonal speed
        const length = Math.hypot(dx, dy) || 1;
        const moveX = (dx / length) * speed;
        const moveY = (dy / length) * speed;

        const nextX = Math.max(50, Math.min(WORLD_WIDTH - 50, posRef.current.x + moveX));
        const nextY = Math.max(60, Math.min(WORLD_HEIGHT - 60, posRef.current.y + moveY));

        posRef.current.x = nextX;
        posRef.current.y = nextY;
        posRef.current.direction = direction;
        posRef.current.isMoving = true;

        stepCount++;
        if (stepCount % 16 === 0) {
          sound.playStep();
        }
      } else {
        posRef.current.isMoving = false;
      }

      // Check proximity to NPCs, points, zones
      let foundTarget: typeof nearbyTargetRef.current = null;

      // Check NPCs
      for (const [id, npc] of Object.entries(NPCS_DATA)) {
        const d = Math.hypot(npc.x - posRef.current.x, npc.y - posRef.current.y);
        if (d < 65) {
          foundTarget = { type: 'npc', id, name: npc.name };
          break;
        }
      }

      // Check Interactive Points if no NPC
      if (!foundTarget) {
        for (const pt of interactivePoints) {
          if (collectedPoints.includes(pt.id)) continue;
          const d = Math.hypot(pt.x - posRef.current.x, pt.y - posRef.current.y);
          if (d < 50) {
            foundTarget = { type: 'point', id: pt.id, name: pt.label };
            break;
          }
        }
      }

      // Check Zones
      if (!foundTarget) {
        for (const z of ZONES) {
          const inX = posRef.current.x >= z.x - 30 && posRef.current.x <= z.x + z.width + 30;
          const inY = posRef.current.y >= z.y - 30 && posRef.current.y <= z.y + z.height + 30;
          if (inX && inY) {
            foundTarget = { type: 'zone', id: z.id, name: z.name };
            break;
          }
        }
      }

      if (JSON.stringify(nearbyTargetRef.current) !== JSON.stringify(foundTarget)) {
        nearbyTargetRef.current = foundTarget;
        setNearbyTarget(foundTarget);
      }
    };

    const render = () => {
      if (!canvas) return;
      const width = canvas.width;
      const height = canvas.height;

      // Camera calculations (smooth clamp)
      const camX = Math.max(0, Math.min(WORLD_WIDTH - width, posRef.current.x - width / 2));
      const camY = Math.max(0, Math.min(WORLD_HEIGHT - height, posRef.current.y - height / 2));

      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // Translate camera
      ctx.translate(-camX, -camY);

      // 1. Draw Ground (Warm countryside terrain with village pathways)
      ctx.fillStyle = '#E8F5E9'; // lush spring grass
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Ground decorative grass tufts
      ctx.fillStyle = '#C8E6C9';
      for (let gx = 40; gx < WORLD_WIDTH; gx += 90) {
        for (let gy = 40; gy < WORLD_HEIGHT; gy += 90) {
          ctx.beginPath();
          ctx.arc(gx + ((gy * 17) % 35), gy + ((gx * 23) % 35), 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Village River & Stone Bridge (East edge)
      ctx.fillStyle = '#BAE6FD';
      ctx.beginPath();
      ctx.moveTo(1700, 0);
      ctx.bezierCurveTo(1660, 400, 1720, 800, 1680, WORLD_HEIGHT);
      ctx.lineTo(WORLD_WIDTH, WORLD_HEIGHT);
      ctx.lineTo(WORLD_WIDTH, 0);
      ctx.closePath();
      ctx.fill();

      // Water ripples
      ctx.strokeStyle = '#7DD3FC';
      ctx.lineWidth = 2;
      const rippleTime = Date.now() * 0.002;
      for (let ry = 50; ry < WORLD_HEIGHT; ry += 80) {
        const rx = 1730 + Math.sin(rippleTime + ry * 0.05) * 15;
        ctx.beginPath();
        ctx.moveTo(rx - 25, ry);
        ctx.lineTo(rx + 25, ry);
        ctx.stroke();
      }

      // Stone Bridge
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(1660, 260, 140, 50);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(1660, 255, 140, 6);
      ctx.fillRect(1660, 309, 140, 6);

      // 3. Dirt & Cobblestone Paths
      ctx.fillStyle = '#FDE68A'; // sunny sand/cobblestone path
      // Main central avenue
      ctx.fillRect(250, 420, 1050, 65);
      // North path to Communal Hall
      ctx.fillRect(780, 160, 70, 270);
      // South path to Garden
      ctx.fillRect(780, 480, 70, 420);
      // Path to Rice Fields
      ctx.fillRect(1150, 480, 70, 360);
      ctx.fillRect(1150, 720, 340, 65);

      // Path stones styling
      ctx.fillStyle = '#F59E0B';
      for (let px = 270; px < 1300; px += 45) {
        ctx.beginPath();
        ctx.arc(px, 452 + Math.sin(px) * 12, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Draw Specific Village Landmarks & Buildings
      // --- Zone 1: Nhà của em (Traditional tile house) ---
      const houseX = 260;
      const houseY = 240;
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(houseX - 5, houseY + 115, 210, 15);
      // Base walls
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(houseX, houseY + 40, 200, 80);
      // Traditional red brick roof
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.moveTo(houseX - 20, houseY + 45);
      ctx.lineTo(houseX + 100, houseY);
      ctx.lineTo(houseX + 220, houseY + 45);
      ctx.closePath();
      ctx.fill();
      // Roof ridge & tiles
      ctx.strokeStyle = '#991B1B';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Door & Windows
      ctx.fillStyle = '#B45309';
      ctx.fillRect(houseX + 80, houseY + 65, 40, 55);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(houseX + 25, houseY + 60, 35, 35);
      ctx.fillRect(houseX + 140, houseY + 60, 35, 35);
      // Red Tet Distichs on doors
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(houseX + 72, houseY + 65, 6, 45);
      ctx.fillRect(houseX + 122, houseY + 65, 6, 45);
      // Hanging lanterns on house
      drawLantern(ctx, houseX + 5, houseY + 46);
      drawLantern(ctx, houseX + 195, houseY + 46);
      // Signboard
      drawSign(ctx, houseX + 100, houseY + 135, '🏠 Nhà Của Em', '#B45309');

      // --- Zone 2: Bếp Lửa Nấu Bánh Chưng ---
      const kitX = 490;
      const kitY = 510;
      // Bamboo fence / stove area
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(kitX, kitY, 48, 0, Math.PI * 2);
      ctx.fill();
      // Stone hearth
      ctx.fillStyle = '#78716C';
      ctx.beginPath();
      ctx.arc(kitX, kitY, 32, 0, Math.PI * 2);
      ctx.fill();
      // Fire crackling (animated glow)
      const fireGlow = 0.7 + Math.sin(Date.now() * 0.01) * 0.3;
      ctx.fillStyle = `rgba(239, 68, 68, ${fireGlow})`;
      ctx.beginPath();
      ctx.arc(kitX, kitY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(kitX, kitY, 12, 0, Math.PI * 2);
      ctx.fill();
      // Giant Cauldron (Nồi gang nấu bánh chưng)
      ctx.fillStyle = '#1F2937';
      ctx.fillRect(kitX - 22, kitY - 26, 44, 30);
      ctx.fillRect(kitX - 26, kitY - 28, 52, 6);
      // Firewood pile
      ctx.fillStyle = '#78350F';
      ctx.fillRect(kitX + 38, kitY - 15, 25, 8);
      ctx.fillRect(kitX + 36, kitY - 8, 28, 8);
      drawSign(ctx, kitX, kitY + 45, '🍲 Bếp Nấu Bánh Chưng', '#DC2626');

      // Cauldron smoke generator
      if (Math.random() < 0.25) {
        particlesRef.current.push({
          x: kitX + (Math.random() - 0.5) * 15,
          y: kitY - 28,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -1.2 - Math.random() * 0.8,
          size: 4 + Math.random() * 6,
          color: 'rgba(220, 220, 220, 0.6)',
          type: 'smoke',
          life: 1,
        });
      }

      // --- Zone 3: Đình Làng & Cây Đa Cổ Thụ ---
      const hallX = 740;
      const hallY = 80;
      // Majestic Banyan Tree (Cây đa)
      ctx.fillStyle = '#713F12';
      ctx.fillRect(hallX + 260, hallY + 60, 28, 90);
      // Tree canopy
      ctx.fillStyle = '#15803D';
      ctx.beginPath();
      ctx.arc(hallX + 274, hallY + 60, 65, 0, Math.PI * 2);
      ctx.arc(hallX + 240, hallY + 70, 50, 0, Math.PI * 2);
      ctx.arc(hallX + 310, hallY + 70, 50, 0, Math.PI * 2);
      ctx.fill();

      // Đình Làng structure
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(hallX, hallY + 50, 220, 90);
      // Curved roof
      ctx.fillStyle = '#B91C1C';
      ctx.beginPath();
      ctx.moveTo(hallX - 25, hallY + 55);
      ctx.quadraticCurveTo(hallX + 110, hallY - 15, hallX + 245, hallY + 55);
      ctx.lineTo(hallX + 230, hallY + 65);
      ctx.quadraticCurveTo(hallX + 110, hallY + 10, hallX - 10, hallY + 65);
      ctx.closePath();
      ctx.fill();
      // Pillars
      ctx.fillStyle = '#7F1D1D';
      for (let px = hallX + 20; px <= hallX + 200; px += 45) {
        ctx.fillRect(px, hallY + 55, 12, 85);
      }
      drawSign(ctx, hallX + 110, hallY + 155, '🏛️ Đình Làng Cổ Kính', '#7C3AED');

      // --- Zone 4: Chợ Tết Làng Quê ---
      const mktX = 1000;
      const mktY = 360;
      // Stalls with colorful striped awnings
      drawStall(ctx, mktX, mktY, '#EF4444', '#FBBF24', '🌾 Nông Sản Bác Ba');
      drawStall(ctx, mktX + 140, mktY, '#3B82F6', '#93C5FD', '🌸 Hoa Xuân & Đèn Lồng');
      drawStall(ctx, mktX + 70, mktY + 110, '#10B981', '#A7F3D0', '🍃 Lá Dong & Dây Lạt');
      drawSign(ctx, mktX + 105, mktY + 225, '🏪 Chợ Tết Quê Hương', '#D97706');

      // --- Zone 5: Vườn Hoa Mai & Đào (Spring Flower Garden) ---
      const garX = 720;
      const garY = 780;
      // Floral plots
      ctx.fillStyle = '#86EFAC';
      ctx.beginPath();
      ctx.roundRect(garX, garY, 300, 200, 20);
      ctx.fill();
      // Flower blossoms
      for (let fx = garX + 30; fx < garX + 280; fx += 40) {
        for (let fy = garY + 30; fy < garY + 180; fy += 35) {
          const isMai = (fx + fy) % 2 === 0;
          ctx.fillStyle = isMai ? '#FACC15' : '#FB7185';
          ctx.beginPath();
          ctx.arc(fx + ((fy * 7) % 15), fy, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#EA580C';
          ctx.beginPath();
          ctx.arc(fx + ((fy * 7) % 15), fy, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      drawSign(ctx, garX + 150, garY + 215, '🌸 Vườn Hoa Mai & Đào', '#16A34A');

      // --- Zone 6: Cánh Đồng Lúa Quê (Rice Fields) ---
      const fldX = 1350;
      const fldY = 660;
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(fldX, fldY, 320, 240);
      // Rice paddies lines
      ctx.strokeStyle = '#CA8A04';
      ctx.lineWidth = 2;
      for (let ly = fldY + 20; ly < fldY + 240; ly += 25) {
        ctx.beginPath();
        ctx.moveTo(fldX, ly);
        ctx.lineTo(fldX + 320, ly);
        ctx.stroke();
      }
      // Dong leaf plants batch
      ctx.fillStyle = '#15803D';
      for (let lx = fldX + 20; lx < fldX + 280; lx += 35) {
        ctx.beginPath();
        ctx.ellipse(lx, fldY + 40, 10, 18, 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      drawSign(ctx, fldX + 160, fldY + 255, '🌾 Cánh Đồng & Rừng Lá Dong', '#854D0E');

      // --- Zone 7: Cổng Làng Rêu Phong (West Entry) ---
      const gateX = 120;
      const gateY = 400;
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(gateX, gateY, 35, 120);
      ctx.fillRect(gateX + 105, gateY, 35, 120);
      // Arch
      ctx.fillStyle = '#B91C1C';
      ctx.fillRect(gateX - 10, gateY - 20, 160, 30);
      drawSign(ctx, gateX + 70, gateY + 135, '🎋 Cổng Làng Đầu Xuân', '#475569');

      // --- Zone 8: Bến Thuyền Hội Xuân (Locked/Unlocked) ---
      const boatX = 1450;
      const boatY = 160;
      ctx.fillStyle = '#DBEAFE';
      ctx.fillRect(boatX, boatY, 180, 120);
      if (!unlockedAreas.includes('boat_festival_zone')) {
        // Red barrier tape
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(boatX, boatY + 60, 180, 12);
        drawSign(ctx, boatX + 90, boatY + 90, '🔒 Bến Thuyền (Mở sau)', '#DC2626');
      } else {
        drawSign(ctx, boatX + 90, boatY + 90, '🎉 Bến Thuyền Hội Xuân', '#2563EB');
      }

      // 5. Draw Interactive Points
      for (const pt of interactivePoints) {
        if (collectedPoints.includes(pt.id)) continue;
        const bob = Math.sin(Date.now() * 0.005 + pt.x) * 4;
        // Glow circle
        ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y + bob, 22, 0, Math.PI * 2);
        ctx.fill();

        // Icon badge
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pt.icon, pt.x, pt.y + bob);

        // Label
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#78350F';
        ctx.fillText(pt.label, pt.x, pt.y + bob + 26);
      }

      // 6. Draw NPCs
      for (const [id, npc] of Object.entries(NPCS_DATA)) {
        drawNpcSprite(ctx, npc);
      }

      // 7. Click Target indicator if any
      if (targetPosRef.current) {
        const pulse = 12 + Math.sin(Date.now() * 0.01) * 3;
        ctx.strokeStyle = '#22C55E';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(targetPosRef.current.x, targetPosRef.current.y, pulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 8. Draw Player Character
      drawPlayerSprite(ctx, posRef.current, avatar);

      // 9. Floating Petal Particles & Cauldron Smoke
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.type === 'smoke') {
          p.size += 0.15;
          p.life = (p.life ?? 1) - 0.018;
          ctx.fillStyle = `rgba(200, 200, 200, ${Math.max(0, p.life)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          if (p.life <= 0) {
            particlesRef.current.splice(i, 1);
          }
        } else {
          // Petal
          if (p.x > WORLD_WIDTH) p.x = 0;
          if (p.y > WORLD_HEIGHT) p.y = 0;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size, p.size * 0.55, 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 10. Proximity Interaction Bubble
      if (nearbyTargetRef.current) {
        const bubbleX = posRef.current.x;
        const bubbleY = posRef.current.y - 58;
        const text = `Chạm hoặc nhấn [E] để tương tác: ${nearbyTargetRef.current.name}`;

        ctx.font = 'bold 13px sans-serif';
        const txtWidth = ctx.measureText(text).width;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.beginPath();
        ctx.roundRect(bubbleX - txtWidth / 2 - 12, bubbleY - 14, txtWidth + 24, 28, 14);
        ctx.fill();

        ctx.fillStyle = '#FDE047';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, bubbleX, bubbleY);
      }

      ctx.restore();
    };

    const loop = () => {
      updatePhysics();
      render();
      onUpdatePosition({ ...posRef.current });
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [avatar, unlockedAreas, collectedPoints]);

  // Handle Canvas resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Virtual Joystick Handlers for Touch/Mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    setJoystickActive(true);
    setJoystickPos({ x: touchX, y: touchY });
    updateJoystickVector(touchX, touchY, touchX, touchY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!joystickActive) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    updateJoystickVector(touchX, touchY, joystickPos.x, joystickPos.y);
  };

  const handleTouchEnd = () => {
    setJoystickActive(false);
    joystickVectorRef.current = { x: 0, y: 0 };
  };

  const updateJoystickVector = (curX: number, curY: number, originX: number, originY: number) => {
    const maxRadius = 45;
    const dx = curX - originX;
    const dy = curY - originY;
    const dist = Math.hypot(dx, dy);

    if (dist === 0) {
      joystickVectorRef.current = { x: 0, y: 0 };
    } else {
      const clampDist = Math.min(dist, maxRadius);
      joystickVectorRef.current = {
        x: (dx / dist) * (clampDist / maxRadius),
        y: (dy / dist) * (clampDist / maxRadius),
      };
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-emerald-950 select-none">
      {/* 2D Game Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Mini Active Quest Tracker in Map Corner */}
      {activeQuestTitle && (
        <div className="absolute top-3 left-3 bg-amber-900/90 backdrop-blur-md border border-amber-400/60 rounded-xl px-3.5 py-2 text-amber-100 max-w-xs md:max-w-sm shadow-lg pointer-events-none transition-all">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <span>📜</span>
            <span className="truncate">{activeQuestTitle}</span>
          </div>
          {activeObjectiveText && (
            <p className="text-xs text-amber-100 font-medium mt-0.5 line-clamp-2">
              👉 {activeObjectiveText}
            </p>
          )}
        </div>
      )}

      {/* Minimap in Top Right */}
      <div className="absolute top-3 right-3 bg-stone-900/85 backdrop-blur-sm border border-stone-600 rounded-xl p-1.5 shadow-xl hidden sm:block pointer-events-none">
        <div className="text-[10px] font-bold text-amber-300 text-center mb-1">Bản Đồ Làng Tết</div>
        <div className="relative w-28 h-20 bg-emerald-900/90 rounded border border-stone-700 overflow-hidden">
          {/* Landmarks dots */}
          <div className="absolute w-2 h-2 rounded-full bg-red-500" style={{ left: '16%', top: '25%' }} title="Nhà" />
          <div className="absolute w-2 h-2 rounded-full bg-orange-500" style={{ left: '26%', top: '42%' }} title="Bếp" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-purple-500" style={{ left: '44%', top: '15%' }} title="Đình" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-amber-400" style={{ left: '55%', top: '35%' }} title="Chợ" />
          <div className="absolute w-2 h-2 rounded-full bg-pink-400" style={{ left: '42%', top: '72%' }} title="Vườn hoa" />
          <div className="absolute w-2 h-2 rounded-full bg-yellow-400" style={{ left: '76%', top: '65%' }} title="Cánh đồng" />
          {/* Player dot */}
          <div
            className="absolute w-2.5 h-2.5 rounded-full bg-white border-2 border-red-600 shadow-md transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
            style={{
              left: `${(playerPosition.x / WORLD_WIDTH) * 100}%`,
              top: `${(playerPosition.y / WORLD_HEIGHT) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* On-Screen Mobile Virtual Joystick */}
      <div
        className="absolute bottom-20 left-6 w-32 h-32 rounded-full border-2 border-white/30 bg-black/25 backdrop-blur-sm touch-none flex items-center justify-center sm:hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="w-12 h-12 rounded-full bg-amber-400/80 border-2 border-white shadow-lg pointer-events-none transition-transform duration-75"
          style={{
            transform: `translate(${joystickVectorRef.current.x * 35}px, ${joystickVectorRef.current.y * 35}px)`,
          }}
        />
        <div className="absolute text-[10px] text-white/50 font-bold pointer-events-none">DI CHUYỂN</div>
      </div>

      {/* Action / Interact Button for Mobile or Click */}
      {nearbyTarget && (
        <button
          onClick={() => handleInteract(nearbyTarget)}
          className="absolute bottom-24 right-6 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center gap-2 active:scale-95 animate-bounce transition-all z-20 cursor-pointer"
        >
          <span className="text-xl">✨</span>
          <span className="text-sm">Tương tác: {nearbyTarget.name}</span>
        </button>
      )}

      {/* Quick Village Teleport Shortcuts Bar */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/40 text-xs text-white max-w-[95vw] overflow-x-auto shadow-xl">
        <span className="text-amber-300 font-bold whitespace-nowrap mr-1">Đến nhanh:</span>
        <button
          onClick={() => { posRef.current.x = 320; posRef.current.y = 350; sound.playClick(); }}
          className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-200 transition-colors whitespace-nowrap"
        >
          🏠 Nhà em
        </button>
        <button
          onClick={() => { posRef.current.x = 480; posRef.current.y = 360; sound.playClick(); }}
          className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-200 transition-colors whitespace-nowrap"
        >
          👵 Bà Năm
        </button>
        <button
          onClick={() => { posRef.current.x = 500; posRef.current.y = 530; sound.playClick(); }}
          className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-200 transition-colors whitespace-nowrap"
        >
          🍲 Bếp bánh
        </button>
        <button
          onClick={() => { posRef.current.x = 1060; posRef.current.y = 440; sound.playClick(); }}
          className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-200 transition-colors whitespace-nowrap"
        >
          🏪 Chợ Tết
        </button>
        <button
          onClick={() => { posRef.current.x = 800; posRef.current.y = 230; sound.playClick(); }}
          className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-200 transition-colors whitespace-nowrap"
        >
          🏛️ Đình Làng
        </button>
        <button
          onClick={() => { posRef.current.x = 820; posRef.current.y = 860; sound.playClick(); }}
          className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-200 transition-colors whitespace-nowrap"
        >
          🌸 Vườn hoa
        </button>
        <button
          onClick={() => { posRef.current.x = 1450; posRef.current.y = 740; sound.playClick(); }}
          className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-200 transition-colors whitespace-nowrap"
        >
          🌾 Cánh đồng
        </button>
      </div>
    </div>
  );
};

// --- Helper Canvas Draw Functions ---

function drawPlayerSprite(ctx: CanvasRenderingContext2D, pos: PlayerPosition, avatar: PlayerAvatar) {
  const x = pos.x;
  const y = pos.y;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(x, y + 16, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bobbing animation if moving
  const bob = pos.isMoving ? Math.sin(Date.now() * 0.015) * 2.5 : 0;

  // Body / Traditional Áo Dài
  let coatColor = '#DC2626'; // Ao dai do
  if (avatar.outfit === 'ao_dai_gold') coatColor = '#D97706';
  if (avatar.outfit === 'ao_dai_blue') coatColor = '#2563EB';
  if (avatar.outfit === 'ao_ba_ba') coatColor = '#4B5563';

  ctx.fillStyle = coatColor;
  ctx.beginPath();
  ctx.roundRect(x - 10, y - 6 + bob, 20, 20, 4);
  ctx.fill();

  // Áo dài lower flap
  ctx.beginPath();
  ctx.moveTo(x - 10, y + 10 + bob);
  ctx.lineTo(x + 10, y + 10 + bob);
  ctx.lineTo(x + 8, y + 18 + bob);
  ctx.lineTo(x - 8, y + 18 + bob);
  ctx.closePath();
  ctx.fill();

  // White pants beneath
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(x - 7, y + 14 + bob, 5, 8);
  ctx.fillRect(x + 2, y + 14 + bob, 5, 8);

  // Head
  ctx.fillStyle = '#FED7AA'; // Skin
  ctx.beginPath();
  ctx.arc(x, y - 16 + bob, 11, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#1C1917';
  if (avatar.hairStyle === 'bun') {
    ctx.beginPath();
    ctx.arc(x, y - 26 + bob, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(x, y - 18 + bob, 11, Math.PI, Math.PI * 2);
  ctx.fill();

  // Hat (Khăn đóng or Nón lá)
  if (avatar.hat === 'khan_dong') {
    ctx.fillStyle = coatColor;
    ctx.beginPath();
    ctx.roundRect(x - 12, y - 28 + bob, 24, 7, 3);
    ctx.fill();
    ctx.fillStyle = '#FBBF24';
    ctx.fillRect(x - 10, y - 25 + bob, 20, 2);
  } else if (avatar.hat === 'non_la') {
    ctx.fillStyle = '#FDE68A';
    ctx.beginPath();
    ctx.moveTo(x - 18, y - 18 + bob);
    ctx.lineTo(x, y - 34 + bob);
    ctx.lineTo(x + 18, y - 18 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Face Eyes
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  if (pos.direction === 'left') {
    ctx.arc(x - 4, y - 16 + bob, 1.8, 0, Math.PI * 2);
  } else if (pos.direction === 'right') {
    ctx.arc(x + 4, y - 16 + bob, 1.8, 0, Math.PI * 2);
  } else {
    ctx.arc(x - 4, y - 16 + bob, 1.8, 0, Math.PI * 2);
    ctx.arc(x + 4, y - 16 + bob, 1.8, 0, Math.PI * 2);
  }
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#E11D48';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x, y - 12 + bob, 3, 0.1, Math.PI - 0.1);
  ctx.stroke();

  // Accessory in hand (e.g. Cành Mai)
  if (avatar.accessory === 'canh_mai') {
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 4 + bob);
    ctx.lineTo(x + 18, y - 6 + bob);
    ctx.stroke();
    // Yellow flower
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.arc(x + 18, y - 6 + bob, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawNpcSprite(ctx: CanvasRenderingContext2D, npc: any) {
  const x = npc.x;
  const y = npc.y;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(x, y + 16, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Gentle breathing idle
  const idle = Math.sin(Date.now() * 0.003 + x) * 1.5;

  // Outfit body
  ctx.fillStyle = npc.color || '#4B5563';
  ctx.beginPath();
  ctx.roundRect(x - 11, y - 6 + idle, 22, 22, 4);
  ctx.fill();

  // Head
  ctx.fillStyle = '#FED7AA';
  ctx.beginPath();
  ctx.arc(x, y - 16 + idle, 11, 0, Math.PI * 2);
  ctx.fill();

  // Avatar Icon Badge
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(npc.avatarIcon, x, y - 17 + idle);

  // Name Tag
  ctx.font = 'bold 11px sans-serif';
  ctx.fillStyle = '#0F172A';
  const nameWidth = ctx.measureText(npc.name).width;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.roundRect(x - nameWidth / 2 - 6, y - 38 + idle, nameWidth + 12, 16, 8);
  ctx.fill();
  ctx.strokeStyle = npc.color;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = npc.color;
  ctx.fillText(npc.name, x, y - 30 + idle);

  // Quest marker exclamation / question above head
  ctx.fillStyle = '#FBBF24';
  ctx.beginPath();
  ctx.arc(x, y - 48 + idle, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#78350F';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('!', x, y - 48 + idle);
}

function drawStall(ctx: CanvasRenderingContext2D, x: number, y: number, colorA: string, colorB: string, label: string) {
  // Wooden frame
  ctx.fillStyle = '#92400E';
  ctx.fillRect(x, y + 25, 8, 45);
  ctx.fillRect(x + 112, y + 25, 8, 45);
  ctx.fillRect(x, y + 45, 120, 25);

  // Striped Awning
  const stripes = 6;
  const w = 120 / stripes;
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? colorA : colorB;
    ctx.beginPath();
    ctx.moveTo(x + i * w, y);
    ctx.lineTo(x + (i + 1) * w, y);
    ctx.lineTo(x + (i + 1) * w - 4, y + 25);
    ctx.lineTo(x + i * w - 4, y + 25);
    ctx.closePath();
    ctx.fill();
  }

  // Label
  ctx.fillStyle = '#FEF3C7';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, x + 60, y + 60);
}

function drawLantern(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 10);
  ctx.stroke();

  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.ellipse(x, y + 18, 7, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FBBF24';
  ctx.fillRect(x - 5, y + 12, 10, 2);
  ctx.fillRect(x - 5, y + 22, 10, 2);
}

function drawSign(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, color: string) {
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const width = ctx.measureText(label).width;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  ctx.roundRect(x - width / 2 - 8, y - 10, width + 16, 20, 10);
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.fillText(label, x, y);
}

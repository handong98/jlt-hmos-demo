"use strict";

const routes = [
  {
    "id": "command",
    "title": "통합 관제",
    "subtitle": "공장, 물류, 설비 상태를 한 화면에서 모니터링"
  },
  {
    "id": "mes",
    "title": "MES 생산 관리",
    "subtitle": "작업 지시, 자재 흐름, 생산 미션 관리"
  },
  {
    "id": "quality",
    "title": "품질 관리",
    "subtitle": "검사 현황, 불량 분석, 품질 지표 관리"
  },
  {
    "id": "wms",
    "title": "WMS 물류 관제",
    "subtitle": "입출고, 재고, 물류 이동 상태 관리"
  },
  {
    "id": "robot",
    "title": "로봇 관제",
    "subtitle": "AMR 및 휴머노이드 로봇 운영 현황"
  }
];


function init_command() {
  
      (() => {
        const root = document.getElementById('jlt16-root');
        const main = root.querySelector('.main');
        const detail = root.querySelector('#detail');
        const title = root.querySelector('#page-title');
        const sub = root.querySelector('#page-sub');
        const dashboardSections = root.querySelectorAll('.dashboard-view');
        const prodView = root.querySelector('[data-prod-view]');
        const prodSubnav = root.querySelector('[data-prod-subnav]');
        const prodCopy = {
          mission: ['JLT MES 작업 · 자재 · 미션 관리', '작업지시, 자재 흐름, Tray/Magazine 교체 미션을 통합 관리'],
          material: ['JLT MES 자재 관리', 'LOT 추적, Tray/Magazine/Cart 재고와 라인 투입 상태를 실시간 관리'],
          orchestration: ['JLT MES 미션 오케스트레이션', 'PLC 이벤트, H-MOS 배정, 로봇 교체 미션의 진행 상태를 관리'],
          facility: ['JLT MES 설비·자원 관리', '설비 자원, 알람, 작업 흐름과 공장 경로를 연결해 관리'],
          robot: ['JLT MES AMR·로봇 관리', 'AMR, 휴머노이드, 배터리와 이동 경로를 실시간으로 관리']
        };
        const prodFocus = {
          mission: 'mission',
          material: 'material',
          orchestration: 'mission',
          facility: 'facility',
          robot: 'facility'
        };
        const assetText = {
          'AMR-05': ['AMR-05 선택됨', 'Line B 진입 전 경로 재탐색 중. 배터리 61%, 충돌 회피 이벤트와 연결됨.'],
          'HMD-02': ['HMD-02 선택됨', '피킹 셀 B에서 키팅 작업 중. 배터리 72%, 다음 작업 WO-260713-001.'],
          'HMD-04': ['HMD-04 선택됨', '출고 검수 보조 작업 대기 중. 배터리 84%, 작업자 협업 모드.'],
          'AMR-11': ['AMR-11 선택됨', '출고 버퍼로 카트 이송 중. 적재율 68%, 도착 예정 4분.'],
          'SAFE-01': ['SAFE-01 위험 이벤트', '휴머노이드와 작업자 간 안전거리 경고. 출고 버퍼 구역 확인 필요.']
        };
        function press(group, active) {
          root.querySelectorAll(group).forEach(el => el.setAttribute('aria-pressed', String(el === active)));
        }
        function setDetail(head, text) {
          detail.querySelector('strong').textContent = head;
          detail.querySelector('span').textContent = text;
        }
        function setProductionTab(tab) {
          const copy = prodCopy[tab] || prodCopy.mission;
          title.textContent = copy[0];
          sub.textContent = copy[1];
          root.querySelectorAll('[data-prod-tab]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.prodTab === tab)));
          root.querySelectorAll('[data-prod-panel]').forEach(panel => panel.dataset.focus = String(panel.dataset.prodPanel === (prodFocus[tab] || 'mission')));
          setDetail(`${copy[0]} 선택됨`, `${copy[1]} 화면이 통합관제보드와 연결되었습니다.`);
        }
        function showProduction(tab) {
          if (main) main.dataset.view = 'production';
          dashboardSections.forEach(section => { section.hidden = true; });
          if (prodView) prodView.hidden = false;
          if (prodSubnav) prodSubnav.dataset.open = 'true';
          setProductionTab(tab || 'mission');
        }
        function showDashboard(button) {
          if (main) main.dataset.view = 'dashboard';
          dashboardSections.forEach(section => { section.hidden = false; });
          if (prodView) prodView.hidden = true;
          if (prodSubnav) prodSubnav.dataset.open = 'false';
          title.textContent = button.dataset.menu === '통합 대시보드' ? 'JLT MES 통합 관제 대시보드' : `JLT ${button.dataset.menu} 관제 대시보드`;
          sub.textContent = button.dataset.menu === '통합 대시보드' ? '공장 전체 운영 현황과 휴머노이드 물류자동화 흐름을 한 화면에서 모니터링' : `${button.dataset.menu} 기준으로 주요 KPI, 레이아웃, 이벤트를 한 화면에 표시합니다.`;
          setDetail(`${button.dataset.menu} 선택됨`, '좌측 메뉴와 연결된 관제 영역이 강조되었습니다.');
        }
        root.querySelectorAll('[data-menu]').forEach(button => {
          button.addEventListener('click', () => {
            press('[data-menu]', button);
            if (button.dataset.menu === '생산 관리') showProduction('mission');
            else showDashboard(button);
          });
        });
        root.querySelectorAll('[data-prod-tab]').forEach(button => {
          button.addEventListener('click', () => {
            const prodMenu = root.querySelector('[data-menu="생산 관리"]');
            if (prodMenu) press('[data-menu]', prodMenu);
            showProduction(button.dataset.prodTab);
          });
        });
        root.querySelectorAll('[data-asset]').forEach(button => {
          button.addEventListener('click', () => {
            press('[data-asset]', button);
            setDetail(assetText[button.dataset.asset][0], assetText[button.dataset.asset][1]);
          });
        });
        root.querySelectorAll('[data-select]').forEach(button => {
          button.addEventListener('click', () => {
            const group = button.classList.contains('work') ? '.work' : button.classList.contains('event') ? '.event' : button.classList.contains('row-click') ? '.row-click' : null;
            if (group) press(group, button);
            setDetail(`${button.dataset.select} 선택됨`, '선택 항목의 상세 상태와 관련 설비, 작업지시, 이벤트를 하단 상세 바에서 확인합니다.');
          });
        });
        root.querySelectorAll('[data-mode], [data-toggle]').forEach(button => {
          button.addEventListener('click', () => {
            if (button.hasAttribute('data-mode')) {
              const current = button.getAttribute('aria-pressed') === 'true';
              button.setAttribute('aria-pressed', String(!current));
            } else {
              const current = button.getAttribute('aria-pressed') === 'true';
              button.setAttribute('aria-pressed', String(!current));
            }
          });
        });
  
        function initFactory3D() {
          const canvas = root.querySelector('#factory3d');
          const factory = root.querySelector('.factory');
          if (!canvas || !factory) return;
          const ctx = canvas.getContext('2d');
          const colors = {
            blue: '#1677ff',
            blueDark: '#0f5ed7',
            green: '#22b86a',
            mint: '#15c7a7',
            amber: '#f5a400',
            red: '#ef4444',
            floor: '#f7fbff',
            grid: '#dbe7f6',
            wall: '#d8e5f4',
            machine: '#ffffff',
            machineSide: '#dbe8f7',
            ink: '#263241'
          };
          const routes = [
            [{ x: -7, z: -3 }, { x: 7, z: -3 }, { x: 7, z: -1 }, { x: -7, z: -1 }, { x: -7, z: -3 }],
            [{ x: -7, z: 0 }, { x: 7, z: 0 }, { x: 7, z: 2 }, { x: -7, z: 2 }, { x: -7, z: 0 }],
            [{ x: -6, z: 3 }, { x: 6, z: 3 }]
          ];
          const machines = [];
          [-5, -3, -1, 1, 3, 5].forEach(x => machines.push({ x, z: -3.2, h: 0.82, line: 'A' }));
          [-5, -3, -1, 1, 3, 5].forEach(x => machines.push({ x, z: 0.15, h: 0.72, line: 'B' }));
          [-4, -2, 0, 2, 4].forEach(x => machines.push({ x, z: 3.2, h: 0.9, line: 'C' }));
  
          function resize() {
            const rect = factory.getBoundingClientRect();
            const ratio = window.devicePixelRatio || 1;
            canvas.width = Math.max(1, Math.floor(rect.width * ratio));
            canvas.height = Math.max(1, Math.floor(rect.height * ratio));
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
          }
  
          function project(x, y, z) {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            const scale = Math.min(w / 18, h / 9.2);
            return {
              x: w * 0.48 + (x - z) * scale * 0.88,
              y: h * 0.55 + (x + z) * scale * 0.38 - y * scale * 0.96
            };
          }
  
          function poly(points, fill, stroke, width) {
            ctx.beginPath();
            points.forEach((p, i) => {
              if (i === 0) ctx.moveTo(p.x, p.y);
              else ctx.lineTo(p.x, p.y);
            });
            ctx.closePath();
            ctx.fillStyle = fill;
            ctx.fill();
            if (stroke) {
              ctx.strokeStyle = stroke;
              ctx.lineWidth = width || 1;
              ctx.stroke();
            }
          }
  
          function box(x, z, sx, sz, h, fill, side, stroke) {
            const a = project(x - sx, 0, z - sz);
            const b = project(x + sx, 0, z - sz);
            const c = project(x + sx, 0, z + sz);
            const d = project(x - sx, 0, z + sz);
            const at = project(x - sx, h, z - sz);
            const bt = project(x + sx, h, z - sz);
            const ct = project(x + sx, h, z + sz);
            const dt = project(x - sx, h, z + sz);
            poly([d, c, ct, dt], side, stroke, 1);
            poly([b, c, ct, bt], '#c9d9eb', stroke, 1);
            poly([at, bt, ct, dt], fill, stroke, 1);
          }
  
          function routePoint(route, t) {
            const segments = [];
            let total = 0;
            for (let i = 0; i < route.length - 1; i += 1) {
              const a = route[i];
              const b = route[i + 1];
              const len = Math.hypot(b.x - a.x, b.z - a.z);
              segments.push({ a, b, len });
              total += len;
            }
            let dist = (t % 1) * total;
            for (const segment of segments) {
              if (dist <= segment.len) {
                const k = dist / segment.len;
                return {
                  x: segment.a.x + (segment.b.x - segment.a.x) * k,
                  z: segment.a.z + (segment.b.z - segment.a.z) * k
                };
              }
              dist -= segment.len;
            }
            return route[0];
          }
  
          function drawLabel(text, x, y, fill) {
            ctx.fillStyle = fill || colors.ink;
            ctx.font = '700 12px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(text, x, y);
          }
  
          function drawRobot(x, z, color, label, pulse) {
            const p = project(x, 0.28 + pulse * 0.08, z);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 8 + pulse * 2, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
            drawLabel(label, p.x, p.y + 4, '#ffffff');
            ctx.beginPath();
            ctx.arc(p.x, p.y, 17 + pulse * 5, 0, Math.PI * 2);
            ctx.strokeStyle = color === colors.red ? 'rgba(239,68,68,0.22)' : 'rgba(22,119,255,0.18)';
            ctx.lineWidth = 3;
            ctx.stroke();
          }
  
          function drawRoute(route, stroke) {
            ctx.beginPath();
            route.forEach((pt, i) => {
              const p = project(pt.x, 0.04, pt.z);
              if (i === 0) ctx.moveTo(p.x, p.y);
              else ctx.lineTo(p.x, p.y);
            });
            ctx.strokeStyle = stroke;
            ctx.lineWidth = 4;
            ctx.setLineDash([10, 8]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
  
          function conveyor(x, z, sx, sz, color, offset) {
            const a = project(x - sx, 0.08, z - sz);
            const b = project(x + sx, 0.08, z - sz);
            const c = project(x + sx, 0.08, z + sz);
            const d = project(x - sx, 0.08, z + sz);
            const ab = project(x - sx, -0.12, z - sz);
            const bb = project(x + sx, -0.12, z - sz);
            const cb = project(x + sx, -0.12, z + sz);
            const db = project(x - sx, -0.12, z + sz);
            poly([d, c, cb, db], '#b8c9dc', '#9fb1c6', 1);
            poly([b, c, cb, bb], '#c9d8e8', '#9fb1c6', 1);
            poly([a, b, c, d], '#eef4fb', '#9fb1c6', 1);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.lineTo(c.x, c.y);
            ctx.lineTo(d.x, d.y);
            ctx.closePath();
            ctx.clip();
            for (let i = -sx; i <= sx; i += 0.62) {
              const shift = ((offset % 1) - 0.5) * 0.62;
              const p1 = project(x + i + shift, 0.12, z - sz + 0.08);
              const p2 = project(x + i + shift, 0.12, z + sz - 0.08);
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = '#b7c7d9';
              ctx.lineWidth = 2;
              ctx.stroke();
            }
            ctx.restore();
            const lipA = project(x - sx, 0.18, z - sz);
            const lipB = project(x + sx, 0.18, z - sz);
            const lipC = project(x + sx, 0.18, z + sz);
            const lipD = project(x - sx, 0.18, z + sz);
            ctx.beginPath();
            ctx.moveTo(lipA.x, lipA.y);
            ctx.lineTo(lipB.x, lipB.y);
            ctx.moveTo(lipD.x, lipD.y);
            ctx.lineTo(lipC.x, lipC.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.stroke();
          }
  
          function drawAmrModel(x, z, label, heading) {
            const center = project(x, 0.34, z);
            const yaw = heading || 0;
            ctx.save();
            ctx.translate(center.x, center.y);
            ctx.rotate(yaw * 0.18);
            ctx.beginPath();
            ctx.roundRect(-18, -11, 36, 22, 7);
            ctx.fillStyle = colors.green;
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
            ctx.fillStyle = '#0f7f48';
            ctx.fillRect(-15, 9, 8, 4);
            ctx.fillRect(7, 9, 8, 4);
            ctx.fillStyle = '#dff9ec';
            ctx.beginPath();
            ctx.arc(10, -4, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = '800 10px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(label, 0, 4);
            ctx.restore();
          }
  
          function drawHumanoidModel(x, z, label, phase) {
            const p = project(x, 0.58 + Math.sin(phase) * 0.04, z);
            const arm = Math.sin(phase) * 5;
            const leg = Math.cos(phase) * 4;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.strokeStyle = '#0e9f8a';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-5, 0);
            ctx.lineTo(-14, 12 + arm);
            ctx.moveTo(5, 0);
            ctx.lineTo(14, 12 - arm);
            ctx.moveTo(-4, 22);
            ctx.lineTo(-11, 36 + leg);
            ctx.moveTo(4, 22);
            ctx.lineTo(11, 36 - leg);
            ctx.stroke();
            ctx.fillStyle = colors.mint;
            ctx.beginPath();
            ctx.roundRect(-10, -2, 20, 25, 6);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, -13, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = colors.mint;
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = '#0f766e';
            ctx.font = '800 10px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(label, 0, -10);
            ctx.restore();
          }
  
          function drawRiskMarker(x, z, pulse) {
            const p = project(x, 0.45, z);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 18 + pulse * 8, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(239,68,68,0.24)';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - 16);
            ctx.lineTo(p.x + 15, p.y + 12);
            ctx.lineTo(p.x - 15, p.y + 12);
            ctx.closePath();
            ctx.fillStyle = colors.red;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 16px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('!', p.x, p.y + 7);
          }
  
          function frame(time) {
            const t = time * 0.00008;
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = 'rgba(10, 45, 90, 0.08)';
            ctx.fillRect(0, 0, w, h);
            const screenRoutes = [
              { color: 'rgba(22,119,255,0.82)', pts: [[0.08, 0.82], [0.28, 0.74], [0.42, 0.70], [0.63, 0.78], [0.83, 0.64]] },
              { color: 'rgba(34,184,106,0.82)', pts: [[0.12, 0.28], [0.31, 0.35], [0.48, 0.44], [0.70, 0.40], [0.88, 0.28]] },
              { color: 'rgba(21,199,167,0.76)', pts: [[0.30, 0.57], [0.45, 0.50], [0.59, 0.52], [0.72, 0.47]] }
            ];
            function pointOnScreenRoute(route, progress) {
              const segments = [];
              let total = 0;
              for (let i = 0; i < route.pts.length - 1; i += 1) {
                const a = route.pts[i];
                const b = route.pts[i + 1];
                const len = Math.hypot((b[0] - a[0]) * w, (b[1] - a[1]) * h);
                segments.push({ a, b, len });
                total += len;
              }
              let dist = (progress % 1) * total;
              for (const segment of segments) {
                if (dist <= segment.len) {
                  const k = dist / segment.len;
                  return [
                    (segment.a[0] + (segment.b[0] - segment.a[0]) * k) * w,
                    (segment.a[1] + (segment.b[1] - segment.a[1]) * k) * h
                  ];
                }
                dist -= segment.len;
              }
              return [route.pts[0][0] * w, route.pts[0][1] * h];
            }
            screenRoutes.forEach(route => {
              ctx.beginPath();
              route.pts.forEach((pt, index) => {
                const x = pt[0] * w;
                const y = pt[1] * h;
                if (index === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              });
              ctx.strokeStyle = route.color;
              ctx.lineWidth = 4;
              ctx.setLineDash([13, 10]);
              ctx.lineCap = 'round';
              ctx.stroke();
              ctx.setLineDash([]);
            });
            const moving = [
              { route: screenRoutes[0], p: t * 1.8, color: colors.green, label: 'AMR-05' },
              { route: screenRoutes[1], p: t * 1.4 + 0.36, color: colors.green, label: 'AMR-11' },
              { route: screenRoutes[2], p: t * 1.2 + 0.58, color: colors.mint, label: 'HMD-02' }
            ];
            moving.forEach(item => {
              const p = pointOnScreenRoute(item.route, item.p);
              ctx.beginPath();
              ctx.arc(p[0], p[1], 18, 0, Math.PI * 2);
              ctx.fillStyle = item.color;
              ctx.fill();
              ctx.lineWidth = 4;
              ctx.strokeStyle = '#ffffff';
              ctx.stroke();
              ctx.fillStyle = '#ffffff';
              ctx.font = '800 10px Inter, system-ui, sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(item.label.includes('HMD') ? 'H' : 'A', p[0], p[1] + 4);
              ctx.fillStyle = 'rgba(255,255,255,0.92)';
              ctx.fillRect(p[0] - 28, p[1] - 36, 56, 17);
              ctx.fillStyle = '#0f172a';
              ctx.font = '800 9px Inter, system-ui, sans-serif';
              ctx.fillText(item.label, p[0], p[1] - 24);
            });
            const overlayPulse = (Math.sin(time * 0.006) + 1) / 2;
            const riskX = w * 0.82;
            const riskY = h * 0.54;
            ctx.beginPath();
            ctx.arc(riskX, riskY, 22 + overlayPulse * 14, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(239,68,68,0.34)';
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(riskX, riskY - 18);
            ctx.lineTo(riskX + 18, riskY + 14);
            ctx.lineTo(riskX - 18, riskY + 14);
            ctx.closePath();
            ctx.fillStyle = colors.red;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 17px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('!', riskX, riskY + 8);
            ctx.fillStyle = 'rgba(255,255,255,0.92)';
            ctx.fillRect(w * 0.025, h * 0.045, 150, 30);
            ctx.fillStyle = colors.blueDark;
            ctx.font = '800 12px Inter, system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('LIVE PHOTO DIGITAL TWIN', w * 0.04, h * 0.095);
            requestAnimationFrame(frame);
            return;
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = colors.floor;
            ctx.fillRect(0, 0, w, h);
            const floor = [project(-8, 0, -4.4), project(8, 0, -4.4), project(8, 0, 4.6), project(-8, 0, 4.6)];
            poly(floor, '#f8fbff', '#cfddea', 1);
            for (let x = -8; x <= 8; x += 1) {
              const a = project(x, 0.01, -4.4);
              const b = project(x, 0.01, 4.6);
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = colors.grid;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
            for (let z = -4; z <= 4; z += 1) {
              const a = project(-8, 0.01, z);
              const b = project(8, 0.01, z);
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = colors.grid;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
            conveyor(0, -3.2, 6.4, 0.38, colors.blue, time * 0.002);
            conveyor(0, 0.15, 6.4, 0.38, colors.green, time * 0.0024);
            conveyor(0, 3.2, 5.5, 0.36, colors.amber, time * 0.0018);
            routes.forEach((route, i) => drawRoute(route, i === 1 ? 'rgba(34,184,106,0.34)' : 'rgba(22,119,255,0.28)'));
            machines.forEach(machine => {
              const accent = machine.line === 'A' ? '#eaf3ff' : machine.line === 'B' ? '#eaf9f1' : '#fff6dc';
              box(machine.x, machine.z, 0.42, 0.32, machine.h, accent, colors.machineSide, '#cbd9eb');
            });
            ['Line A', 'Line B', 'Line C'].forEach((label, i) => {
              const p = project(0, 0.1, [-4, -0.6, 2.55][i]);
              drawLabel(label, p.x, p.y, i === 2 ? colors.amber : colors.green);
            });
            const amrA = routePoint(routes[0], t);
            const amrB = routePoint(routes[1], t + 0.34);
            const amrC = routePoint(routes[2], (t * 1.7) + 0.12);
            const pulse = (Math.sin(time * 0.006) + 1) / 2;
            drawAmrModel(amrA.x, amrA.z, 'A5', Math.sin(time * 0.001));
            drawAmrModel(amrB.x, amrB.z, 'A11', Math.cos(time * 0.001));
            drawAmrModel(amrC.x, amrC.z, 'A7', 0.6);
            drawHumanoidModel(-1.2 + Math.sin(time * 0.0014) * 0.24, 0.95, 'H2', time * 0.004);
            drawHumanoidModel(3.25, 3.12 + Math.cos(time * 0.0016) * 0.22, 'H4', time * 0.003 + 1.3);
            drawRiskMarker(6.5, 3.8, pulse);
            ctx.fillStyle = 'rgba(22,119,255,0.08)';
            const status = project(-7.6, 0, -4.05);
            ctx.fillRect(status.x - 10, status.y - 24, 152, 28);
            ctx.fillStyle = colors.blueDark;
            ctx.font = '700 12px Inter, system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('LIVE 3D DIGITAL TWIN', status.x, status.y - 6);
            requestAnimationFrame(frame);
          }
  
          resize();
          window.addEventListener('resize', resize);
          requestAnimationFrame(frame);
        }
  
        initFactory3D();
      })();
    
}


function init_mes() {
  
      (() => {
        const lotPanel = [...document.querySelectorAll('.panel')].find(panel => panel.querySelector('h2')?.textContent.includes('자재 / LOT'));
        const assetPanel = [...document.querySelectorAll('.panel')].find(panel => panel.querySelector('h2')?.textContent.includes('Tray / Magazine / Cart'));
        const robotPanel = document.querySelector('.panel.robot');
        const mapArea = document.querySelector('.map-area');
        const routePath = [
          [66, 142], [166, 142], [196, 106], [196, 62], [232, 34], [286, 34], [316, 72], [316, 134], [356, 166], [454, 166]
        ];
        const statuses = [
          { text: 'Empty', cls: 'badge blue' },
          { text: 'In Use', cls: 'badge' },
          { text: 'Full', cls: 'badge red' },
          { text: 'Reserved', cls: 'badge orange' }
        ];
        const locations = ['A동 1F-Rack 03', 'Line A - M/C 15', 'Line B - M/C 07', 'Line C - Buffer', 'A동 1F-AGV Zone', 'A동 1F-OUT 02'];
        const lines = ['Line A', 'Line B', 'Line C', '-'];
  
        function flash(el) {
          if (!el) return;
          el.classList.remove('live-flash');
          void el.offsetWidth;
          el.classList.add('live-flash');
        }
  
        function updateLotRows() {
          lotPanel?.querySelectorAll('tbody tr').forEach((row, index) => {
            const cells = row.children;
            const inbound = Number(cells[2].textContent.replace(/,/g, ''));
            let used = Number(cells[3].textContent.replace(/,/g, ''));
            const delta = ((index % 2 === 0) ? 1 : -1) * (1 + Math.floor(Math.random() * 4));
            used = Math.max(0, Math.min(inbound, used + delta));
            const rate = Math.round((used / inbound) * 100);
            const bar = row.querySelector('.fill');
            const label = row.querySelector('.bar');
            cells[3].textContent = used.toLocaleString('ko-KR');
            if (bar) bar.style.width = `${rate}%`;
            if (label) label.lastChild.textContent = `${rate}%`;
            flash(row);
          });
        }
  
        function updateAssetRows() {
          const counts = { Empty: 0, 'In Use': 0, Full: 0, Reserved: 0 };
          assetPanel?.querySelectorAll('tbody tr').forEach((row, index) => {
            const cells = row.children;
            const status = statuses[(Math.floor(Date.now() / 2400) + index) % statuses.length];
            const badge = row.querySelector('.badge');
            if (badge) {
              badge.className = status.cls;
              badge.textContent = status.text;
            }
            cells[3].textContent = locations[(Math.floor(Date.now() / 1800) + index * 2) % locations.length];
            cells[4].textContent = lines[(Math.floor(Date.now() / 2600) + index) % lines.length];
            counts[status.text] += 1;
            flash(row);
          });
          const chips = assetPanel?.querySelectorAll('.chip') || [];
          if (chips.length >= 4) {
            chips[0].textContent = `전체 ${128 + Math.round(Math.sin(Date.now() / 2800) * 3)}`;
            chips[1].textContent = `Empty ${31 + counts.Empty}`;
            chips[2].textContent = `In Use ${74 + counts['In Use']}`;
            chips[3].textContent = `Full ${23 + counts.Full}`;
          }
        }
  
        function updateRobotRows() {
          const bases = [82, 56, 76, 23];
          robotPanel?.querySelectorAll('.amr-row').forEach((row, index) => {
            const value = Math.max(12, Math.min(98, Math.round((bases[index] || 60) + Math.sin(Date.now() / (1200 + index * 280)) * 7)));
            const battery = row.querySelector('.battery');
            const mini = row.querySelector('.mini-bar i');
            if (battery) battery.firstChild.textContent = `${value}%`;
            if (mini) mini.style.width = `${value}%`;
          });
          const detailBattery = robotPanel?.querySelector('.detail-kv .bar');
          if (detailBattery) {
            const value = Math.max(20, Math.min(95, Math.round(76 + Math.sin(Date.now() / 1500) * 9)));
            const fill = detailBattery.querySelector('.fill');
            if (fill) fill.style.width = `${value}%`;
            detailBattery.lastChild.textContent = `${value}%`;
          }
        }
  
        function pointOnRoute(points, progress) {
          const segments = [];
          let total = 0;
          for (let i = 0; i < points.length - 1; i += 1) {
            const a = points[i];
            const b = points[i + 1];
            const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
            segments.push({ a, b, len });
            total += len;
          }
          let dist = ((progress % 1) + 1) % 1 * total;
          for (const segment of segments) {
            if (dist <= segment.len) {
              const k = dist / segment.len;
              return [segment.a[0] + (segment.b[0] - segment.a[0]) * k, segment.a[1] + (segment.b[1] - segment.a[1]) * k];
            }
            dist -= segment.len;
          }
          return points[0];
        }
  
        if (mapArea && !mapArea.querySelector('.map-agent')) {
          [
            ['A', 'green', 0],
            ['H', 'mint', .35],
            ['A', '', .68]
          ].forEach(([label, cls, offset]) => {
            const agent = document.createElement('span');
            agent.className = `map-agent ${cls}`;
            agent.dataset.offset = offset;
            agent.textContent = label;
            mapArea.appendChild(agent);
          });
        }
  
        function animateMap(time) {
          if (mapArea) {
            const rect = mapArea.getBoundingClientRect();
            mapArea.querySelectorAll('.map-agent').forEach((agent, index) => {
              const [x, y] = pointOnRoute(routePath, time * (0.000065 + index * 0.000012) + Number(agent.dataset.offset || 0));
              agent.style.setProperty('--x', `${(x / 520) * rect.width}px`);
              agent.style.setProperty('--y', `${(y / 232) * rect.height}px`);
            });
          }
          requestAnimationFrame(animateMap);
        }
  
        updateLotRows();
        updateAssetRows();
        updateRobotRows();
        setInterval(updateLotRows, 1800);
        setInterval(updateAssetRows, 2400);
        setInterval(updateRobotRows, 1200);
        requestAnimationFrame(animateMap);
      })();
    
}


function init_quality() {
  
      (() => {
        const root = document.getElementById("jlt-quality-root");
        if (!root) return;
  
        const colors = {
          blue: "#1677ff",
          green: "#20b26b",
          yellow: "#f6b93b",
          red: "#ff585d",
          grid: "#dfe7f2",
          text: "#657187",
          axis: "#9aa8bd"
        };
  
        function setupCanvas(canvas) {
          const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
          const rect = canvas.getBoundingClientRect();
          const w = Math.max(10, Math.floor(rect.width * dpr));
          const h = Math.max(10, Math.floor(rect.height * dpr));
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
          }
          const ctx = canvas.getContext("2d");
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          return { ctx, w: rect.width, h: rect.height };
        }
  
        function drawLine(ctx, points, area, color, width = 2, phase = 1) {
          ctx.save();
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.beginPath();
          points.forEach((p, i) => {
            const x = area.x + p.x * area.w;
            const y = area.y + (1 - p.y) * area.h;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.setLineDash([Math.max(1, area.w * phase), area.w]);
          ctx.stroke();
          ctx.restore();
        }
  
        function makeWave(seed, n, low, high, t, speed = 1) {
          return Array.from({ length: n }, (_, i) => {
            const x = i / (n - 1);
            const a = Math.sin((i * 1.7 + seed + t * speed) * 0.9);
            const b = Math.cos((i * 0.7 + seed * .8 + t * speed * .55));
            const v = low + (high - low) * (.5 + .32 * a + .18 * b);
            return { x, y: Math.max(0.04, Math.min(0.96, v)) };
          });
        }
  
        function drawGrid(ctx, area, labelsY, labelsX) {
          ctx.save();
          ctx.strokeStyle = colors.grid;
          ctx.lineWidth = 1;
          ctx.fillStyle = colors.text;
          ctx.font = "11px 'Noto Sans KR', sans-serif";
          ctx.textAlign = "right";
          ctx.textBaseline = "middle";
          labelsY.forEach((label, i) => {
            const y = area.y + area.h * (i / (labelsY.length - 1));
            ctx.beginPath();
            ctx.moveTo(area.x, y);
            ctx.lineTo(area.x + area.w, y);
            ctx.stroke();
            ctx.fillText(label, area.x - 8, y);
          });
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          labelsX.forEach((label, i) => {
            const x = area.x + area.w * (i / (labelsX.length - 1));
            ctx.fillText(label, x, area.y + area.h + 10);
          });
          ctx.restore();
        }
  
        function animateSpark(canvas, seed, color) {
          const loop = (ms) => {
            const { ctx, w, h } = setupCanvas(canvas);
            const t = ms / 1000;
            ctx.clearRect(0, 0, w, h);
            const pts = makeWave(seed, 12, .22, .78, t, .9);
            drawLine(ctx, pts, { x: 2, y: 5, w: w - 4, h: h - 10 }, color, 2.4, .72 + .28 * Math.sin(t * 1.2 + seed));
            requestAnimationFrame(loop);
          };
          requestAnimationFrame(loop);
        }
  
        function drawSpc(canvas, ms) {
          const { ctx, w, h } = setupCanvas(canvas);
          const t = ms / 1000;
          ctx.clearRect(0, 0, w, h);
          const area = { x: 50, y: 18, w: w - 68, h: h - 58 };
          drawGrid(ctx, area, ["2.00", "1.33", "0.67", "0.00"], ["04-17", "04-22", "04-27", "05-02", "05-07", "05-12", "05-16"]);
          ctx.save();
          ctx.setLineDash([6, 5]);
          ctx.strokeStyle = colors.red;
          ctx.beginPath();
          ctx.moveTo(area.x, area.y + area.h * .28);
          ctx.lineTo(area.x + area.w, area.y + area.h * .28);
          ctx.stroke();
          ctx.strokeStyle = colors.green;
          ctx.beginPath();
          ctx.moveTo(area.x, area.y + area.h * .72);
          ctx.lineTo(area.x + area.w, area.y + area.h * .72);
          ctx.stroke();
          ctx.restore();
          drawLine(ctx, makeWave(1, 27, .37, .67, t, .75), area, colors.blue, 2.2, 1);
          drawLine(ctx, makeWave(5, 27, .28, .58, t, .9), area, colors.green, 2.2, 1);
          drawLine(ctx, makeWave(8, 27, .35, .62, t, .7), area, "#54c7a2", 2.2, 1);
        }
  
        function drawDefect(canvas, ms) {
          const { ctx, w, h } = setupCanvas(canvas);
          const t = ms / 1000;
          ctx.clearRect(0, 0, w, h);
          const area = { x: 50, y: 18, w: w - 68, h: h - 58 };
          drawGrid(ctx, area, ["2.0%", "1.5%", "1.0%", "0.5%", "0%"], ["04-17", "04-22", "04-27", "05-02", "05-07", "05-12", "05-16"]);
          drawLine(ctx, makeWave(2, 31, .15, .62, t, 1.4), area, colors.blue, 2.1, 1);
          drawLine(ctx, makeWave(9, 31, .12, .55, t, 1.1), area, colors.green, 2.1, 1);
          drawLine(ctx, makeWave(14, 31, .24, .72, t, 1.55), area, colors.yellow, 2.1, 1);
        }
  
        function drawPareto(canvas, ms) {
          const { ctx, w, h } = setupCanvas(canvas);
          const t = ms / 1000;
          ctx.clearRect(0, 0, w, h);
          const area = { x: 46, y: 20, w: w - 68, h: h - 58 };
          const vals = [34.2, 22.4, 16.7, 12.1, 7.6, 7.0];
          const labels = ["스크래치", "찍힘", "오염", "치수", "변형", "기타"];
          const max = 38;
          ctx.fillStyle = colors.text;
          ctx.font = "11px 'Noto Sans KR', sans-serif";
          ctx.textAlign = "center";
          vals.forEach((v, i) => {
            const bw = area.w / vals.length * .62;
            const x = area.x + i * area.w / vals.length + area.w / vals.length * .19;
            const target = area.h * (v / max);
            const pulse = .94 + .06 * Math.sin(t * 1.8 + i);
            const bh = target * pulse;
            const grad = ctx.createLinearGradient(0, area.y + area.h - bh, 0, area.y + area.h);
            grad.addColorStop(0, "#116dff");
            grad.addColorStop(1, "#8ab8ff");
            ctx.fillStyle = grad;
            ctx.fillRect(x, area.y + area.h - bh, bw, bh);
            ctx.fillStyle = colors.text;
            ctx.fillText(v.toFixed(1) + "%", x + bw / 2, area.y + area.h - bh - 10);
            ctx.fillText(labels[i], x + bw / 2, area.y + area.h + 10);
          });
          const cum = [34.2, 56.6, 73.3, 85.4, 93.0, 100];
          const pts = cum.map((v, i) => ({ x: (i + .5) / vals.length, y: v / 100 }));
          drawLine(ctx, pts, area, "#62bb91", 2.4, .85 + .15 * Math.sin(t));
          ctx.fillStyle = colors.text;
          ctx.textAlign = "right";
          ["100%", "75%", "50%", "25%", "0%"].forEach((label, i) => ctx.fillText(label, w - 10, area.y + area.h * i / 4));
        }
  
        function drawScatter(canvas, ms) {
          const { ctx, w, h } = setupCanvas(canvas);
          const t = ms / 1000;
          ctx.clearRect(0, 0, w, h);
          const area = { x: 42, y: 18, w: w - 58, h: h - 54 };
          drawGrid(ctx, area, ["", "", "", ""], ["05-16\n00:00", "05-16\n06:00", "05-16\n12:00", "05-16\n18:00", "05-17\n00:00"]);
          const series = [colors.blue, colors.green, colors.red, "#24304a"];
          for (let i = 0; i < 42; i++) {
            const x = area.x + ((i * 37) % 100) / 100 * area.w;
            const base = ((i * 19) % 84) / 100;
            const y = area.y + area.h * (.12 + .78 * base);
            ctx.beginPath();
            ctx.fillStyle = series[i % series.length];
            ctx.globalAlpha = .75 + .25 * Math.sin(t * 2.2 + i);
            ctx.arc(x, y + Math.sin(t * 1.4 + i) * 2.2, 3.2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
          ctx.strokeStyle = colors.red;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(area.x, area.y + area.h * .62);
          ctx.lineTo(area.x + area.w, area.y + area.h * .58 + Math.sin(t) * 4);
          ctx.stroke();
        }
  
        const chartDrawers = { spc: drawSpc, defect: drawDefect, pareto: drawPareto, scatter: drawScatter };
  
        root.querySelectorAll(".spark").forEach((canvas, i) => {
          animateSpark(canvas, i + 1, canvas.dataset.series === "green" ? colors.green : colors.blue);
        });
  
        function animateCharts(ms) {
          root.querySelectorAll("canvas.chart").forEach((canvas) => {
            const drawer = chartDrawers[canvas.dataset.chart];
            if (drawer) drawer(canvas, ms);
          });
          requestAnimationFrame(animateCharts);
        }
        requestAnimationFrame(animateCharts);
        window.addEventListener("resize", () => root.querySelectorAll("canvas").forEach((canvas) => {
          canvas.width = 0;
          canvas.height = 0;
        }));
      })();
    
}


function init_wms() {
  
      (() => {
        const root = document.getElementById("jlt-wms-board");
        const $ = (id) => root.querySelector("#" + id);
        const fmt = new Intl.NumberFormat("ko-KR");
        let tick = 0;
  
        root.querySelectorAll(".nav button").forEach((button) => {
          button.addEventListener("click", () => {
            root.querySelectorAll(".nav button").forEach((item) => {
              item.classList.remove("active", "is-linked");
              item.removeAttribute("aria-current");
            });
            if (button.dataset.tab === "logistics") {
              button.classList.add("is-linked");
              button.setAttribute("aria-current", "page");
            } else {
              button.classList.add("active");
            }
          });
        });
  
        const state = {
          inbound: 1248,
          outbound: 1186,
          rate: 96,
          accuracy: 99.2,
          occupancy: 78.3,
          orders: 156,
          newOrders: 42,
          sla: 98.6,
          flowIn: [220, 610, 760, 1010, 1120, 1230, 1320, 1500, 1680, 1780],
          flowOut: [80, 390, 570, 700, 820, 960, 1010, 1140, 1280, 1450],
          accuracyTrend: [98.7, 98.9, 98.8, 99.0, 98.9, 99.1, 99.0, 99.2, 99.1, 99.3],
          occupancyTrend: [75, 76.2, 75.6, 77, 76.4, 78, 77.2, 78.5, 79, 78.3]
        };
  
        const lines = [
          { name: "Line A (Panel)", status: "정상 공급", need: 620, supplied: 607, pct: 98, color: "#0ea75a" },
          { name: "Line B (Cell)", status: "공급 지연", need: 540, supplied: 445, pct: 82, color: "#f59e0b" },
          { name: "Line C (Module)", status: "정상 공급", need: 480, supplied: 455, pct: 95, color: "#0ea75a" },
          { name: "Module Line", status: "정상 공급", need: 320, supplied: 298, pct: 93, color: "#0b63f6" }
        ];
  
        const fleet = [
          { type: "AMR", total: 48, run: 32, check: 10, wait: 6, icon: "bot" },
          { type: "OHT", total: 36, run: 26, check: 4, wait: 6, icon: "tram-front" },
          { type: "AGV", total: 14, run: 9, check: 3, wait: 2, icon: "forklift" }
        ];
  
        const trays = [
          { label: "Empty", value: 1256, sub: "EA (18%)", color: "#0b63f6" },
          { label: "In Use", value: 4352, sub: "EA (62%)", color: "#0ea75a" },
          { label: "Full", value: 1412, sub: "EA (20%)", color: "#ef4444" }
        ];
  
        const works = [
          ["WO-250714-001", "65” Panel (Open Cell)", 1200, 87, "12:00"],
          ["WO-250714-002", "55” Module (LCM)", 900, 82, "14:00"],
          ["WO-250714-003", "42” Panel (a-Si)", 800, 86, "16:00"],
          ["WO-250714-004", "TFT Glass (Gen8.6)", 600, 85, "18:00"],
          ["WO-250714-005", "Polarizer Film", 400, 78, "20:00"]
        ];
  
        const eventTexts = [
          ["triangle-alert", "AMR 배차 지연 (AMR-07)", "#ef4444"],
          ["triangle-alert", "스토커 #2 적재량 경고 (95%)", "#f59e0b"],
          ["circle-alert", "Line B 자재공급 지연 (Glass)", "#f59e0b"],
          ["circle-alert", "OHT 경로 혼잡 (Route B)", "#f59e0b"],
          ["info", "입고 도크 스캔 오류 (Dock 2)", "#0b63f6"]
        ];
  
        function pathFrom(values, w, h, pad = 12) {
          const min = Math.min(...values);
          const max = Math.max(...values);
          return values.map((v, i) => {
            const x = pad + (i * (w - pad * 2)) / (values.length - 1);
            const y = h - pad - ((v - min) / Math.max(1, max - min)) * (h - pad * 2);
            return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
          }).join(" ");
        }
  
        function setDonut(id, pct) {
          const c = $(id);
          if (c) c.style.strokeDashoffset = String(106.8 * (1 - pct / 100));
        }
  
        function renderMiniDonut(pct, color) {
          const off = 106.8 * (1 - pct / 100);
          return `<svg class="mini-donut" viewBox="0 0 44 44" aria-label="${pct}%"><circle cx="22" cy="22" r="17" fill="none" stroke="#e5edf8" stroke-width="4"></circle><circle cx="22" cy="22" r="17" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-dasharray="106.8" stroke-dashoffset="${off}"></circle><text x="-22" y="25" transform="rotate(90)" text-anchor="middle" font-size="9" font-weight="500" fill="#0f172a">${pct}%</text></svg>`;
        }
  
        function drawChart(id, inData, outData) {
          const svg = $(id);
          const w = 260, h = 138, pad = 24;
          const max = Math.max(...inData, ...outData) * 1.1;
          const scaleY = (v) => h - pad - (v / max) * (h - pad * 2);
          const scaleX = (i) => pad + (i * (w - pad * 2)) / (inData.length - 1);
          const makePath = (arr) => arr.map((v, i) => `${i ? "L" : "M"}${scaleX(i).toFixed(1)} ${scaleY(v).toFixed(1)}`).join(" ");
          let grid = "";
          for (let i = 0; i < 4; i++) {
            const y = pad + i * 28;
            grid += `<line class="gridline" x1="${pad}" x2="${w - 8}" y1="${y}" y2="${y}"></line>`;
          }
          svg.innerHTML = `${grid}<line class="axis" x1="${pad}" x2="${w - 8}" y1="${h - pad}" y2="${h - pad}"></line><path class="line-in" d="${makePath(inData)}"></path><path class="line-out" d="${makePath(outData)}"></path><g fill="#0b63f6">${inData.map((v,i)=>`<circle cx="${scaleX(i)}" cy="${scaleY(v)}" r="2.6"></circle>`).join("")}</g><g fill="#0ea75a">${outData.map((v,i)=>`<circle cx="${scaleX(i)}" cy="${scaleY(v)}" r="2.6"></circle>`).join("")}</g><text x="${pad}" y="14" fill="#52627a" font-size="10">입고 LOT</text><text x="92" y="14" fill="#52627a" font-size="10">출고 LOT</text><text x="${w - 76}" y="24" fill="#0b63f6" font-size="10">금일 ${fmt.format(inData.at(-1))} LOT</text>`;
        }
  
        function buildStatic() {
          const rackG = $("racks");
          const machineG = $("machines");
          let racks = "";
          for (let x = 142; x < 284; x += 26) {
            for (let y = 116; y < 204; y += 20) racks += `<rect class="rack" x="${x}" y="${y}" width="18" height="14" rx="1"></rect>`;
          }
          for (let x = 328; x < 520; x += 40) {
            for (let y = 118; y < 206; y += 28) racks += `<rect class="rack" x="${x}" y="${y}" width="28" height="18" rx="1"></rect>`;
          }
          for (let x = 592; x < 720; x += 32) {
            for (let y = 120; y < 200; y += 24) racks += `<rect class="rack" x="${x}" y="${y}" width="22" height="16" rx="1"></rect>`;
          }
          rackG.innerHTML = racks;
          let machines = "";
          for (let x = 198; x < 382; x += 46) machines += `<rect class="machine" x="${x}" y="278" width="34" height="28" rx="3"></rect><circle class="arm" cx="${x + 17}" cy="270" r="8"></circle>`;
          for (let x = 462; x < 654; x += 44) machines += `<rect class="machine" x="${x}" y="280" width="32" height="28" rx="3"></rect><path class="arm" d="M${x + 10} 270 l16 -16 l10 8 l-16 16z"></path>`;
          machines += `<rect class="machine" x="386" y="132" width="54" height="74" rx="4"></rect><rect class="arm" x="405" y="106" width="18" height="96" rx="3"></rect>`;
          machineG.innerHTML = machines;
  
          $("line-supply").innerHTML = lines.map(l => `
            <div class="line-row">
              <div>
                <div class="line-title"><strong>${l.name}</strong><span class="muted">공급률</span></div>
                <div><span style="color:${l.color};font-weight:500">${l.status}</span> <span class="muted">필요 ${l.need} / 공급 ${l.supplied} LOT</span></div>
              </div>
              ${renderMiniDonut(l.pct, l.color)}
            </div>`).join("");
  
          $("fleet").innerHTML = fleet.map(f => `
            <div class="fleet-card">
              <strong style="color:#0b63f6">${f.type}</strong><br>
              <i data-lucide="${f.icon}" aria-hidden="true"></i>
              <div class="big">${f.total}</div>
              <div class="muted">운영 ${f.run} · 점검 ${f.check} · 대기 ${f.wait}</div>
            </div>`).join("");
  
          $("tray").innerHTML = trays.map(t => `
            <div class="tray">
              <strong style="color:${t.color}">${t.label}</strong>
              <div><span class="big">${fmt.format(t.value)}</span><span class="unit">EA</span></div>
              <span class="muted">${t.sub}</span>
            </div>`).join("");
  
          $("work-table").innerHTML = works.map(w => `
            <tr>
              <td style="color:#0b63f6">${w[0]}</td><td>${w[1]}</td><td>${fmt.format(w[2])} LOT</td>
              <td><span class="progress"><span class="bar"><span style="--w:${w[3]}%"></span></span>${w[3]}%</span></td><td>${w[4]}</td>
            </tr>`).join("");
  
          if (window.lucide) window.lucide.createIcons({ attrs: { width: 16, height: 16 } });
        }
  
        function updateEvents() {
          const now = new Date();
          $("events").innerHTML = eventTexts.map((e, i) => {
            const d = new Date(now.getTime() - (i * 140 + tick * 7) * 1000);
            const time = d.toTimeString().slice(0, 8);
            return `<div class="event"><i data-lucide="${e[0]}" aria-hidden="true" style="color:${e[2]}"></i><span>${e[1]}</span><span class="muted">${time}</span></div>`;
          }).join("");
          if (window.lucide) window.lucide.createIcons({ attrs: { width: 16, height: 16 } });
        }
  
        function step() {
          tick += 1;
          const wave = Math.sin(tick / 3);
          state.inbound += Math.round(7 + wave * 4);
          state.outbound += Math.round(6 + Math.cos(tick / 4) * 3);
          state.rate = Math.max(93, Math.min(98, 95.8 + wave * 1.2));
          state.accuracy = Math.max(98.8, Math.min(99.5, 99.15 + Math.cos(tick / 5) * 0.18));
          state.occupancy = Math.max(75, Math.min(83, 78.3 + Math.sin(tick / 4) * 1.7));
          state.orders += tick % 3 === 0 ? 1 : 0;
          state.newOrders += tick % 4 === 0 ? 1 : 0;
          state.sla = Math.max(97.4, Math.min(99.1, 98.4 + Math.sin(tick / 6) * 0.35));
  
          state.flowIn = state.flowIn.slice(1).concat(state.inbound);
          state.flowOut = state.flowOut.slice(1).concat(state.outbound);
          state.accuracyTrend = state.accuracyTrend.slice(1).concat(state.accuracy);
          state.occupancyTrend = state.occupancyTrend.slice(1).concat(state.occupancy);
  
          $("rate").textContent = state.rate.toFixed(0);
          $("inbound").textContent = fmt.format(state.inbound);
          $("outbound").textContent = fmt.format(state.outbound);
          $("accuracy").textContent = state.accuracy.toFixed(1);
          $("occupancy").textContent = state.occupancy.toFixed(1);
          $("orders").textContent = fmt.format(state.orders);
          $("new-orders").textContent = fmt.format(state.newOrders);
          $("sla").textContent = state.sla.toFixed(1);
          $("sla-acc").textContent = state.accuracy.toFixed(1);
          $("ok-ratio").textContent = `${state.accuracy.toFixed(1)}%`;
          $("inbound-bar").style.setProperty("--w", `${Math.min(100, state.inbound / 1300 * 100)}%`);
          $("outbound-bar").style.setProperty("--w", `${Math.min(100, state.outbound / 1200 * 100)}%`);
          $("accuracy-spark").setAttribute("d", pathFrom(state.accuracyTrend, 120, 36, 5));
          $("occupancy-spark").setAttribute("d", pathFrom(state.occupancyTrend, 120, 36, 5));
          setDonut("rate-donut", state.rate);
          setDonut("sla-donut", state.accuracy);
  
          $("veh-amr").setAttribute("transform", `translate(${160 + (tick % 7) * 34} ${238 + Math.sin(tick) * 8})`);
          $("veh-oht").setAttribute("transform", `translate(${565 + Math.sin(tick / 2) * 140} 86)`);
          $("veh-agv").setAttribute("transform", `translate(${612 - (tick % 6) * 42} ${346 + Math.cos(tick) * 6})`);
  
          drawChart("chart-flow", state.flowIn, state.flowOut);
          drawChart("chart-io", state.flowIn.map(v => v * 1.03), state.flowOut.map(v => v * 0.98));
          updateEvents();
  
          const now = new Date();
          const day = ["일", "월", "화", "수", "목", "금", "토"][now.getDay()];
          $("wms-clock").textContent = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} (${day}) ${now.toTimeString().slice(0, 8)}`;
        }
  
        buildStatic();
        step();
        setInterval(step, 2600);
      })();
    
}


function init_robot() {
  
      (function () {
        const root = document.getElementById("robot-control-page");
      const robots = [
        { id: "HMD-01", type: "Humanoid", state: "작업 중", stateClass: "badge", battery: 86, job: "조립 작업 · Line 3", zone: "A동 1F-07", risk: "없음", img: "3% 47%" },
        { id: "HMD-02", type: "Humanoid", state: "경고", stateClass: "badge red", battery: 22, job: "충전 복귀 · A동 1F-08", zone: "A동 1F-08", risk: "배터리 부족", img: "94% 47%" },
        { id: "HMD-03", type: "Humanoid", state: "가동 중", stateClass: "badge green", battery: 90, job: "검수 · 품질 검사", zone: "A동 1F-09", risk: "없음", img: "50% 47%" },
        { id: "AMR-03", type: "AMR", state: "충전 중", stateClass: "badge orange", battery: 45, job: "원료 스테이징", zone: "A동 1F-02", risk: "충전 대기", img: "50% 47%" },
        { id: "AMR-12", type: "AMR", state: "작업 중", stateClass: "badge", battery: 74, job: "팔렛트 이동", zone: "A동 1F-03", risk: "없음", img: "3% 47%" }
      ];
      const livePaths = {
        "HMD-01": [{ x: 17, y: 55 }, { x: 30, y: 48 }, { x: 45, y: 62 }, { x: 58, y: 70 }],
        "HMD-02": [{ x: 73, y: 53 }, { x: 80, y: 61 }, { x: 84, y: 72 }, { x: 70, y: 76 }],
        "HMD-03": [{ x: 58, y: 72 }, { x: 50, y: 60 }, { x: 63, y: 38 }, { x: 77, y: 31 }],
        "AMR-03": [{ x: 42, y: 39 }, { x: 55, y: 40 }, { x: 66, y: 48 }, { x: 73, y: 62 }],
        "AMR-12": [{ x: 76, y: 24 }, { x: 61, y: 26 }, { x: 43, y: 33 }, { x: 31, y: 45 }]
      };
      const liveStates = [
        { state: "작업 중", stateClass: "badge", marker: "work" },
        { state: "가동 중", stateClass: "badge green", marker: "" },
        { state: "충전 중", stateClass: "badge orange", marker: "charge" },
        { state: "경고", stateClass: "badge red", marker: "alert" }
      ];
      const pathIndex = Object.fromEntries(robots.map(robot => [robot.id, 0]));
  
        const table = root.querySelector("#robot-table");
        function drawRows(activeId) {
          table.innerHTML = robots.map(robot => {
            const tone = robot.state === "경고" ? "red" : robot.state === "충전 중" ? "orange" : robot.state === "가동 중" ? "green" : "";
            return `<tr class="${robot.id === activeId ? "active-row" : ""}"><td>${robot.id}</td><td>${robot.type}</td><td><span class="badge ${tone}">${robot.state}</span></td><td>${robot.battery}%</td><td>${robot.zone}</td></tr>`;
          }).join("");
        }
  
      function selectRobot(id) {
        const robot = robots.find(item => item.id === id) || robots[0];
          root.querySelectorAll(".marker").forEach(btn => btn.classList.toggle("active", btn.dataset.id === robot.id));
          root.querySelector("#robot-id").textContent = robot.id;
          root.querySelector("#robot-task").textContent = robot.job;
          root.querySelector("#robot-state").className = robot.stateClass;
          root.querySelector("#robot-state").textContent = robot.state;
          root.querySelector("#battery-bar").style.setProperty("--battery", robot.battery + "%");
          root.querySelector("#robot-meta").textContent = `배터리 ${robot.battery}% · ETA 12분 · LiDAR 정상`;
          root.querySelector("#detail-type").textContent = robot.type;
          root.querySelector("#detail-job").textContent = robot.job.split(" · ")[0];
          root.querySelector("#detail-zone").textContent = robot.zone;
          root.querySelector("#detail-risk").textContent = robot.risk;
          root.querySelector("#robot-img").style.setProperty("--robot-pos", robot.img);
        drawRows(robot.id);
      }
  
      function syncMarker(robot) {
        const marker = root.querySelector(`.marker[data-id="${robot.id}"]`);
        if (!marker) return;
        const point = livePaths[robot.id][pathIndex[robot.id] % livePaths[robot.id].length];
        marker.style.setProperty("--x", point.x + "%");
        marker.style.setProperty("--y", point.y + "%");
        marker.classList.remove("work", "charge", "alert");
        const state = liveStates.find(item => item.state === robot.state);
        if (state && state.marker) marker.classList.add(state.marker);
      }
  
      function tickLiveMap() {
        robots.forEach((robot, index) => {
          pathIndex[robot.id] += 1;
          if (robot.id !== "HMD-02" || pathIndex[robot.id] % 4 !== 0) {
            const state = liveStates[(pathIndex[robot.id] + index) % 3];
            robot.state = state.state;
            robot.stateClass = state.stateClass;
            robot.risk = state.state === "충전 중" ? "충전 대기" : "없음";
          } else {
            robot.state = "경고";
            robot.stateClass = "badge red";
            robot.risk = "배터리 부족";
          }
          robot.battery = Math.max(18, Math.min(96, robot.battery + (robot.state === "충전 중" ? 3 : -1)));
          syncMarker(robot);
        });
        const active = root.querySelector(".marker.active");
        const activeId = active ? active.dataset.id : "HMD-01";
        const activeRobot = robots.find(item => item.id === activeId);
        if (activeRobot) selectRobot(activeRobot.id);
        root.querySelector("#alert-count").textContent = String(robots.filter(item => item.state === "경고").length);
        root.querySelector("#charge-count").textContent = String(robots.filter(item => item.state === "충전 중").length + 2);
        root.querySelector("#running-count").textContent = String(robots.filter(item => item.state !== "경고").length + 27);
      }
  
        root.querySelectorAll(".marker").forEach(btn => {
          btn.addEventListener("click", () => selectRobot(btn.dataset.id));
        });
  
        root.querySelectorAll("[data-floor]").forEach(btn => {
          btn.addEventListener("click", () => {
            root.querySelectorAll("[data-floor]").forEach(item => item.classList.remove("active"));
            btn.classList.add("active");
            const isB1 = btn.dataset.floor === "B1";
            root.querySelector("#running-count").textContent = isB1 ? "29" : "32";
            root.querySelector("#working-count").textContent = btn.dataset.floor === "2F" ? "21" : "24";
            root.querySelector("#charge-count").textContent = isB1 ? "6" : "4";
          });
        });
  
        root.querySelector("#auto-mode").addEventListener("change", event => {
          root.querySelector("#auto-label").textContent = event.target.checked ? "자동 최적 경로" : "관리자 승인 필요";
        });
  
        root.querySelectorAll(".nav button").forEach(btn => {
          btn.addEventListener("click", () => {
            root.querySelectorAll(".nav button").forEach(item => item.classList.remove("active"));
            btn.classList.add("active");
          });
        });
  
        root.querySelectorAll(".request-actions .mini-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            btn.closest(".request-item").querySelector(".small").textContent = btn.textContent === "승인" ? "승인 완료 · 자동 반영 대기" : "상세 검토로 전환";
          });
        });
  
      robots.forEach(syncMarker);
      selectRobot("HMD-01");
      setInterval(tickLiveMap, 2600);
      if (window.lucide) window.lucide.createIcons({ attrs: { width: 16, height: 16 } });
      }());
    
}

const initializers = {
  command: init_command,
  mes: init_mes,
  quality: init_quality,
  wms: init_wms,
  robot: init_robot
};

const initialized = new Set();

function setClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;
  clock.textContent = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

function activateRoute(routeId, replace = false) {
  const route = routes.find((item) => item.id === routeId) || routes[0];
  document.querySelectorAll(".legacy-page").forEach((page) => {
    const active = page.dataset.page === route.id;
    page.hidden = !active;
    page.classList.toggle("is-active", active);
  });
  document.querySelectorAll(".app-nav__item").forEach((button) => {
    const active = button.dataset.route === route.id;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.getElementById("route-title").textContent = route.title;
  document.getElementById("route-subtitle").textContent = route.subtitle;

  if (!initialized.has(route.id) && typeof initializers[route.id] === "function") {
    initializers[route.id]();
    initialized.add(route.id);
  }

  const url = "#" + route.id;
  if (replace) {
    history.replaceState(null, "", url);
  } else if (location.hash !== url) {
    history.pushState(null, "", url);
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-route]");
  if (!button) return;
  activateRoute(button.dataset.route);
});

window.addEventListener("hashchange", () => {
  activateRoute(location.hash.replace("#", "") || routes[0].id, true);
});

setClock();
setInterval(setClock, 1000);
activateRoute(location.hash.replace("#", "") || routes[0].id, true);

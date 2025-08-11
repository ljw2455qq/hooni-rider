// --- HTML 요소 선택 ---
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetDistBtn = document.getElementById('resetDist');
const exportDataBtn = document.getElementById('exportData');
const statusSpan = document.getElementById('status');

const latValue = document.getElementById('latitude');
const lonValue = document.getElementById('longitude');
const accuracyValue = document.getElementById('accuracy');
const speedValue = document.getElementById('speed');
const totalDistanceValue = document.getElementById('totalDistance');
const routeLog = document.getElementById('routeLog');

// --- 전역 상태 변수 ---
let watchID = null; // navigator.geolocation.watchPosition의 ID
let totalDistance = 0;
let lastPosition = null;
const routePoints = [];

// --- Haversine 공식을 사용한 거리 계산 (킬로미터 단위) ---
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // 지구의 평균 반경 (미터)
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c) / 1000; // 미터를 킬로미터로 변환
}

// --- UI 업데이트 함수 ---
function updateUI() {
    totalDistanceValue.textContent = `${totalDistance.toFixed(2)} km`;
}

function updateStatus(message, isActive) {
    statusSpan.textContent = message;
    statusSpan.className = `status ${isActive ? 'active' : 'inactive'}`;
}

function addLog(message) {
    const p = document.createElement('p');
    p.textContent = message;
    routeLog.prepend(p);
}

// --- Geolocation API 성공 콜백 ---
function success(position) {
    const coords = position.coords;

    // UI 업데이트
    latValue.textContent = coords.latitude.toFixed(6);
    lonValue.textContent = coords.longitude.toFixed(6);
    accuracyValue.textContent = `${coords.accuracy.toFixed(1)} m`;
    speedValue.textContent = coords.speed ? `${(coords.speed * 3.6).toFixed(1)} km/h` : 'N/A'; // m/s를 km/h로 변환

    const currentPosition = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: position.timestamp,
        accuracy: coords.accuracy
    };

    // 거리 계산
    if (lastPosition) {
        const distance = calculateDistance(
            lastPosition.latitude, lastPosition.longitude,
            currentPosition.latitude, currentPosition.longitude
        );
        totalDistance += distance;
    }

    lastPosition = currentPosition;
    routePoints.push(currentPosition);

    updateUI();
    addLog(`위치 업데이트: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
}

// --- Geolocation API 오류 콜백 ---
function error(err) {
    updateStatus(`GPS 오류: ${err.message}`, false);
    console.warn(`GPS ERROR(${err.code}): ${err.message}`);
}

// --- 버튼 이벤트 핸들러 ---
function startTracking() {
    if ('geolocation' in navigator) {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        watchID = navigator.geolocation.watchPosition(success, error, options);
        startBtn.disabled = true;
        stopBtn.disabled = false;
        updateStatus('GPS 추적 시작', true);
        addLog('--- 추적 시작 ---');
    } else {
        alert('이 브라우저는 GPS를 지원하지 않습니다.');
    }
}

function stopTracking() {
    if (watchID !== null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        updateStatus('GPS 추적 중지', false);
        addLog('--- 추적 중지 ---');
    }
}

function resetDistance() {
    stopTracking();
    totalDistance = 0;
    lastPosition = null;
    routePoints.length = 0; // 배열 비우기
    updateUI();
    updateStatus('거리 초기화 완료', false);
    routeLog.innerHTML = '<div>추적 로그가 여기에 표시됩니다…</div>';
}

function exportData() {
    if (routePoints.length === 0) {
        alert('내보낼 데이터가 없습니다.');
        return;
    }

    const dataStr = JSON.stringify(routePoints, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gps_route_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('경로 데이터가 gps_route_data.json 파일로 저장되었습니다.');
}

// --- 이벤트 리스너 연결 ---
startBtn.addEventListener('click', startTracking);
stopBtn.addEventListener('click', stopTracking);
resetDistBtn.addEventListener('click', resetDistance);
exportDataBtn.addEventListener('click', exportData);

// --- 초기 UI 상태 설정 ---
updateUI();
updateStatus('준비 완료', false);

// ① 현재 위치 가져오기 (navigator.geolocation)
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation API not supported'));
    } else {
      navigator.geolocation.getCurrentPosition(
        pos => resolve(pos.coords),
        err => reject(err)
      );
    }
  });
}

// ② RTIRL API 호출 (origin / destination 필요)
//    origin : 현재 위치, dest   : 1km 북쪽(예시) 거리
function fetchDistance(origin, dest) {
  const url = new URL('https://overlays.rtirl.com/distance/km.html');
  url.searchParams.set('key', 'zeoeyze9htbyx455'); // 기존 키 그대로 사용

  // API가 origin/destination 파라미터를 받는다고 가정
  // (예: origin=lat,lng, dest=lat,lng)
  url.searchParams.set(
    'origin',
    `${origin.latitude},${origin.longitude}`
  );
  url.searchParams.set('destination', `${dest.lat},${dest.lng}`);

  return fetch(url.toString()).then(r => r.json());
}

// ③ 거리 표시 함수
async function showDistance() {
  const output = document.getElementById('output');
  try {
    // 현재 위치 가져오기
    const coords = await getCurrentPosition();

    // 예시: 1km 북쪽 좌표를 계산 (약 0.009° ≈ 1km)
    const destLat = coords.latitude + 0.009;
    const destLng = coords.longitude;

    // RTIRL 호출
    const data = await fetchDistance(
      { latitude: coords.latitude, longitude: coords.longitude },
      { lat: destLat, lng: destLng }
    );

    output.textContent = `키로수 (거리): ${data.distance_km.toFixed(2)} km`;
  } catch (err) {
    console.error(err);
    output.textContent = '키로수 계산 실패';
  }
}

// 페이지 로드 시 실행
window.addEventListener('load', showDistance);

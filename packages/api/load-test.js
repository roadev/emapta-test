import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 50 },
    { duration: "30s", target: 0 },
  ],
};

const BASE_URL = "http://localhost:5000";
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzNlMWFlMzdiNzc3Y2ZmMWIyNWQ5MCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTc0MDk1ODM4MCwiZXhwIjoxNzQxNTYzMTgwfQ.YROWymrrskrsT7SlVMRy9COFOQs6mHewYdNRffYwpbQ";

export default function () {
  let res = http.get(`${BASE_URL}/api/patients?page=1&limit=10`, {
    headers: { Authorization: TOKEN },
  });
  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  let payload = JSON.stringify({
    name: "Test User",
    gender: "Male",
    dob: "1990-01-01",
  });
  let postRes = http.post(`${BASE_URL}/api/patients`, payload, {
    headers: { "Content-Type": "application/json", Authorization: TOKEN },
  });
  check(postRes, {
    "POST status is 201": (r) => r.status === 201,
  });

  sleep(1);
}

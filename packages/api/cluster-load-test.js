import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "30s", target: 200 },
    { duration: "1m", target: 200 },
    { duration: "30s", target: 0 }
  ]
};

export default function () {
  let res = http.get("http://localhost:5000/api/worker");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "workerId is present": (r) => r.json("workerId") !== undefined,
  });

  console.log(`Worker ID: ${res.json("workerId")}`);
  
  sleep(1);
}

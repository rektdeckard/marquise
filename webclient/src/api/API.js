import axios from "axios";

export default axios.create({
  baseURL: "https://api.jsonbin.io/v3/b/5f0cd935292de94c174fe2d9",
  headers: {
    // "secret-key":
    //   "$2b$10$AOXx.uD.2vMLIWBhNRyF6.qDasREvbbmaKmPVNtaPgkT/0pF7S52q",
    "Content-Type": "application/json",
    "X-Master-Key": "$2b$10$AOXx.uD.2vMLIWBhNRyF6.qDasREvbbmaKmPVNtaPgkT/0pF7S52q",
    "X-Bin-Versioning": false,
  },
});

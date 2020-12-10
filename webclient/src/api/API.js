import axios from "axios";

export default axios.create({
  baseURL: "https://jsonbin.org/rektdeckard/marquise",
  headers: {
    // "secret-key":
    //   "$2b$10$AOXx.uD.2vMLIWBhNRyF6.qDasREvbbmaKmPVNtaPgkT/0pF7S52q",
    "Content-Type": "application/json",
    // "X-Master-Key": "$2b$10$AOXx.uD.2vMLIWBhNRyF6.qDasREvbbmaKmPVNtaPgkT/0pF7S52q",
    "authorization": "token c5dae7e7-9bed-4859-a8a7-8a13d8746339",
    // "X-Bin-Versioning": false,
  },
});

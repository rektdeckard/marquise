import axios from "axios";

export default axios.create({
  baseURL: "https://api.jsonbin.io/b/5ef17e1f97cb753b4d160c53",
  headers: {
    "secret-key":
      "$2b$10$AOXx.uD.2vMLIWBhNRyF6.qDasREvbbmaKmPVNtaPgkT/0pF7S52q",
    "Content-Type": "application/json",
    versioning: false,
  },
});

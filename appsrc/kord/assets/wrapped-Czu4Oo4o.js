import { af as wrap } from "./index-DkPzNcWn.js";
const worker = new Worker(new URL(
  /* @vite-ignore */
  "/assets/worker-BsqaKNPO.js",
  import.meta.url
), {
  type: "module"
});
const wrapped = wrap(worker);
const getGuildFoldersFromProto = wrapped.getGuildFoldersFromProto;
const createInflateInstance = wrapped.createInflateInstance;
export {
  createInflateInstance,
  getGuildFoldersFromProto
};
//# sourceMappingURL=wrapped-Czu4Oo4o.js.map

// libs/mysql-safe.js
import pool, { safeQuery } from "./mysql";

// Proxy que reemplaza pool.query por safeQuery automáticamente
const poolSafe = new Proxy(pool, {
    get(target, prop) {
        if (prop === "query") {
            return safeQuery;
        }
        return target[prop];
    },
});

export default poolSafe;

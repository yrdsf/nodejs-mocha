import http from "http";
import Koa from "koa";
import logger from "koa-logger";
import helmet from "koa-helmet";
import compress from "koa-compress";
import yenv from "yenv";

import routers from "./routes/api";

const env = yenv();
const app = new Koa();
const PORT = env.PORT;
const dbInstanceManager = require('./repositories/dbObjectManager');

dbInstanceManager.fetchAllDbs()
    .then(() => {
        http
        .createServer(
            app
            .use(
                helmet.contentSecurityPolicy({
                directives: {
                    defaultSrc: ["'self'"]
                }
                })
            )
            .use(helmet.hidePoweredBy())
            .use(
                compress({
                threshold: 2048,
                flush: require("zlib").Z_SYNC_FLUSH
                })
            )
            .use(logger())
            .use(routers.routes())
            .use(routers.allowedMethods())
            .callback()
        )
        .listen(PORT, "0.0.0.0", () => console.log(`Server listening on PORT: ${PORT}`))
        .on("error", err => console.log("Server error", err));
    }, () => {
        console.log('Application not started because at least one connectionString was unsuccessful...');
    })
    .catch((error) => {
        console.log('Catch in promise all');
        console.log(error);
    });

export default app;
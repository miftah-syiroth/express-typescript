import { web } from "./application/web";
import CONFIG from "./libs/config";

web.listen(CONFIG.PORT, () => {
    console.log('Listening on port: ' + CONFIG.PORT);
});

import container from './ioc/Container';
import { IoCTypes } from './ioc/IoCTypes';
import PromClient from './PromClient';
import HttpServer from './HttpServer';
import LogProbe from './LogProbe';
import A2SProbe from './A2SProbe';

/* Import and load dotenv first */
import 'dotenv/config';

/* Initialize the prometheus client */
container.bind<PromClient>(IoCTypes.PromClient).toConstantValue(new PromClient());

/* Initialize the http server */
container.bind<HttpServer>(IoCTypes.PromClient).toConstantValue(new HttpServer());

/* Initialize various probes */
container.bind<LogProbe>(IoCTypes.LogProbe).toConstantValue(new LogProbe());
container.bind<A2SProbe>(IoCTypes.A2SProbe).toConstantValue(new A2SProbe());
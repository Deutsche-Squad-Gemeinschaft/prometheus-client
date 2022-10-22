import 'reflect-metadata';
import { Container } from "inversify";
import { IoCTypes } from './IoCTypes';
import PromClient from '../PromClient';

const container = new Container();

container.bind<PromClient>(IoCTypes.PromClient).to(PromClient).inSingletonScope();

export default container;
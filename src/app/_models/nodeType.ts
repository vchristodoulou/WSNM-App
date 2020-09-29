import { Memory } from './memory';
import { Radio } from './radio';
import { Sensor } from './sensor';


export interface NodeType {
  _id: string;
  platform: string;
  processor: string;
  memory: Memory;
  radio: Radio;
  sensors: Sensor[];
}

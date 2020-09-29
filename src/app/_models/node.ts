import { Location } from './location';


export class Node {
  _id: string;
  id: string;
  nodetype_id: string;
  gateway_id: string;
  location: Location;
  image_name: string;
  flashed: string;
  status: string;
  checked: boolean;
  spinner: boolean;
}

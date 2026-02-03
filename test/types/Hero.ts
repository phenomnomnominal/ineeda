// Utilities:
import * as Promise from 'bluebird';
import { Observable } from 'rxjs';

// Dependencies:
import Weapon from './Weapon';

export default class Hero {
    public currentTool: any;
    public tools: Array<any>;
    public isBrave: boolean;
    public age: number;
    public name: string;
    public weapon: Weapon;
    public holdOut: Promise<any>;
    public victories$: Observable<number>;
}

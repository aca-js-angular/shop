import { User, FirebaseTimestamp } from './user.interface';
import { DatabaseFireService } from '../database-fire.service';

export class PersonalInfo{

    registered: Date;
    lastActivity: Date;

    constructor(user: User, private db: DatabaseFireService){
        this.registered = this.toDate(user.registeredDate as FirebaseTimestamp);
        this.db.getCollection('products').subscribe(res => {
            
        })

    }

    toDate(timestamp: FirebaseTimestamp): Date{
        return new Date(timestamp.seconds * 1000)
    }
}
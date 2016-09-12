/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */


interface UserSchema {
    id?: string;
    firstName?: string;
    lastName?: string;
}

export class User implements UserSchema {

    id: string;
    firstName: string;
    lastName: string;

    constructor(args: UserSchema) {
        this.id = args.id;
        this.firstName = args.firstName;
        this.lastName = args.lastName;
    }

    isEqual({user}: {user: User}) {
        return this === user;
    }

}

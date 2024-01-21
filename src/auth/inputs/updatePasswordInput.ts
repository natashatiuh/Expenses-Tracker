export class UpdatePasswordInput {
    newPassword: string
    oldPassword: string
    userId: string

    constructor(newPassword: string, oldPassword: string, userId: string) {
        this.newPassword = newPassword
        this.oldPassword = oldPassword
        this.userId = userId
    }
}
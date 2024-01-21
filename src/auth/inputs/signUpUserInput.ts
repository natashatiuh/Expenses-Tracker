export class SignUpUserInput {
    userName: string
    password: string
    country: string

    constructor(userName: string, password: string, country: string) {
        this.userName = userName
        this.password = password
        this.country = country
    }
}
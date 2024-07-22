export interface AccountDto {
    id: string;
    name: string;
    secretKeyPath: string;
    address: string;
    password: string;
}

export interface PostAccountDto {
    name: string;
    password: string;
}
export type RegisterUserResponse = {
    id: string;
    email: string;
} | {
    statusCode: number;
    message: string;
}
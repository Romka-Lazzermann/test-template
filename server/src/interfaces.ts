export enum UserRole {
    ADMIN = "admin"
}

export interface LoginCredentials {
    login : string,
    password: string
}

export interface MulterRequest extends Request {
  file: Express.Multer.File; 
}
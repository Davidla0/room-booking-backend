
export interface RegisterInput {
    email: string;
    password: string;
    fullName: string;
}
  
export interface LoginInput {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    createdAt: string;
}
  
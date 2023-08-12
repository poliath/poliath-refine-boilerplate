export interface IUserRole {
    id: string;
    name: string;
}

export const userRoles: IUserRole[] = [
    { id: "1", name: "Admin" },
    { id: "2", name: "User" },
];
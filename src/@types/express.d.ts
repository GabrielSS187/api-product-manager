declare namespace Express {
  export interface Request{
    userRole: "admin" | "normal";
  }
}
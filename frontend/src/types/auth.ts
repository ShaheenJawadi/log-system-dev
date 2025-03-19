export type LoginCredentials = {
    username: string;   
    password: string;
  }
   
  export type RegisterCredentials = {
    first_name:string;
    last_name:string;
    username: string;
    password: string;
    email: string;
  }


  export type User = {
    first_name:string;
    last_name:string;
    username: string; 
    email: string;
  }


  export type Token = {
    refresh:string;
    access:string;
  }

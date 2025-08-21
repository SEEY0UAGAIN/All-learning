interface User {
    name: string,
    age: number,
    isStudent?: boolean 
}

type Product = {
    id: number,
    name: string,
    price: number
}

type ID = string | number;

type Admin = User & { role: "admin"};

const user1: User = { name: "John", age: 30 };
const user2: User = { name: "Jane", age: 25, isStudent: true };

console.log(user1);
console.log(user2);

const product1: Product = { id: 1, name: "IPhone", price: 30000 };
console.log(product1);

const userId: ID = 123;
const userId2: ID = "abc123";
console.log(userId);
console.log(userId2);

const admin: Admin = { name: "Admin", age: 24, role: "admin"}
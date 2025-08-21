let username: string = "JJJ";
let userage: number = 23;
let isDeveloper: boolean = true;
let scores: number[] = [90,85,80];
let users: [string, number, number[]] = ["KKK", 25, [90, 75, 80]];

function sum(a: number, b: number): number {
    return a + b;
}

console.log(sum(7,14));

function introduce(name: string, age?: number): string {
    if (age) return `Hello ${name}, age ${age}`;
    return `HI ${name}`;
}

console.log(introduce("JJJJJ"));
console.log(introduce("KKKKK", 30));

const multiplyArray = (nums: number[]): number => {
    return nums.reduce((acc, curr) => acc * curr, 1);
}

console.log(multiplyArray([2, 3, 6]));

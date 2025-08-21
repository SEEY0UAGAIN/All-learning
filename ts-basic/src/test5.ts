let id: string | number;

type Person = {name: string, age: number};
type Employee = {employeeId: number};

type Staff = Person & Employee;

const staff: Staff = {name:"JJJ" , age:23 , employeeId: 101};
console.log(staff);

type Status = "success" | "error" | "pending";
let currentStatus: Status = "success";

function printValue(value: string | number) {
    if (typeof value === "string") {
        console.log("String length:", value.length);
    } else {
        console.log("Number squared:", value * value);
    }
}

function identity<T>(arg: T): T {
    return arg;
}

let output1 = identity<string>("Hello");
let output2 = identity<number>(123);

console.log(output1);
console.log(output2);
var id;
var staff = { name: "JJJ", age: 23, employeeId: 101 };
console.log(staff);
var currentStatus = "success";
function printValue(value) {
    if (typeof value === "string") {
        console.log("String length:", value.length);
    }
    else {
        console.log("Number squared:", value * value);
    }
}
function identity(arg) {
    return arg;
}
var output1 = identity("Hello");
var output2 = identity(123);
console.log(output1);
console.log(output2);

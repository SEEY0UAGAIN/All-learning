var username = "JJJ";
var userage = 23;
var isDeveloper = true;
var scores = [90, 85, 80];
var users = ["KKK", 25, [90, 75, 80]];
function sum(a, b) {
    return a + b;
}
console.log(sum(7, 14));
function introduce(name, age) {
    if (age)
        return "Hello ".concat(name, ", age ").concat(age);
    return "HI ".concat(name);
}
console.log(introduce("JJJJJ"));
console.log(introduce("KKKKK", 30));
var multiplyArray = function (nums) {
    return nums.reduce(function (acc, curr) { return acc * curr; }, 1);
};
console.log(multiplyArray([2, 3, 6]));

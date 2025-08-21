class Person1 {
    public name: string;
    protected age: number;

    constructor (name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    greet(): void {
        console.log(`Hi, I am ${this.name}, age ${this.age}`);
    }

}

class Student extends Person1 {
    studentId: number;

    constructor (name: string, age: number, studentId: number) {
        super(name,age);
        this.studentId = studentId;
    }

    greet(): void {
        console.log(`Hello, I am ${this.name}, age ${this.age}, StudentID ${this.studentId}`);
    }
}

const p = new Person1 ("JJJ",24);
p.greet();

const s = new Student ("KKK", 25, 1);
s.greet();
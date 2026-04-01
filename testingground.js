/*
  JavaScript Classes Refresher Script
  Run with: node testingground.js

  This file covers:
  1) Object constructor vs class
  2) Getters and setters
  3) Basic class syntax
  4) Inheritance with classes
  5) Private class fields and methods
  6) Static properties and methods
*/

// Simple divider helper so console output is easier to read.
function section(title) {
  console.log(`\n=== ${title} ===`);
}

// ---------------------------------------------------------------------------
// 1) OBJECT CONSTRUCTOR VS CLASS
// ---------------------------------------------------------------------------
section("1) Constructor Function vs Class");

// Constructor function style (older, pre-ES6 style).
function PersonConstructor(name, age) {
  this.name = name;
  this.age = age;
}

// Methods are typically attached to the prototype so instances share one copy.
PersonConstructor.prototype.greet = function greet() {
  return `Hi, I'm ${this.name} (${this.age}). [from constructor function]`;
};

const constructorPerson = new PersonConstructor("Ava", 25);
console.log(constructorPerson.greet());

// Class style (ES6+): cleaner syntax built on prototypes under the hood.
class PersonClass {
  // constructor() is where instance properties are initialized.
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // Method syntax inside class body; also placed on prototype.
  greet() {
    return `Hi, I'm ${this.name} (${this.age}). [from class]`;
  }
}

const classPerson = new PersonClass("Liam", 27);
console.log(classPerson.greet());

console.log(
  "Both approaches create objects with shared prototype methods; class syntax is cleaner and easier to organize.",
);

// ---------------------------------------------------------------------------
// 2 + 3) BASIC CLASS SYNTAX WITH GETTERS AND SETTERS
// ---------------------------------------------------------------------------
section("2 & 3) Basic Class Syntax + Getters/Setters");

class Book {
  // Private storage field (cannot be accessed outside class directly).
  #title;

  constructor(title, author, pages) {
    // Use setters so validation logic is reused during object creation.
    this.title = title;
    this.author = author;
    this.pages = pages;
  }

  // Getter: allows property-like read access (book.title).
  get title() {
    return this.#title;
  }

  // Setter: allows property-like write access with validation.
  set title(value) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error("Title must be a non-empty string.");
    }
    this.#title = value.trim();
  }

  get summary() {
    return `${this.title} by ${this.author}, ${this.pages} pages`;
  }
}

const book = new Book("The Hobbit", "J.R.R. Tolkien", 310);
console.log("Initial title via getter:", book.title);

book.title = "The Fellowship of the Ring";
console.log("Updated summary:", book.summary);

try {
  // This triggers setter validation and throws.
  book.title = "";
} catch (error) {
  console.log("Setter validation example:", error.message);
}

// ---------------------------------------------------------------------------
// 4) INHERITANCE WITH CLASSES
// ---------------------------------------------------------------------------
section("4) Inheritance (extends + super)");

class Player {
  constructor(name, marker) {
    this.name = name;
    this.marker = marker;
  }

  describe() {
    return `${this.name} uses marker '${this.marker}'`;
  }
}

// HumanPlayer inherits from Player.
class HumanPlayer extends Player {
  constructor(name, marker, favoriteOpeningMove) {
    // super(...) calls parent constructor first.
    super(name, marker);
    this.favoriteOpeningMove = favoriteOpeningMove;
  }

  // Method overriding: customize parent behavior.
  describe() {
    return `${super.describe()} and prefers opening at ${this.favoriteOpeningMove}`;
  }
}

const playerOne = new HumanPlayer("Rahul", "X", "center");
console.log(playerOne.describe());

// ---------------------------------------------------------------------------
// 5) PRIVATE CLASS FIELDS AND METHODS
// ---------------------------------------------------------------------------
section("5) Private Fields and Methods (#)");

class BankAccount {
  // Private field: only accessible inside class.
  #balance = 0;

  constructor(owner) {
    this.owner = owner;
  }

  // Public method that uses private helper.
  deposit(amount) {
    this.#assertValidAmount(amount);
    this.#balance += amount;
    return this.#balance;
  }

  withdraw(amount) {
    this.#assertValidAmount(amount);
    if (amount > this.#balance) {
      throw new Error("Insufficient funds.");
    }
    this.#balance -= amount;
    return this.#balance;
  }

  getBalance() {
    return this.#balance;
  }

  // Private method: internal validation logic.
  #assertValidAmount(amount) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Amount must be a positive number.");
    }
  }
}

const account = new BankAccount("Sam");
account.deposit(200);
account.withdraw(50);
console.log(`${account.owner}'s balance:`, account.getBalance());
console.log("Private members are not accessible outside the class.");

// ---------------------------------------------------------------------------
// 6) STATIC PROPERTIES AND METHODS
// ---------------------------------------------------------------------------
section("6) Static Properties and Methods");

class MathHelper {
  // Static property belongs to class itself, not each instance.
  static description = "Utility math helpers";

  // Static method is called on class: MathHelper.square(4)
  static square(n) {
    return n * n;
  }

  // Instance method is called on object created with new.
  cube(n) {
    return n * n * n;
  }
}

console.log("Static property:", MathHelper.description);
console.log("Static method square(5):", MathHelper.square(5));

const helperInstance = new MathHelper();
console.log("Instance method cube(3):", helperInstance.cube(3));
console.log(
  "Static members are for class-level behavior/data; instance members are for object-level behavior/data.",
);

// ---------------------------------------------------------------------------
// QUICK RECAP IN PLAIN WORDS
// ---------------------------------------------------------------------------
section("Quick Recap");
console.log("- Constructor function and class both create objects.");
console.log("- Class is cleaner syntax over prototypes.");
console.log("- Getters/setters look like properties but run logic.");
console.log("- Inheritance uses extends + super.");
console.log("- #private fields/methods hide internal data/logic.");
console.log("- static members belong to the class itself.");
console.log("- ES6 modules help split features into reusable files.");

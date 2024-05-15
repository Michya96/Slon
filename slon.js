// Importing readline to read input data
const readline = require("node:readline");

// Array to parse input of strings into numbers
parseArrayOfString = (arrayOfString, arrayOfNumbers) => {
	for (let i = 1; i < 4; i++) {
		arrayOfString[i].forEach((e) => {
			arrayOfNumbers[i].push(Number(e));
		});
	}
	return arrayOfNumbers;
};

// Algorithm used to find all cycles within the given adjecency list
findCycles = (list) => {
	let cycles = [];
	list.forEach((e) => {
		let cycle = [];
		while (true) {
			cycle.push(e);
			const previ = e;
			e = list.get(e);
			list.delete(previ);
			if (list.get(e) === undefined) return cycles.push(cycle);
		}
	});
	return cycles;
};

// Returning item with lowest mass within given cycle
const findMinInCycle = (cycle, massArray) => {
	return cycle.reduce((prev, curr) =>
		massArray[prev - 1] < massArray[curr - 1] ? prev : curr
	);
};

// Returning sum of masses within given cycle
const sumOfMass = (cycle, massArray) => {
	const newArray = [];
	cycle.forEach((e) => newArray.push(massArray[e - 1]));
	return newArray.reduce((acc, curr) => acc + curr);
};

// Implementation of method 1 used to move elephants within given cycle
const method1 = (cycle, massArray) => {
	const C = cycle.length;
	if (C === 1) return 0;
	const totalMass = sumOfMass(cycle, massArray);
	const minInCycle = findMinInCycle(cycle, massArray);
	return totalMass + (C - 2) * massArray[minInCycle - 1];
};

// Implementation of method 2 used to move elephants within given cycle
const method2 = (cycle, massArray, globalMin) => {
	const C = cycle.length;
	const totalMass = sumOfMass(cycle, massArray);
	const minInCycle = findMinInCycle(cycle, massArray);
	return (
		totalMass + massArray[minInCycle - 1] + (C + 1) * massArray[globalMin - 1]
	);
};

// Main function, takes input data and returns sum of masses needed to move elephants into place
const countElephantMass = (n, massArray, startPos, endPos) => {
	// Creating our adjacency list to represent a graph
	const adjacencyList = new Map();
	for (let i = 0; i < n; i++) {
		adjacencyList.set(startPos[i], endPos[i]);
	}
	// For lopp to find lowest global mass in mass array
	let min = massArray[0];
	for (let i = 1; i < n; i++) {
		if (massArray[i] < min) min = massArray[i];
	}
	// Asigning index of global min mass to globalMin
	const globalMin = massArray.indexOf(min) + 1;
	// Finding all cycles present in graph and assigning to constant allCycles
	const allCycles = findCycles(adjacencyList);
	// Using method 1 and method 2 on each cycle, and adding lower of the 2 to sum array
	const sum = [];
	allCycles.forEach((cycle) => {
		sum.push(
			Math.min(method1(cycle, massArray), method2(cycle, massArray, globalMin))
		);
	});
	// Logging and returning the sum of sums of masses
	console.log(sum.reduce((prev, curr) => prev + curr));
	return sum.reduce((prev, curr) => prev + curr);
};

// Creating interface for stdin input
const rl = readline.createInterface({
	input: process.stdin,
});

// Creating array for data from stdin input to be parsed later
var data = [];

// Pushing each line to data array to be parsed later
rl.on("line", (line) => data.push(line));

// On close of our input read, parse data and use it to run algorithm
rl.on("close", () => {
	// Parsing data from array of strings into 4 arrays of numbers
	function parsedata(data) {
		const arrayOfString = [];
		data.forEach(async (e) => arrayOfString.push(e.split(" ")));
		const arrayOfNumbers = [[], [], [], []];
		arrayOfNumbers[0].push(Number(arrayOfString[0]));
		// Using function to parse and push lines 2,3,4 from input data into array of numbers
		parseArrayOfString(arrayOfString, arrayOfNumbers);
		return arrayOfNumbers;
	}

	// Assigning parsed data to result constant
	const result = parsedata(data);

	// Using algorithm on parsed data
	countElephantMass(result[0], result[1], result[2], result[3]);
});

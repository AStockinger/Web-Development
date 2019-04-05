/*
Name: Amy Stockinger
Date: 1/24/2019
CS290_400
*/

function Automobile(year, make, model, type){
    this.year = year; //integer (ex. 2001, 1995)
    this.make = make; //string (ex. Honda, Ford)
    this.model = model; //string (ex. Accord, Focus)
    this.type = type; //string (ex. Pickup, SUV)
}

var automobiles = [ 
    new Automobile(1995, "Honda", "Accord", "Sedan"),
    new Automobile(1990, "Ford", "F-150", "Pickup"),
    new Automobile(2000, "GMC", "Tahoe", "SUV"),
    new Automobile(2010, "Toyota", "Tacoma", "Pickup"),
    new Automobile(2005, "Lotus", "Elise", "Roadster"),
    new Automobile(2008, "Subaru", "Outback", "Wagon")
    ];

/*This function sorts arrays using an arbitrary comparator. You pass it a comparator and 
an array of objects appropriate for that comparator and it will return a new array which 
is sorted with the largest object in index 0 and the smallest in the last index*/
// insertion sort
function sortArr(comparator, array){
    var arrayLength = array.length;
    for(i = 1; i < arrayLength; i++){
        el = array[i];
        for(var j = i - 1; j > -1 && comparator(el, array[j]); j--){
            array[j + 1] = array[j];
        }
        array[j + 1] = el;
    }
    return array;
}

/*A comparator takes two arguments and uses some algorithm to compare them. If the first 
argument is larger or greater than the 2nd it returns true, otherwise it returns false. 
Here is an example that works on integers*/
function exComparator(int1, int2){
    if (int1 > int2){
        return true;
    } else {
        return false;
    }
}

/*For all comparators if cars are 'tied' according to the comparison rules then the order
 of those 'tied' cars is not specified and either can come first*/

/*This compares two automobiles based on their year. Newer cars are "greater" than older cars.*/
function yearComparator(auto1, auto2){
    if(auto1.year > auto2.year){
        return true;
    }
    return false;
}

/*This compares two automobiles based on their make. It should be case insensitive and makes 
which are alphabetically earlier in the alphabet are "greater" than ones that come later.*/
function makeComparator(auto1, auto2){
    if(auto1.make[0].toLowerCase() < auto2.make[0].toLowerCase()){
        return true;
    }
    return false;
}

/*This compares two automobiles based on their type. The ordering from "greatest" to "least" 
is as follows: roadster, pickup, suv, wagon, (types not otherwise listed). It should be case 
insensitive. If two cars are of equal type then the newest one by model year should be considered "greater".*/
function typeComparator(auto1, auto2){
    var typeToNum = function(car){
        switch(car.type.toLowerCase()){
            case "roadster": return 4;
            case "pickup": return 3;
            case "suv": return 2; 
            case "wagon": return 1;
            default: return 0;
        }
    }
    if(typeToNum(auto1) > typeToNum(auto2)){
        return true;
    }
    else if(typeToNum(auto1) == typeToNum(auto2)){
        if(yearComparator(auto1, auto2) == true){
            return true;
        }
        else{
        return false;
        }
    }
    else{
        return false;
    }
}

Automobile.prototype.logMe = function(bool){
    if(bool == true){
        console.log(this.year + " " + this.make + " " + this.model + " " + this.type);
    }
    else{
        console.log(this.year + " " + this.make + " " + this.model);
    }
}

function printArr(array, bool){
    for(i = 0; i < array.length; i++){
        array[i].logMe(bool);
    }
}

/*Your program should output the following to the console.log, including the opening and 
closing 5 stars. All values in parenthesis should be replaced with appropriate values. 
Each line is a seperate call to console.log.

Each line representing a car should be produced via a logMe function. This function should 
be added to the Automobile class and accept a single boolean argument. If the argument is 'true' 
then it prints "year make model type" with the year, make, model and type being the values 
appropriate for the automobile. If the argument is 'false' then the type is ommited and just the 
"year make model" is logged.
As an example of the content in the parenthesis:
1990 Ford F-150 */

console.log("*****");

var yearSort = sortArr(yearComparator, automobiles);
console.log('The cars sorted by year are: ');
printArr(yearSort, false);

var makeSort = sortArr(makeComparator, automobiles);
console.log('The cars sorted by make are: ');
printArr(makeSort, false);

var typeSort = sortArr(typeComparator, automobiles);
console.log('The cars sorted by type are: ');
printArr(typeSort, true);

console.log("*****");
var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPerc = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else{
            this.percentage = -1;
        }
    }

    Expense.prototype.getPerc = function(){
        return this.percentage;
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems:{
            // expenses and income
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    return{
        addItem: function(type, des, val){
            var newItem, ID;

            if(data.allItems[type].length > 0){
                // new ID should be last ID + 1
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else{
                ID = 0;
            }

            if(type == 'exp'){
                newItem = new Expense(ID, des, val);
            }
            else if(type == 'inc'){
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function(type, id){
            var ids, index;
            // the id is not equal to the index because items can be deleted, so find proper index
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id);

            // remove one element at the index of the given id
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate percentage of income spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else{
                data.percentage = -1;
            }
        },
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(current){
                current.calcPerc(data.totals.inc);
            });
        },
        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(current){
                return current.getPerc();
            });
            return allPerc;
        },
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
    }
})();

var UIController = (function(){
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        monthLabel: '.budget__title--month',
        container: '.container', 
        expensesPercentage: '.item__percentage'
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;

        num = Math.abs(num);                // absolute value of num
        num = num.toFixed(2);               // two decimal places
        numSplit = num.split('.');

        int = numSplit[0];                  // add commas to large numbers
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;  // return with appropriate sign
    };

    var nodeListForEach = function(list, callback){
        for(var i = 0; i < list.length; i++){
            callback(list[i], i);
        }
    };

    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        addListItem: function(obj, type){
            var html, newHTML, element;
            // HTML string with placeholders
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type ==='exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace placeholders with data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

            // insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

        },
        deleteListItem: function(selectorID){
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },
        clearFields: function(){
            var fields;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            var fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(current, index, array){
                current.value = "";
            });
            // reset cursor to description
            fieldsArray[0].focus();
        },
        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '--';
            }
        },
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMStrings.expensesPercentage);
            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }
                else{
                    current.textContent = '--';
                }

            });
        },
        displayMonth: function(){
            var now, year, month;
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMStrings.monthLabel).textContent = months[month] + ' ' + year;
        },
        changeType: function(){
            // change input field border when selected depending on input type
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ', ' +
                DOMStrings.inputDescription + ', ' +
                DOMStrings.inputValue
            );
            nodeListForEach(fields, function(current, index){
                current.classList.toggle('red-focus');
            });
            // change add button
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },
        getDOMStrings: function(){
            return DOMStrings;
        }
    };
})();

var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){    
        var DOM = UICtrl.getDOMStrings();

        // if add button is pressed
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // if 'Enter' is pressed
        document.addEventListener('keypress', function(e){
            if(e.keyCode === '13' || e.which === '13'){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };

    var updateBudget = function(){
        // calculate budget
        budgetCtrl.calculateBudget();

        // return budget
        var budget = budgetCtrl.getBudget();

        // dispay budget to UI
        UICtrl.displayBudget(budget);
    }

    var updatePercentages = function(){
        // calculate percentages
        budgetCtrl.calculatePercentages();

        // read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();

        // update UI
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function(){
        // get input data
        var input = UICtrl.getInput();

        // validate input data
        if(input.description !== "" && !isNaN(input.value) && input.value > '0'){
            // add item to budget controller
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // add item to UI and clear form
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();

            // calculate and update budget
            updateBudget();
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(e){
        var itemID, splitID, type, ID;
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID);
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);             // need this to be a number, not a string

            // delete item
            budgetCtrl.deleteItem(type, ID);

            // delete item from UI
            UICtrl.deleteListItem(itemID);

            // update UI
            updateBudget();
            updatePercentages();
        }
    };

    return{
        init: function(){
            UICtrl.displayMonth();
            // start numbers at 0
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            // set up buttons
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();
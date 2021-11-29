let table = document.querySelector('#user-list');
let userListTbody = table.querySelector('tbody');
let submitButton = document.querySelector('#submit');
let editBtn = document.querySelector('.edit-user_button');
let loginInput = document.querySelector('#login-input');
let passwordInput = document.querySelector('#password-input');
let emailInput = document.querySelector('#email-input');
let modal = document.querySelector('#myModal');
let closeButton = document.querySelector('.close');
let question = document.querySelector('.question');

loginInput.value = 'nastia'
passwordInput.value = 'Asdf_-123'
emailInput.value = 'nastiadgaf@gmail.com'

let currentRow = null;

class User {
    constructor() {
        this.loginVal = loginInput.value;
        this.passwordVal = passwordInput.value;
        this.emailVal = emailInput.value;
        this.constructor.userList.push(this);
    }

    static userList = []

    dataFields = [{
            objName: 'login',
            value: loginInput.value,
            regExp: /[a-zA-Z]{1,20}$/,
            element: loginInput,
            constructorVal: this.loginVal
        },
        {
            objName: 'password',
            value: passwordInput.value,
            regExp: /(?=.*[0-9])(?=.*[a-z_])(?=.*[A-Z]){8,15}/g,
            element: passwordInput,
            constructorVal: this.passwordVal,
        },
        {
            objName: 'email',
            value: emailInput.value,
            regExp: /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
            element: emailInput,
            constructorVal: this.emailVal

        }
    ]

    createUserRow() {
        this.userRow = document.createElement('tr');
        this.userRow.classList.add('tr_user');
        this.fillUserRow();
    }

    fillUserRow() {
        let tableCeils = [{
                name: 'id',
                value: this.constructor.userList.length
            },
            {
                name: 'login',
                value: this.loginVal
            },
            {
                name: 'password',
                value: this.passwordVal
            },
            {
                name: 'email',
                value: this.emailVal
            },
            {
                name: 'edit',
                value: '<button class="edit_button">Edit</button>'
            },
            {
                name: 'delete',
                value: '<button class="delete_button">Delete</button>'
            }
        ];
        for (let dataObject of tableCeils) {
            let ceil = document.createElement('td');
            ceil.classList.add('cell');
            ceil.classList.add(dataObject.name);
            ceil.dataset.name = dataObject.name;
            ceil.innerHTML = dataObject.value;
            this.userRow.append(ceil);

            for(let field of this.dataFields){
                if(field.objName === dataObject.name) field["cell"] = ceil;
            }
        }

        userListTbody.append(this.userRow);
    }

    clearInputs() {
        loginInput.value = '';
        passwordInput.value = '';
        emailInput.value = '';
    }

    checkFields() {
        return Boolean(this.loginVal.match(/[a-zA-Z]{1,20}$/) &&
            this.passwordVal.match(/(?=.*[0-9])(?=.*[a-z_])(?=.*[A-Z]){8,15}/g) &&
            this.emailVal.match(/^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/))
    }


    checkField() {
        for (let exp of this.dataFields) {
            let isValid = exp.value.match(exp.regExp);
            let hasInvalidClass = exp.element.classList.contains('wrong');
            if (!isValid ^ hasInvalidClass) exp.element.classList.toggle('wrong');
        }
    }

    request() {
        this.checkField();
        if (this.checkFields()) {
            this.createUserRow();
            question.classList.add('question_hide');
            question.classList.remove('question_show');
            this.clearInputs();
        } else {
            User.userList.pop(this);
            question.classList.remove('question_hide');
            question.classList.add('question_show');
        }
    }

    checkEditField() {
        this.checkField()
        if (this.checkFields()) {
            this.finishEditingUser();
        } else{
            alert(1)
        }
    }

    finishEditingUser() {
        for (let field of this.dataFields) {
            field["cell"].innerHTML = field["element"].value;
            field["constructorVal"] = field["cell"].innerHTML;
            
        }
        currentRow = null;
        this.clearInputs();

    }

    startEditingUser() {
        loginInput.value = this.loginVal;
        passwordInput.value = this.passwordVal;
        emailInput.value = this.emailVal;
    }

    deleteUser() {
        userListTbody.removeChild(currentRow);
        let id = currentRow.children[0].textContent;
        id--;
        User.userList.splice(id, 1);
        currentRow = null;
        for (let i = 1; i <= User.userList.length; i++) {
            let row = userListTbody.rows[i].cells[0];
            row.innerHTML = i;
        }
    }

    changeEditBtn() {
        editBtn.classList.remove('hidden');
        submitButton.classList.add('hidden');
    }

    changeAddBtn() {
        submitButton.classList.remove('hidden');
        editBtn.classList.add('hidden');
    }

}

document.addEventListener('click', function (e) {
    function getUserById(target) {
        let row = target;
        currentRow = row;
        let id = row.children[0].textContent;
        userObj = User.userList[--id];
        return userObj;
    }

    const actionTypes = ['submit_button', 'edit_button', 'delete_button', 'edit-user_button', 'close', 'question']

    let currentType;

    for(let type of actionTypes){
        if(e.target.classList.contains(type)) currentType = type;
    }

    let userObj;

    switch (currentType) {
        case 'submit_button':
            userObj = new User();
            userObj.request();
            break;
        case 'edit_button':
            userObj = getUserById(e.target.closest('tr'));
            userObj.startEditingUser();
            userObj.changeEditBtn();
            break;
        case 'delete_button':
            userObj = getUserById(e.target.closest('tr'));
            userObj.deleteUser();
            break;
        case 'edit-user_button':
            userObj = getUserById(currentRow);
            userObj.checkEditField();
            userObj.changeAddBtn();
            break;
        case 'close':
            modal.classList.add('hidden');
            break;
        case 'question':
            modal.classList.remove('hidden');
            modal.classList.add('show');
            break;
    }


});
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

class User {
    constructor() {
        this.loginVal = loginInput.value;
        this.passwordVal = passwordInput.value;
        this.emailVal = emailInput.value;
        this.constructor.userList.push(this);
        this.currentRow = null;
    }

    static editingRow = null;
    static userList = [];

    dataFields = [{
            objName: 'login',
            value: loginInput.value,
            regExp: /[a-zA-Z]{1,20}$/,
            element: loginInput,
            cell: null
        },
        {
            objName: 'password',
            value: passwordInput.value,
            regExp: /(?=.*[0-9])(?=.*[a-z_])(?=.*[A-Z]){8,15}/g,
            element: passwordInput,
            cell: null
        },
        {
            objName: 'email',
            value: emailInput.value,
            regExp: /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
            element: emailInput,
            cell: null
        }
    ]

    createUserRow() {
        this.userRow = document.createElement('tr');
        this.userRow.classList.add('tr_user');
        this.currentRow = this.userRow
        this.fillUserRow();
    }

    getDataFieldValue(name) {
        const {dataFields} = this;
        return dataFields.find(field => field.objName === name)
    }

    fillUserRow() {
        const {userList} = this.constructor;

        let tableCells = [{
                name: 'id',
                value: userList.length
            },
            {
                name: 'login',
                value: this.getDataFieldValue('login').value
            },
            {
                name: 'password',
                value: this.getDataFieldValue('password').value
            },
            {
                name: 'email',
                value: this.getDataFieldValue('email').value
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
        for (let dataObject of tableCells) {
            let cell = document.createElement('td');
            cell.classList.add('cell');
            cell.classList.add(dataObject.name);
            cell.dataset.name = dataObject.name;
            cell.innerHTML = dataObject.value;
            this.userRow.append(cell);

            for (let field of this.dataFields) {
                if (field.objName === dataObject.name) field.cell = cell;
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
        let isAllCorrect = true;
        for (let field of this.dataFields) {
            const {value,regExp} = field;
            const isCorrect = value.match(regExp);

            if (isCorrect) continue;
            isAllCorrect = false;
            break;
        }
        return isAllCorrect;
    }

    markValidateFields() {
        for (let exp of this.dataFields) {
            let isValid = exp.value.match(exp.regExp);
            let hasInvalidClass = exp.element.classList.contains('wrong');
            if (!isValid ^ hasInvalidClass) exp.element.classList.toggle('wrong');
        }
    }

    changeInputValue() {
        this.getDataFieldValue('login').value = loginInput.value;
        this.getDataFieldValue('password').value = passwordInput.value;
        this.getDataFieldValue('email').value = emailInput.value;
    }

    startEditingUser() {
        loginInput.value = this.getDataFieldValue('login').value;
        passwordInput.value = this.getDataFieldValue('password').value;
        emailInput.value = this.getDataFieldValue('email').value;
        this.constructor.editingRow = this.currentRow;
    }

    finishEditingUser() {
        for (let field of this.dataFields) {
            field.cell.textContent = field.element.value;
            field.value = field.cell.textContent;
        }
        this.clearInputs();
    }

    deleteUser() {
        this.currentRow.remove();
        let id = --this.currentRow.children[0].textContent;
        User.userList.splice(id, 1);
        this.currentRow = null;
        for (let i = 1; i <= User.userList.length; i++) {
            let row = userListTbody.rows[i].cells[0];
            row.innerHTML = i;
        }
        delete this;
    }

    changeEditBtn() {
        editBtn.classList.remove('hidden');
        submitButton.classList.add('hidden');
    }

    changeAddBtn() {
        if (loginInput.value === '' && passwordInput.value === '' && emailInput.value === '') {
            submitButton.classList.remove('hidden');
            editBtn.classList.add('hidden');
        }
    }

    showQuestion() {
        question.classList.remove('question_hide');
        question.classList.add('question_show');
    }

    hideQuestion() {
        question.classList.add('question_hide');
        question.classList.remove('question_show');
    }

}

document.addEventListener('click', function (e) {
    function getUserById(target) {
        User.currentRow = target;
        let id = target.children[0].textContent;
        userObj = User.userList[--id];
        return userObj;
    }

    const actionTypes = ['submit_button', 'edit_button', 'delete_button', 'edit-user_button', 'close', 'question']

    let currentType;

    for (let type of actionTypes) {
        if (e.target.classList.contains(type)) currentType = type;
    }

    let userObj;

    switch (currentType) {
        case 'submit_button':
            userObj = new User();
            userObj.markValidateFields();
            if (userObj.checkFields()) {
                userObj.createUserRow();
                userObj.hideQuestion();
                userObj.clearInputs();
                console.log(User.userList)
            } else {
                User.userList.pop(this);
                console.log(User.userList)
                userObj.showQuestion();
            }
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
            userObj = getUserById(User.currentRow);
            userObj.changeInputValue();
            userObj.markValidateFields();

            if (userObj.checkFields()) {
                userObj.finishEditingUser();
                userObj.hideQuestion();
            } else {
                userObj.showQuestion();
            };
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
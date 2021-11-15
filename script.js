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
            value: this.loginVal,
            regExp: /[a-zA-Z]{1,20}$/,
            element: loginInput
        },
        {
            value: this.passwordVal,
            regExp: /(?=.*[0-9])(?=.*[a-z_])(?=.*[A-Z]){8,15}/g,
            element: passwordInput
        },
        {
            value: this.emailVal,
            regExp: /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
            element: emailInput
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
            ceil.innerHTML = dataObject.value;
            this.userRow.append(ceil);
        }
        
          let titlesOfInputCells = ['login', 'password', 'email'];
          
        //   for(let title of titlesOfInputCells){
        //         for(let field of this.dataFields){
        //             if(field[value] == title)
        //         }
        //   }
          
        userListTbody.append(this.userRow);
    }

    clearInputs() {
        login.value = '';
        password.value = '';
        email.value = '';
    }

    checkFields() {
        return Boolean(this.loginVal.match(regexp) && this.passwordVal.match(regexp2) && this.email.match(regexp3))
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
        this.checkFields()
        if (this.checkFields()) {
            this.fillInputs();
        }
    }

    fillInputs() {

        currentRow.children[1].textContent = loginInput.value;
        currentRow.children[2].textContent = passwordInput.value;
        currentRow.children[3].textContent = emailInput.value;
        this.loginVal = currentRow.children[1].textContent;
        this.passwordVal = currentRow.children[2].textContent;
        this.email = currentRow.children[3].textContent;
        currentRow = null;
        this.clearInputs();

    }

    editUser() {
        loginInput.value = this.loginVal;
        passwordInput.value = this.passwordVal;
        emailInput.value = this.email;
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

    function checkClassName(name) {
        return e.target.classList.contains(name);
    }

    switch (true) {
        case checkClassName('submit_button'):
            let userObj = new User();
            userObj.request();
            break;
        case checkClassName('edit_button'):
            getUserById(e.target.closest('tr'));
            userObj.editUser();
            userObj.changeEditBtn();
            break;
        case checkClassName('delete_button'):
            getUserById(e.target.closest('tr'));
            userObj.deleteUser();
            break;
        case checkClassName('edit-user_button'):
            getUserById(currentRow);
            userObj.checkEditField();
            userObj.changeAddBtn();
            break;
        case checkClassName('close'):
            modal.classList.add('hidden');
            break;
        case checkClassName('question'):
            modal.classList.remove('hidden');
            modal.classList.add('show');
            break;
    }


});
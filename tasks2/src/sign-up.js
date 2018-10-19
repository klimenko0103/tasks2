import React, { Component } from 'react';
import fetch from 'node-fetch';
import Dialog from 'react-bootstrap-dialog'

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:'',
            age:'',
            emailValid: null,
            email: '',
            login: '',
            loginValid: null,
            password: '',
            passwordValid: null,
            showLoadSignUp:null
        };
        this.handleChange = this.handleChange.bind(this);
        this.showLoaderIdentity = this.showLoaderIdentity.bind(this);
        this.hideLoaderIdentity = this.hideLoaderIdentity.bind(this);
        this.validatepassword = this.validatepassword.bind(this);
    }

    showLoaderIdentity() {
        this.setState({showLoadSignUp:true})
    }
    hideLoaderIdentity() {
        this.setState({showLoadSignUp:false})
    }

    validatepassword(password){
        if (password.trim().length > 0 && password.length===6) {
            return true
        }
        return false
    }
    validateemail(email){
        if (email.trim().length > 0 && email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            return true
        }
        return false
    }
    validatelogin(login){
        if (login.trim().length > 0) {
            return true
        }
        return false
    }


    handleChange(c){
        return (e)=>{
            let val = e.target.value;
            if (c==='name'||c==='age'){
                this.setState({[c]:val});
            }
            else {
                let valid = this['validate' + c](val);
                this.setState({[c+'Valid']:valid,[c]:val});
            }
        }
    }

    postUser() {
        let info = {
            loginValid: this.validatelogin(this.state.login),
            emailValid: this.validateemail(this.state.email),
            passwordValid: this.validatepassword(this.state.password),
        };
        info.loginColor = ((info.loginValid) ? "green" : "red");
        info.emailColor = ((info.emailValid) ? "green" : "red");
        info.passwordColor = ((info.passwordValid) ? "green" : "red");
        this.setState(info);

        let loginValid = info.loginValid;
        let emailValid = info.emailValid;
        let passwordValid = info.passwordValid;

        if (!loginValid || !emailValid || !passwordValid) {
            this.dialog.show({
                title: 'Error!!',
                body: 'Please check up correctness of all input data',
                bsSize: 'small',
                actions: [
                    Dialog.OKAction()
                ]
            }, 'btn-primary')

        }
        else {
            console.log("Sign up");
            this.showLoaderIdentity();
            fetch("http://localhost:8000/user", {
                method: "POST",
                body: JSON.stringify({
                    username: this.state.name,
                    age: this.state.age,
                    email: this.state.email,
                    login: this.state.login,
                    password: this.state.password
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(res => {
                    this.hideLoaderIdentity();
                    if (res.status !== 201) {
                        this.dialog.show({
                            title: 'Error!',
                            body: 'There is already a user with this email.Please try another.',
                            bsSize: 'small',
                            actions: [
                                Dialog.OKAction()
                            ]
                        }, 'btn-primary');
                        console.log('error ', res);
                    } else {
                        this.dialog.show({
                            title: 'Сongratulations!',
                            body: 'You are successfully registered!',
                            bsSize: 'small',
                            actions: [
                                Dialog.OKAction(() => {
                                    this.props.onChange(this.state.signUser)
                                })
                            ]
                        }, 'btn-primary')
                    }
                })
        }
    }

    render() {
        let emailColor = this.state.emailColor ;
        let loginColor = this.state.loginColor;
        let passwordColor = this.state.passwordColor;

        return (
            <div className="forms">
                <div >
                    <form action="#" id="signup" className={((this.state.showLoadSignUp)?'noEdit':'')}>
                        <div className="form-group">
                            <label htmlFor="inputName">Name</label>
                            <input type="name"  onChange={this.handleChange("name")} id="inputName" className="form-control" placeholder="Name" autoFocus />
                        </div>
                        <div className={"form-group"}>
                            <label htmlFor="inputAge">Age</label>
                            <input type="number" onChange={this.handleChange("age")} id="inputAge" className="form-control" placeholder="Age" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputEmail"> Email address</label>
                            <input type="email" onChange={this.handleChange("email")} id="inputEmail" className="form-control" placeholder="Email address" required style={{borderColor:emailColor}} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputLogin">Login</label>
                            <input type="login" onChange={this.handleChange("login")} id="inputLogin" className="form-control" placeholder="Login" required style={{borderColor:loginColor}}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputPassword"> Password</label>
                            <input type="password" onChange={this.handleChange("password")} id="inputPassword" className="form-control" placeholder="Password" required style={{borderColor:passwordColor}}/>
                            <div>{ (this.state.passwordValid || this.state.passwordValid===null) ? '' :(<span> The password must be 6 characters </span>)  }</div>
                        </div>
                        <button id="buttonForm" className="btn btn-lg btn-primary btn-block" onClick={this.postUser.bind(this)} type="button" disabled={!this.state.login | !this.state.password | !this.state.email } >{ this.state.showLoadSignUp ? <div id="loader-identity"/> : 'Sign Up' }  </button>
                        <Dialog ref={(el) => { this.dialog = el }} />
                    </form>
                </div>
            </div>
        )
    }
}




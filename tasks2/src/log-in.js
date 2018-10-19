import React, {Component} from 'react';
import fetch from "node-fetch";
import Dialog from "react-bootstrap-dialog";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            loginValid: false,
            password: '',
            passwordValid: false,
            showLoadLogin:null
        };
        this.handleChange = this.handleChange.bind(this);
        this.showLoaderIdentity = this.showLoaderIdentity.bind(this);
        this.hideLoaderIdentity = this.hideLoaderIdentity.bind(this);
        this.validatepassword = this.validatepassword.bind(this);
        this.validatelogin = this.validatelogin.bind(this);
    }

    showLoaderIdentity() {
        this.setState({showLoadLogin:true})
    }
    hideLoaderIdentity() {
        this.setState({showLoadLogin:false})
    }

    validatepassword(password){
        if (password.trim().length > 0 && password.length===6) {
            return true
        }
        return false
    }
    validatelogin(name){
        if (name.trim().length > 0) {
            return true
        }
        return false
    }

    handleChange(c){
        return (e)=>{
            let val = e.target.value;
            let valid = this['validate' + c](val);
            this.setState({[c+'Valid']:valid,[c]:val});
        }
    }

    tokenUser(userOnline) {
        console.log("Log in");
        this.showLoaderIdentity();
        fetch("http://localhost:8000/user/login", {
            method: "POST",
            body: JSON.stringify({
                login : this.state.login,
                password:this.state.password
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.status !== 200) {
                    this.dialog.show({
                        title: 'Authentication error!',
                        body: 'Incorrect login or password.Please try again',
                        bsSize: 'small',
                        actions: [
                            Dialog.OKAction(() => {
                                this.setState({showLoadLogin:false})
                            })
                        ]
                    },'btn-primary');
                    console.log('error ', response);
                    this.hideLoaderIdentity();
                }else{
                    return response.text()
                }
            })

            .then(responseText => {
                if(!responseText) return;
                localStorage.setItem('token',responseText);
                this.hideLoaderIdentity();
                userOnline = localStorage.getItem('token');
                if (!!userOnline) {
                    this.props && this.props.onChange(userOnline);
                    localStorage.setItem('token', userOnline || '');
                }
            })
            .catch(err => console.error(err))
    }

    render() {
        let loginColor = (this.state.loginValid === true) ? "green" : "red";
        let passwordColor = (this.state.passwordValid === true) ? "green" : "red";

        return (
            <div className="forms">
                <div>
                    <form action="#" id="login" className={((this.state.showLoadLogin)?'noEdit':'')}>
                        <div className="form-group">
                            <label htmlFor="inputLogin">Login</label>
                            <input type="login" onChange={this.handleChange("login")} id="inputLogin"
                                   className="form-control " placeholder="Login" required
                                   style={{borderColor: loginColor}}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputPassword"> Password</label>
                            <input type="password" onChange={this.handleChange("password")} id="inputPassword"
                                   className="form-control " placeholder="Password" required
                                   style={{borderColor: passwordColor}}/>
                        </div>
                        <button id ="buttonForm" className="btn btn-lg btn-primary btn-block" onClick={this.tokenUser.bind(this)} type="button" disabled={!this.state.login | !this.state.password}>{ this.state.showLoadLogin ? <div id="loader-identity"/> : 'Log In' } </button>
                        <Dialog ref={(el) => { this.dialog = el }} />
                    </form>
                </div>
            </div>
        )
    }
}




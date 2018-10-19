import React, { Component } from 'react';
import fetch from "node-fetch";
import Dialog from 'react-bootstrap-dialog'

export default class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:'',
            nameValid:null,
            age:'',
            ageValid:null,
            gender:'',
            password:'',
            passwordValid:null,
            _id:'',
            showLoadSave:null,
            showLoadDelete:null,
            ageColor:'',
            nameColor:''
        };

        this.handleChange = this.handleChange.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
        this.validateage = this.validateage.bind(this);
        this.validatepassword = this.validatepassword.bind(this);
        this.validatename = this.validatename.bind(this);
    }

    validatepassword(password){
        if (password.trim().length > 0 && password.length===6) {
            return true
        }
        return false
    }
    validateage(age){
        if (age.trim().length > 0 && age >= 18) {
            return true
        }
        return  false
    }
    validatename(name){
        if (name.trim().length > 0) {
            return true
        }
        return false
    }

    handleChange(c){
        return (e)=>{
                let val = e.target.value;
                if (c==='gender'){
                    this.setState({[c]:val});
                }
                else{
                    var valid = this['validate' + c](val);
                    this.setState({[c+'Valid']:valid,[c]:val});
                }
        }
    }

    showLoader(s){
        this.setState(()=> {return ({['showLoad' + s]:true})});
    }
    hideLoader(s){
        this.setState(()=> {return ({['showLoad' + s]:false})});
    }

    edit() {
        let info = {
            ageValid: this.validateage(this.state.age),
            nameValid: this.validatename(this.state.name),
            passwordValid: this.validatepassword(this.state.password),
        };
        info.ageColor = ((info.ageValid) ? "green" : "red");
        info.nameColor = ((info.nameValid) ? "green" : "red");
        info.passwordColor= ((info.passwordValid) ? "green" : "red");
        this.setState(info);

        let ageValid = info.ageValid;
        let nameValid = info.nameValid;
        let passwordValid = info.passwordValid;

        if (!ageValid || !nameValid || !passwordValid) {
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
            this.showLoader("Save");
            fetch("http://localhost:8000/user/profile", {
                method: "PUT",
                body: JSON.stringify({
                    username: this.state.name,
                    age: this.state.age,
                    password: this.state.password,
                    // token: localStorage.getItem('token'),
                    _id: this.state._id,
                    gender: this.state.gender,
                }),
                headers: {
                    'x-auth': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
            })
                .then(response => {response.text();
                    this.hideLoader("Save");
                    this.dialog.show({
                        title: 'Successfully!',
                        body: 'Data successfully changed and saved!',
                        bsSize: 'small',
                        actions: [
                            Dialog.OKAction()
                        ]
                    }, 'btn-primary')

                })
                .catch(err => console.error(err));
        }
    }

    componentDidMount(){
        fetch("http://localhost:8000/user", {
            method: "GET",
            headers: {
                'x-auth': localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.text())
            .then(responseText => {
                try {
                    var data = JSON.parse(responseText);
                } catch(err) {
                    console.log(err.message + " in " +responseText);
                    return;
                }
                this.setState({name: data.username, age: data.age,_id: data._id, gender: data.gender });
                let radios = document.getElementsByName("inlineRadioOptions");
                for(var i=0;i<radios.length;i++) {
                    if (radios[i].value === this.state.gender) {
                        radios[i].checked = true;
                    }
                }
            })
            .catch(err => console.error(err));

    }

    delete (){
        this.dialog.show({
            title: 'Are you sure?',
            body: 'Do you really want to delete this profile? After deleting account you won\'t be able to recover it.',
            bsSize: 'small',
            actions: [
                Dialog.CancelAction(),
                Dialog.Action('Delete profile',() => {
                    console.log("Delete user");
                    this.showLoader("Delete");
                    fetch("http://localhost:8000/user/profile", {
                        method: "DELETE",
                        body: JSON.stringify({
                            username :this.state.name,
                            age: this.state.age,
                            password:this.state.password,
                            _id: this.state._id,
                            gender:this.state.gender,
                        }),
                        headers: {
                            'x-auth': localStorage.getItem('token'),
                            'Content-Type': 'application/json'
                        },
                    })
                        .then(response => {response.json();
                            this.hideLoader("Delete");
                            localStorage.removeItem('token');

                        })
                        .then(() => {this.props.onChange(this.state.isOnline)})
                        .catch(err => console.error(err));
                },'btn-primary')
            ]
        })
    }

    render() {
        let passwordColor =this.state.passwordColor;
        let ageColor =  this.state.ageColor;
        let nameColor = this.state.nameColor;

        return (
            <div className="forms">
                <div >
                    <form action="#" id="edit" className={((this.state.showLoadSave||this.state.showLoadDelete)?'noEdit':'')}>
                        <h1>Profile setup</h1>

                        <div className="form-group">
                            <label htmlFor="inputName">Name</label>
                            <input type="name" value={this.state.name} onChange={this.handleChange("name")} id="inputName" className="form-control"  autoFocus style={{borderColor:nameColor}}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputAge">Age</label>
                            <input type="number" value={this.state.age} onChange={this.handleChange("age")}  id="inputAge" className="form-control" style={{borderColor:ageColor}} />
                            <div>{ (this.state.ageValid||this.state.ageValid===null) ? '' :(<span> Must be over 18 years old  </span>)  }</div>
                        </div>
                        <div className="form-group">
                        <label htmlFor="input">Gender</label>
                            <div className="form-check form-check-inline">
                                <input onChange={this.handleChange("gender")} className="form-check-input" name="inlineRadioOptions" type="radio"  id="Radios1" value="m"  />
                                <label className="form-check-label" htmlFor="Radios1">Man</label>
                                <input onChange={this.handleChange("gender")} className="form-check-input" name="inlineRadioOptions" type="radio"  id="Radios2" value="w" />
                                <label className="form-check-label" htmlFor="Radios2">Women</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputPassword"> Change password</label>
                            <input type="password" onChange={this.handleChange("password")} id="inputPassword" className="form-control" placeholder="Password" required style={{borderColor:passwordColor}}/>
                            <div>{ (this.state.passwordValid||this.state.passwordValid===null) ? '' :(<span> The password must be 6 characters </span>)  }</div>
                        </div>
                        <button id="buttonForm" className="btn btn-lg btn-primary btn-block" onClick={this.edit.bind(this)} type="button" disabled={!this.state.age && !this.state.name}>  { this.state.showLoadSave ? <div id="loader-identity"/> : 'Save' }  </button>
                        <button id="buttonForm2" className="btn btn-lg btn-primary btn-block" onClick={this.delete.bind(this)} type="button" > { this.state.showLoadDelete ? <div id="loader-identity"/> : 'Delete User' }  </button>
                        <Dialog ref={(el) => { this.dialog = el }} />

                    </form>
            </div>
            </div>

        )
    }
}
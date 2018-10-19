import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';
import Login from './log-in';
import SignUp from './sign-up';
import Edit from './profile';
import Homes from './homes';

export default class Main extends Component {
    constructor() {
        super();
        this.state = {
            extraClass1: 'active',
            extraClass2: '',
            extraClass3: 'active',
            extraClass4: '',
            isOnline: null,
            signUser:null
        }
    }

    ActiveForm(str){
        str === 'log' ? this.setState({extraClass1: 'active', extraClass2: ''}) : this.setState({extraClass1: '', extraClass2: 'active'});
       this.setState({signUser:null})
    }
    ActiveForm2(str){
        str === 'profile' ? this.setState({extraClass3: 'active', extraClass4: ''}) : this.setState({extraClass3: '', extraClass4: 'active'});
    }

    changeUser(userOnline) {
        this.setState({isOnline: userOnline});
    }

    signUser(){
        this.setState({ signUser: true});
    }

    outUser(userOnline){
        localStorage.removeItem('token');
        this.setState({isOnline:!userOnline});
        this.setState({extraClass1:'active',extraClass2:'',extraClass3:'active',extraClass4:''})
    }

    componentDidMount(){
        let storageUser = localStorage.getItem('token');
        if (storageUser) {
            try {
                this.setState({isOnline: storageUser});
            } catch (e) {
                console.warn('Can not parse user', e)
                localStorage.removeItem('token');
            }
        }
    }


    render()
    {
        var extraClass1 = this.state.extraClass1;
        var extraClass2 = this.state.extraClass2;
        var extraClass3 = this.state.extraClass3;
        var extraClass4 = this.state.extraClass4;

        var userOnline = this.state.isOnline;
        var userSign = this.state.signUser;

        return (
                <Router>
                    <div id="registration" >
                        <div className="forms1">
                            <div >
                                <ul className="nav nav-tabs nav-justified">
                                    {!userOnline && <li className={"tab " + extraClass1} onClick={this.ActiveForm.bind(this, 'log')}><Link to={'/'}>Log In</Link></li>}
                                    {!userOnline &&<li className={"tab " + extraClass2} onClick={this.ActiveForm.bind(this, 'sign')}><Link to={'/sign-up'}>Sign Up</Link></li>}
                                    {userOnline && <li className={"user " + extraClass3} onClick={this.ActiveForm2.bind(this, 'profile')}> <Link to={'/profile'}><img src={require('./2.png')} alt="profiles" height="36"/></Link></li>}
                                    {userOnline &&<li className={"tab "+ extraClass4} onClick={this.ActiveForm2.bind(this, 'homes')}><Link to={'/homes'}>Homes</Link></li>}
                                    {userOnline &&<li className={"tab " } onClick={this.outUser.bind(this)} ><Link to={'/'}>logout</Link></li>}
                                </ul>
                            </div>
                        </div>
                    <Switch>
                        <Route exact path="/" render={() => (
                            (userOnline) ? (
                                <Redirect to="/profile"/>
                            ) : (
                                <Login onChange={this.changeUser.bind(this)} />
                            )
                        )}/>
                        <Route exact path="/sign-up" render={() => (
                            (userSign) ? (
                                <Redirect to="/"/>
                            ) : (
                                <SignUp onChange={this.signUser.bind(this)}/>
                            )
                        )}/>
                        <Route exact path='/homes' component={Homes} />
                        <Route exact path="/profile" render={() => (
                            (userOnline) ? (
                                <Edit onChange={this.changeUser.bind(this)} />
                        ) : (
                                <Redirect to="/"/>
                            )
                        )}/>
                    </Switch>
                    </div>
                </Router>
        )
    }
}

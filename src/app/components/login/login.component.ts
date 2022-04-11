import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isFormSubmitted: boolean;
  isRequestInProgress: boolean;
  loginForm: FormGroup;
  isLoggedIn: boolean;
  isReqSubmitted: boolean;
  isReqSent: boolean;
  userData: any = [];
  validationMessages = {
    userEmail: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Email is incorrect.' },
    ],
    password: [{ type: 'required', message: 'Password is required.' }],
  };
  validationPattern = {
    email: new RegExp(`^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$`),
  };

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.isFormSubmitted = false;
    this.isRequestInProgress = false;
    this.isLoggedIn = false;
    this.isReqSubmitted = false;
    this.isReqSent = false;
    this.loggedIn();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loggedIn();
  }

  initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      userEmail: new FormControl('', [
        Validators.required,
        Validators.pattern(this.validationPattern.email),
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get control(): any {
    return this.loginForm.controls;
  }

  async login(): Promise<void> {
    this.isFormSubmitted = true;
    if (!this.loginForm.valid) {
      return;
    }
    const userData = JSON.parse(JSON.stringify(this.loginForm.value));
    await this.firestore
      .collection('registered-users-data')
      .stateChanges()
      .subscribe((data) => {
        if (data && data.length > 0) {
          data.forEach((data) => {
            const userDb: any = data.payload.doc.data();
            if (
              userDb.userEmail == userData.userEmail &&
              userDb.password == userData.password
            ) {
              this.toastr.success('Successful', 'Login');
              localStorage.setItem('login', 'success');
              localStorage.setItem('email', userData.userEmail);
              window.location.reload();
            }
          });
          console.log('Login Unsuccess');
          //sub.next({isSuccessful: true, phoneData: contacts, reason: null});
        } else {
          console.log('No data');
          //sub.next({isSuccessful: false, phoneData: null, reason: 'No Data'});
        }
      });
    //window.location.reload();
  }
  loggedIn(): void {
    if (localStorage.getItem('login') == 'success') {
      this.isLoggedIn = true;
      this.router.navigate(['/home']);
    }
  }

  resetLoginForm(): void {
    window.location.reload();
  }

  logout(): void {
    window.localStorage.clear();
    window.location.reload();
  }
}

import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  isFormSubmitted: boolean;
    isRequestInProgress: boolean;
    registerForm: FormGroup;
    isLoggedIn: boolean;
    isReqSubmitted: boolean;
    isReqSent: boolean;
    userData: any = [];
    validationMessages = {
        userEmail: [
            { type: 'required', message: 'Email is required.' },
            { type: 'pattern', message: 'Email is incorrect.' }
        ],
        password: [
            { type: 'required', message: 'Password is required.' }
        ],
        name: [
            { type: 'required', message: 'Name is required.'}
        ],
        phNumber: [
            { type: 'required', message: 'Number is required.' },
            { type: 'pattern', message: 'Number is incorrect.' }
        ]
    };
    validationPattern = {
      userEmail: new RegExp(`^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$`),
      phNumber: new RegExp(`[0-9]{10}$`)
  };
  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private toastr: ToastrService
  ) {
        this.isFormSubmitted = false;
        this.isRequestInProgress = false;
        this.isLoggedIn = false;
        this.isReqSubmitted = false;
        this.isReqSent = false;
        //this.isLoggedIn();
   }

  ngOnInit(): void {
    this.registrationForm();
  }

  registrationForm(): void {
    this.registerForm = this.formBuilder.group(
      {
        name: new FormControl(
          '', [Validators.required]),
        userEmail: new FormControl(
          '', [Validators.required, Validators.pattern(this.validationPattern.userEmail)]),
        phNumber: new FormControl(
          '', [Validators.required, Validators.pattern(this.validationPattern.phNumber)]),
        password: new FormControl(
          '', [Validators.required]),
      });
  }

  get control(): any {
    return this.registerForm.controls;
  }

  async register(): Promise<void> {
    this.isFormSubmitted = true;
    if (!this.registerForm.valid) {
        return;
    }
    const userData = JSON.parse(JSON.stringify(this.registerForm.value));
    const id = this.firestore.createId();
    await this.firestore.collection(`registered-users-data`).doc(id).set(userData).then((data)=>{
      console.log(data);
    });
    window.location.reload();
  }

  resetLoginForm(): void {
    window.location.reload();
  }

  logout(): void {
    window.localStorage.clear();
    window.location.reload();
}

}

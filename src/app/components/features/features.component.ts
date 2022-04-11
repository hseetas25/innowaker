import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit {
  toDoData: any = [];
  isLoggedIn: boolean;
  client: any;
  constructor(
    private firestore: AngularFirestore,
    private fauth: AngularFireAuth
  ) {
    this.toDoData = [];
    this.isLoggedIn = false;
  }

  ngOnInit(): void {
    this.getAllData();
    this.loggedIn();
  }

  async getData(ref) {
    const fId = this.firestore.createId();
    ref.value.id = fId;
    ref.value.userEmail = localStorage.getItem('email');
    console.log(ref.value);
    await this.firestore
      .collection('todo-data')
      .doc(fId)
      .set(ref.value)
      .then((data) => {
        console.log(data);
      });
    window.location.reload();
  }
  async delete(idx) {
    this.toDoData.forEach((data) => {
      if (data.id == idx) {
        this.toDoData.splice(data);
      }
    });
    await this.firestore
      .collection('todo-data')
      .doc(idx)
      .delete()
      .then((data) => {
        console.log(data);
      });
    window.location.reload();
  }

  async getAllData(): Promise<void> {
    await this.firestore
      .collection('todo-data')
      .stateChanges()
      .subscribe((data) => {
        if (data && data.length > 0) {
          data.forEach((data: any) => {
            const userdata: any = data.payload.doc.data();
            this.toDoData.push(userdata);
            let sec = new Date();
            console.log(sec);
            //setInterval(this.sendEmail, 1000);
          });
        } else {
          console.log('No Data');
        }
      });
  }

  sendEmail(): void {
    this.toDoData.forEach((data) => {
      const email: string = data.userEmail;
      const date2 = new Date(data.dt.replace('T', ' '));
      const cur = new Date();
      if (
        date2.getFullYear() == cur.getFullYear() &&
        date2.getMonth() == cur.getMonth() &&
        date2.getDate() == cur.getDate() &&
        date2.getHours() == cur.getHours() &&
        date2.getMinutes() == cur.getMinutes()
      ) {
        this.fauth.sendPasswordResetEmail(email).then((res) => {
          console.log(res);
        });
      }
    });
  }

  loggedIn(): void {
    if (localStorage.getItem('login') == 'success') {
      this.isLoggedIn = true;
    }
  }
}

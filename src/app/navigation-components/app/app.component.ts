import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor( private firestore: AngularFirestore) { }
  data: any;
  ngOnInit(): void {
    this.data = {
      'name': 'Sateesh',
      'city': 'Hyderabad'
    }
  }

  async createUser(): Promise<void> {
    console.log("Called");
    const userData = JSON.parse(JSON.stringify(this.data));
    console.log(userData)
    const id = this.firestore.createId();
    console.log(id);
    await this.firestore.collection(`registered-users-data`).doc(id).set(userData).then((data)=>{
      console.log(data);
    });
    this.firestore.collection('registered-users-data').stateChanges().subscribe((data) => {
      if (data && data.length > 0) {
        data.forEach((data) => {
          console.log(data.payload.doc.data());
        });
        //sub.next({isSuccessful: true, phoneData: contacts, reason: null});
      } else {
        console.log("No data");
        //sub.next({isSuccessful: false, phoneData: null, reason: 'No Data'});
      }
    })
    }
  }

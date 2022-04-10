import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit {

  toDoData: any = [];
  isLoggedIn: boolean;
  constructor(
    private firestore: AngularFirestore
  ) {
    this.toDoData = [];
    this.isLoggedIn = false;
  }
  ngOnInit(): void {
    this.getAllData();
    console.log(this.toDoData)
  }

  async getData(ref) {
    const fId = this.firestore.createId();
    ref.value.id = fId;
    console.log(ref.value)
    await this.firestore.collection('todo-data').doc(fId).set(ref.value).then((data)=>{
      console.log(data);
    });
    window.location.reload();
  }
  async delete(idx) {
    this.toDoData.forEach((data)=>{
      if(data.id == idx){
        this.toDoData.splice(data);
      }
    })
    await this.firestore.collection('todo-data').doc(idx).delete().then((data)=>{
      console.log(data)
    })
    window.location.reload();
  }

  async getAllData(): Promise<void> {
    await this.firestore.collection('todo-data').stateChanges().subscribe((data)=>{
      if(data && data.length > 0) {
        data.forEach((data)=>{
          this.toDoData.push(data.payload.doc.data());
        })
      }
      else {
        console.log('No Data');
      }
    })
  }

  loggedIn(): void {
    if (localStorage.getItem('login') == "success") {
        this.isLoggedIn = true;
    }
  }
}

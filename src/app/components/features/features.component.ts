import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
  ar = [];
  reverseString(str) {
    return str.split('-').reverse().join('-');
  }
  id = 0;
  getData(ref) {
    this.ar.push([
      ref.value.work,
      ref.value.desc,
      this.reverseString(ref.value.dt.split('T')[0]),
      ref.value.dt.split('T')[1],
      (this.id = this.id + 1),
    ]);
    console.log(ref.value);
    console.log(this.ar);
  }
  arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele[4] != value;
    });
  }
  delete(idn) {
    let i = 0;
    for (let ind = 0; ind < this.ar.length; ind++) {
      console.log(this.ar[ind]);
      if (idn == this.ar[ind][4]) {
        i = this.ar[ind][4];
      }
    }
    this.ar = this.arrayRemove(this.ar, i);
    console.log(i);
  }
}

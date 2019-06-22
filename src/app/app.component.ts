import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'scraper-sama';
  loading = true;
  items = [];

  constructor(public db: AngularFirestore) {
  }

  async ngOnInit() {
    await this.getItems()
    .subscribe(result => {
      this.items = result.map((x) => x.payload.doc.data());
      this.loading = false;
      // console.log(result[0].payload.doc.data());
      console.log(this.items);
    });
  }

  getItems() {
    return this.db.collection('laptops').snapshotChanges();
  }
}

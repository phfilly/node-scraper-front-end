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
  message = '';
  items = [];

  constructor(public db: AngularFirestore) { }

  async ngOnInit() {
    await this.getItems()
    .subscribe(result => {
      
      if (result.length > 0) {
        this.items = result
        .map((x) => x.payload.doc.data())
        .map((item) => {
          return {
            ...item,
            dateTime: this.convertEpocToTime(item['date']),
            price: this.priceConvert(item['price'])
          };
        })
        .sort((a, b) => a['price'] - b['price']);
      } else {
        this.message = 'No products found...';
      }
      this.loading = false;
      console.log(this.items);
    });
  }

  getItems() {
    return this.db.collection('laptops').snapshotChanges();
  }

  priceConvert(item: string) {
    if (item.includes(' X ')) {
      const tmpPrice = item.split('X');
      const totalPayment = parseInt(tmpPrice[0].trim(), 10) * parseInt(tmpPrice[1].trim(), 10);
      return totalPayment.toFixed(2);
    } else {
      return parseInt(item, 10);
    }
  }

  convertEpocToTime(epoch: number) {
    const newDate = new Date(epoch);
    return `${newDate.toLocaleString()}`;
  }
}

import { Component, inject } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { MessageComponent } from '../message/message.component';
import { AlertController, ToastController } from '@ionic/angular';
import { DataService, Message } from '../services/data.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  items: any[] = [];
  constructor(
    public alertController: AlertController,
    public toastController: ToastController
  ) {}
  ngOnInit() {
    // Lade Daten aus dem Local Storage beim Start der App
    this.loadDataFromStorage();
  }
  loadDataFromStorage() {
    const data = [localStorage.getItem("items")]

    if (data[0]){
      this.items = JSON.parse(data[0])
    }

  }
  async SaveItems() {
    const alert = await this.alertController.create({
      header: 'Eingabe',
      inputs: [
        {
          name: 'datum',
          type: 'date',
          placeholder: 'Datum',
        },
        {
          name: 'preis',
          type: 'number',
          placeholder: 'Preis(€)',
        },
        {
          name: 'supermarkt',
          type: 'text',
          placeholder: 'Supermarkt',
        },
        {
          name: 'geldempfaenger',
          type: 'text',
          placeholder: 'Geldempfänger',
        },
        {
          name: 'produkt',
          type: 'text',
          placeholder: 'Produkt',
        },
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Abgebrochen');
            alert.dismiss(); // Schließt das Alert-Fenster
            return false;
          },
        },
        {
          text: 'Speichern',
          handler: (data: any) => {
            const dataArray = Object.values(data);
  
            // Überprüfung, ob alle Eingabefelder ausgefüllt sind
            if (dataArray.every(value => typeof value === 'string' && value.trim() !== '')) {
              this.items.push(dataArray);
              this.Toast1()
              
            } else {
              this.Toast2()
            }

          },
        },
      ],
    });
  
    await alert.present();
    }
  
  SaveList() {
    localStorage.setItem("items", JSON.stringify(this.items));
  }
  refresh(event: CustomEvent) {
    // Hier kannst du die Logik für das Aktualisieren implementieren
    console.log('Refresh wurde aufgerufen', event);
  
    // Beende den Ladevorgang
    if (event.detail) {
      event.detail.complete();
    }
    }
    async Toast1() {
      const toast = await this.toastController.create({
        message: 'Daten Gespeichert',
        duration: 2000,
      });
      toast.present();
    }
    async Toast2() {
      const toast = await this.toastController.create({
        message: 'Error:Bitte Daten eingeben',
        duration: 2000,
      });
      toast.present();
    }
}

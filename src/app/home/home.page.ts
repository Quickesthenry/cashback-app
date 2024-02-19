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
    try {
      const alert = await this.alertController.create({
        header: 'Element hinzufügen',
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
            handler: async (data: any) => {
              try {
                const dataArray = Object.values(data);
  
                // Überprüfung, ob alle Eingabefelder ausgefüllt sind
                if (dataArray.every(value => typeof value === 'string' && value.trim() !== '')) {
                  const preis = parseFloat(dataArray[1] as string); // Konvertiere den Preis zu einer Zahl
                  if (!isNaN(preis) && preis < 0.01) {
                    this.Toast3();
                    return; // Füge einen Wert zurück, um den Handler zu beenden
                  } else {
                    this.items.push(dataArray);
                    this.Toast1();
                    return; // Füge einen Wert zurück, um den Handler zu beenden
                  }
                } else {
                  this.Toast2();
                  return; // Füge einen Wert zurück, um den Handler zu beenden
                }
              } catch (error) {
                console.error('Fehler beim Verarbeiten der Eingabe:', error);
              }
            },
          },
        ],
      });
  
      await alert.present();
    } catch (error) {
      console.error('Fehler beim Erstellen des Alerts:', error);
    }
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
    async Toast3() {
      const toast = await this.toastController.create({
        message: 'Error:Preis negativ oder 0 Preis',
        duration: 2000,
      });
      toast.present();
    }
    async deleteItem(index: number): Promise<void> {
      // Überprüfe, ob der Index gültig ist
      if (index >= 0 && index < this.items.length) {
        const alert = await this.alertController.create({
          header: 'Löschen bestätigen',
          message: 'Bist du sicher, dass du das Element löschen möchtest?',
          buttons: [
            {
              text: 'Abbrechen',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                return false;
              }
            },
            {
              text: 'Löschen',
              cssClass: 'delete-button',
              handler: () => {
                this.items.splice(index, 1); // Lösche das Element anhand des Index
                alert.dismiss()
                return false;
              }
            }
          ]
        });
    
        await alert.present();
      }
    }    
    async TestToast0() {
      const toast = await this.toastController.create({
        message: 'Dies Ist ein Delete Button, mit ihm kannst du Zeug löschen!',
        duration: 2000,
      });
      toast.present();
    }
}
